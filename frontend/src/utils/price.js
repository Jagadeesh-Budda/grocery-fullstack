// Central price resolver to avoid backend schema mismatch
export const resolvePrice = (product) => {
  if (!product) return 0;
  
  const candidates = [
    product.price,
    product.sellingPrice,
    product.mrp,
    product.basePrice,
    product.pricePerKg,
    product.unitPrice,
    product.pricePerUnit,
    product.amount,
    product.pricing?.sellingPrice,
    product.pricing?.price,
    product.pricing?.mrp,
    product.pricing?.basePrice,
    product.pricing?.amount
  ];

  for (const val of candidates) {
    if (val !== undefined && val !== null) {
      const num = Number(val);
      if (!isNaN(num)) return num;
    }
  }
  
  return 0;
};
