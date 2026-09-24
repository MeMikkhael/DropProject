const CENTS_FACTOR = 100;

function roundToCents(value) {
  return Math.round(value * CENTS_FACTOR) / CENTS_FACTOR;
}

export function calculateSuggestedPrice({
  supplierPrice,
  shippingCost = 0,
  additionalCosts = 0,
  marginPercent = 30
}) {
  const productCost = Number(supplierPrice);
  const shipping = Number(shippingCost) || 0;
  const extraCosts = Number(additionalCosts) || 0;
  const margin = Number(marginPercent);

  if (!Number.isFinite(productCost) || productCost < 0) {
    throw new Error("O preço do fornecedor precisa ser um número válido.");
  }

  if (!Number.isFinite(margin) || margin < 0) {
    throw new Error("A margem precisa ser um número válido.");
  }

  const totalCost = productCost + shipping + extraCosts;
  const suggestedPrice = totalCost * (1 + margin / 100);

  return roundToCents(suggestedPrice);
}
