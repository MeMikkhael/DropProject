export function formatMoneyBRL(valueInCents) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(valueInCents / 100);
}

export function calculateSalePrice({ productCostInCents, shippingCostInCents, marginPercent }) {
  const baseCost = productCostInCents + shippingCostInCents;
  const marginMultiplier = 1 + marginPercent / 100;

  return Math.ceil(baseCost * marginMultiplier);
}
