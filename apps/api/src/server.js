import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { pool } from "./db.js";
import {
  buildDuplicateKey,
  getDemoMercadoLivreRecommendations,
  normalizeUrl
} from "./services/mercadoLivreProvider.js";
import { calculateSuggestedPrice } from "./services/pricing.js";

// 1) Criamos o servidor Express
const app = express();

// 2) Definimos porta e origem permitida
const port = process.env.API_PORT || 3000;
const appUrl = process.env.APP_URL || "http://localhost:5173";
const MAX_PENDING_RECOMMENDATIONS = 100;
const RECOMMENDATION_EXPIRATION_DAYS = 30;
const allowedOrigins = [
  appUrl,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174"
].filter(Boolean);

function isLocalDevelopmentOrigin(origin) {
  return /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);
}

// 3) Configuração de segurança e comunicação
// Helmet protege headers do servidor
// CORS permite o frontend acessar a API
// Express JSON faz o servidor entender JSON
// Morgan mostra logs das requisições no terminal
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        isLocalDevelopmentOrigin(origin)
      ) {
        callback(null, true);
        return;
      }

      callback(new Error("A origem não está autorizada pelo CORS."));
    }
  })
);
app.use(express.json());
app.use(morgan("dev"));

// 4) Função que retorna os dados da visão geral da loja
function buildOverviewPayload() {
  return {
    brand: "FastTrack",
    market: "Brasil",
    currency: "BRL",
    paymentProvider: "Mercado Pago",
    phase: "Fase 1 - base do projeto"
  };
}

// 5) Rota de saúde do servidor
// Serve para testar se a API está funcionando
app.get("/health", (request, response) => {
  response.json({
    status: "ok",
    service: "fasttrack-api",
    environment: process.env.NODE_ENV || "development"
  });
});

// 6) Rota principal para o frontend buscar os dados da loja
app.get("/api/overview", (request, response) => {
  response.json(buildOverviewPayload());
});

//7( Rota para buscar os produtos do banco de dados
app.get("/api/products", async (request, response) => {
  try {
    const result = await pool.query("SELECT * FROM products");

    response.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);

    response.status(500).json({
      error: "Erro ao buscar produtos"
    });
  }
});

// Remove recomendações que ficaram pendentes por mais de 30 dias.
async function cleanupExpiredRecommendations() {
  const result = await pool.query(
    `DELETE FROM product_recommendations
     WHERE status = 'PENDING'
       AND created_at < NOW() - INTERVAL '${RECOMMENDATION_EXPIRATION_DAYS} days'
     RETURNING id`
  );

  if (result.rowCount > 0) {
    console.log(`Recomendações expiradas removidas: ${result.rowCount}`);
  }
}

// 8) Lista recomendações pendentes para o painel administrativo.
app.get("/api/recommendations", async (request, response) => {
  try {
    await cleanupExpiredRecommendations();

    const result = await pool.query(
      "SELECT * FROM product_recommendations WHERE status = 'PENDING' ORDER BY created_at DESC"
    );

    response.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar recomendações:", error);

    response.status(500).json({
      error: "Erro ao buscar recomendações"
    });
  }
});

async function insertRecommendation(client, recommendation) {
  const result = await client.query(
    `INSERT INTO product_recommendations
      (name, description, supplier_url, supplier_price, shipping_cost,
       suggested_price, image_url, status, source, source_product_id, stock,
       additional_costs, margin_percent, collected_at, last_checked_at,
       duplicate_key)
     VALUES ($1, $2, $3, $4, $5, $6, $7, 'PENDING', $8, $9, $10, $11, $12,
       $13, $14, $15)
     ON CONFLICT (duplicate_key) WHERE duplicate_key IS NOT NULL DO NOTHING
     RETURNING *`,
    [
      recommendation.name,
      recommendation.description,
      recommendation.supplier_url,
      recommendation.supplier_price,
      recommendation.shipping_cost,
      recommendation.suggested_price,
      recommendation.image_url,
      recommendation.source,
      recommendation.source_product_id,
      recommendation.stock,
      recommendation.additional_costs,
      recommendation.margin_percent,
      recommendation.collected_at,
      recommendation.last_checked_at,
      recommendation.duplicate_key
    ]
  );

  return result.rows[0] ?? null;
}

async function withPendingLimit(callback, requiredSlots = 1) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock($1)", [731004]);
    await client.query(
      `DELETE FROM product_recommendations
       WHERE status = 'PENDING'
         AND created_at < NOW() - INTERVAL '${RECOMMENDATION_EXPIRATION_DAYS} days'`
    );

    const countResult = await client.query(
      "SELECT COUNT(*)::int AS total FROM product_recommendations WHERE status = 'PENDING'"
    );

    if (
      countResult.rows[0].total + requiredSlots >
      MAX_PENDING_RECOMMENDATIONS
    ) {
      await client.query("ROLLBACK");
      return { client: null, limitReached: true };
    }

    const result = await callback(client);
    await client.query("COMMIT");

    return { client: null, result };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

// 9) Cadastra uma recomendação criada pelo scraper ou manualmente.
app.post("/api/recommendations", async (request, response) => {
  const {
    name,
    description,
    supplier_url,
    supplier_price,
    shipping_cost,
    suggested_price,
    image_url,
    source = "MANUAL",
    source_product_id,
    stock = 0,
    additional_costs = 0,
    margin_percent = 30
  } = request.body;

  if (!name) {
    return response.status(400).json({
      error: "name é obrigatório"
    });
  }

  const supplierPrice = supplier_price == null ? null : Number(supplier_price);
  const shippingCost = shipping_cost == null ? null : Number(shipping_cost);
  const additionalCosts = Number(additional_costs) || 0;
  const marginPercent = Number(margin_percent);
  const suggestedPrice =
    suggested_price == null
      ? calculateSuggestedPrice({
          supplierPrice,
          shippingCost,
          additionalCosts,
          marginPercent
        })
      : Number(suggested_price);

  if (
    !Number.isFinite(supplierPrice) ||
    !Number.isFinite(suggestedPrice) ||
    !Number.isFinite(shippingCost) ||
    !Number.isFinite(additionalCosts) ||
    !Number.isFinite(marginPercent)
  ) {
    return response.status(400).json({
      error: "Os preços precisam ser números válidos"
    });
  }

  try {
    const result = await withPendingLimit((client) =>
      insertRecommendation(client, {
        name: name.trim(),
        description: description ?? null,
        supplier_url: normalizeUrl(supplier_url),
        supplier_price: supplierPrice,
        shipping_cost: shippingCost,
        suggested_price: suggestedPrice,
        image_url: image_url ?? null,
        source,
        source_product_id: source_product_id ?? null,
        stock: Number(stock) || 0,
        additional_costs: additionalCosts,
        margin_percent: marginPercent,
        collected_at: new Date(),
        last_checked_at: new Date(),
        duplicate_key: buildDuplicateKey({
          source,
          sourceProductId: source_product_id,
          supplierUrl: supplier_url
        })
      })
    );

    if (result.limitReached) {
      return response.status(409).json({
        error: `O limite de ${MAX_PENDING_RECOMMENDATIONS} recomendações pendentes foi atingido.`
      });
    }

    if (!result.result) {
      return response.status(409).json({
        error: "Esta recomendação já existe."
      });
    }

    return response.status(201).json(result.result);
  } catch (error) {
    console.error("Erro ao cadastrar recomendação:", error);

    return response.status(500).json({
      error: "Erro ao cadastrar recomendação"
    });
  }
});

// 10) Importa dados simulados do Mercado Livre enquanto o OAuth não existe.
app.post("/api/recommendations/import/mercado-livre", async (request, response) => {
  const marginPercent = Number(request.body.margin_percent ?? 30);

  if (!Number.isFinite(marginPercent) || marginPercent < 0) {
    return response.status(400).json({
      error: "A margem precisa ser um número válido."
    });
  }

  try {
    const recommendations = getDemoMercadoLivreRecommendations(marginPercent);
    const result = await withPendingLimit(async (client) => {
      const created = [];
      const duplicates = [];

      for (const recommendation of recommendations) {
        const saved = await insertRecommendation(client, recommendation);

        if (saved) {
          created.push(saved);
        } else {
          duplicates.push(recommendation.duplicate_key);
        }
      }

      return { created, duplicates };
    }, 2);

    if (result.limitReached) {
      return response.status(409).json({
        error: `O limite de ${MAX_PENDING_RECOMMENDATIONS} recomendações pendentes foi atingido.`
      });
    }

    return response.status(201).json(result.result);
  } catch (error) {
    console.error("Erro ao importar recomendações do Mercado Livre:", error);

    return response.status(500).json({
      error: "Erro ao importar recomendações do Mercado Livre"
    });
  }
});

// 11) Aprova uma recomendação e cria o produto correspondente.
app.post("/api/recommendations/:id/approve", async (request, response) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const recommendationResult = await client.query(
      "SELECT * FROM product_recommendations WHERE id = $1 AND status = 'PENDING' FOR UPDATE",
      [request.params.id]
    );

    if (recommendationResult.rowCount === 0) {
      await client.query("ROLLBACK");

      return response.status(404).json({
        error: "Recomendação pendente não encontrada"
      });
    }

    const recommendation = recommendationResult.rows[0];
    const productResult = await client.query(
      `INSERT INTO products
        (name, description, price, stock, image_url, supplier_url, active)
       VALUES ($1, $2, $3, $4, $5, $6, TRUE)
       RETURNING *`,
      [
        recommendation.name,
        recommendation.description,
        recommendation.suggested_price,
        recommendation.stock ?? 0,
        recommendation.image_url,
        recommendation.supplier_url
      ]
    );

    await client.query(
      "UPDATE product_recommendations SET status = 'APPROVED', reviewed_at = NOW() WHERE id = $1",
      [request.params.id]
    );

    await client.query("COMMIT");

    return response.status(201).json({
      recommendation,
      product: productResult.rows[0]
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Erro ao aprovar recomendação:", error);

    return response.status(500).json({
      error: "Erro ao aprovar recomendação"
    });
  } finally {
    client.release();
  }
});

// 11) Rejeita uma recomendação sem criar um produto.
app.post("/api/recommendations/:id/reject", async (request, response) => {
  try {
    const result = await pool.query(
      `UPDATE product_recommendations
       SET status = 'REJECTED', reviewed_at = NOW()
       WHERE id = $1 AND status = 'PENDING'
       RETURNING *`,
      [request.params.id]
    );

    if (result.rowCount === 0) {
      return response.status(404).json({
        error: "Recomendação pendente não encontrada"
      });
    }

    return response.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao rejeitar recomendação:", error);

    return response.status(500).json({
      error: "Erro ao rejeitar recomendação"
    });
  }
});

// 12) Limpa pendências antigas na inicialização e uma vez por dia.
cleanupExpiredRecommendations().catch((error) => {
  console.error("Erro na limpeza inicial de recomendações:", error);
});

const cleanupTimer = setInterval(() => {
  cleanupExpiredRecommendations().catch((error) => {
    console.error("Erro na limpeza de recomendações:", error);
  });
}, 24 * 60 * 60 * 1000);

cleanupTimer.unref();

// 13) Inicia o servidor na porta escolhida
app.listen(port, () => {
  console.log(`FastTrack API rodando em http://localhost:${port}`);
});

