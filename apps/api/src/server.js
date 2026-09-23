import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// 1) Criamos o servidor Express
const app = express();

// 2) Definimos porta e origem permitida
const port = process.env.API_PORT || 3000;
const appUrl = process.env.APP_URL || "http://localhost:5173";
const allowedOrigins = [
  appUrl,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174"
].filter(Boolean);

// 3) Configuração de segurança e comunicação
// Helmet protege headers do servidor
// CORS permite o frontend acessar a API
// Express JSON faz o servidor entender JSON
// Morgan mostra logs das requisições no terminal
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
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

// 7) Inicia o servidor na porta escolhida
app.listen(port, () => {
  console.log(`FastTrack API rodando em http://localhost:${port}`);
});
