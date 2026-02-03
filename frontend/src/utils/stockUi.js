export function normalizeStock(raw) {
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

export function getStockLabel(stock) {
  if (typeof stock !== "number") return "In stock";
  if (stock === 0) return "Out of stock";
  if (stock === 1) return "Last item";
  if (stock >= 2 && stock <= 5) return `Only ${stock} left`;
  return "In stock";
}

export function getLowStockBadgeText(stock) {
  if (typeof stock !== "number") return null;
  if (stock <= 5) return getStockLabel(stock);
  return null;
}
