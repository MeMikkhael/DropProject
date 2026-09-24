import { calculateSuggestedPrice } from "./pricing.js";

const DEFAULT_MARGIN_PERCENT = 30;

// Dados simulados enquanto o OAuth e a API oficial não estão configurados.
const DEMO_MERCADO_LIVRE_ITEMS = [
  {
    sourceProductId: "MLB-DEMO-001",
    name: "Suporte articulado para notebook",
    description: "Suporte ajustável para notebook com estrutura metálica.",
    supplierUrl: "https://produto.mercadolivre.com.br/MLB-DEMO-001",
    supplierPrice: 79.9,
    shippingCost: 12,
    additionalCosts: 0,
    imageUrl: "https://http2.mlstatic.com/D_NQ_NP_2X_demo-suporte-notebook.jpg",
    stock: 18
  },
  {
    sourceProductId: "MLB-DEMO-002",
    name: "Hub USB-C 7 em 1",
    description: "Hub USB-C com HDMI, USB 3.0 e leitor de cartao.",
    supplierUrl: "https://produto.mercadolivre.com.br/MLB-DEMO-002",
    supplierPrice: 119.9,
    shippingCost: 15,
    additionalCosts: 0,
    imageUrl: "https://http2.mlstatic.com/D_NQ_NP_2X_demo-hub-usbc.jpg",
    stock: 12
  }
];

export function normalizeUrl(url) {
  if (!url) {
    return null;
  }

  try {
    const parsedUrl = new URL(url);
    parsedUrl.search = "";
    parsedUrl.hash = "";
    return parsedUrl.toString().replace(/\/$/, "").toLowerCase();
  } catch {
    return String(url).trim().toLowerCase();
  }
}

export function buildDuplicateKey({ source, sourceProductId, supplierUrl }) {
  const identifier = sourceProductId || normalizeUrl(supplierUrl);

  if (!identifier) {
    return null;
  }

  return `${source}:${identifier}`.toLowerCase();
}

export function normalizeMercadoLivreItem(item, marginPercent = DEFAULT_MARGIN_PERCENT) {
  const supplierPrice = Number(item.supplierPrice);
  const shippingCost = Number(item.shippingCost) || 0;
  const additionalCosts = Number(item.additionalCosts) || 0;
  const suggestedPrice = calculateSuggestedPrice({
    supplierPrice,
    shippingCost,
    additionalCosts,
    marginPercent
  });

  return {
    name: item.name?.trim(),
    description: item.description?.trim() || null,
    supplier_url: normalizeUrl(item.supplierUrl),
    supplier_price: supplierPrice,
    shipping_cost: shippingCost,
    suggested_price: suggestedPrice,
    image_url: item.imageUrl || null,
    source: "MERCADO_LIVRE",
    source_product_id: item.sourceProductId || null,
    stock: Number.isInteger(item.stock) ? item.stock : 0,
    additional_costs: additionalCosts,
    margin_percent: Number(marginPercent),
    collected_at: new Date(),
    last_checked_at: new Date(),
    duplicate_key: buildDuplicateKey({
      source: "MERCADO_LIVRE",
      sourceProductId: item.sourceProductId,
      supplierUrl: item.supplierUrl
    })
  };
}

export function getDemoMercadoLivreRecommendations(marginPercent) {
  return DEMO_MERCADO_LIVRE_ITEMS.map((item) =>
    normalizeMercadoLivreItem(item, marginPercent)
  );
}
