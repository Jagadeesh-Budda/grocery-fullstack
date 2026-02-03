/**
 * Home Dashboard API Types
 * 
 * Strict TypeScript types for the /api/home-dashboard endpoint.
 * These types match the backend API contract exactly.
 * 
 * ⚠️ DO NOT modify these types without backend coordination.
 * ⚠️ DO NOT add optional fields or calculations.
 */

/**
 * Monthly stock item - products the user buys regularly on a monthly basis.
 * Backend calculates usage patterns; frontend only displays.
 */
export interface MonthlyStock {
  productVariantId: number;
  monthlyUsage: number;
}

/**
 * Buy again item - products the user has ordered before.
 * Backend handles ordering/ranking; frontend renders as-is.
 */
export interface BuyAgain {
  productVariantId: number;
  orderCount: number;
  lastOrderedAt: string; // ISO 8601 date string
}

/**
 * Low stock item - products running low based on backend thresholds.
 * Backend determines threshold logic; frontend only displays.
 */
export interface LowStock {
  productVariantId: number;
  stock: number;
  threshold: number;
}

/**
 * Complete Home Dashboard response.
 * All arrays are guaranteed non-null by the backend.
 */
export interface HomeDashboard {
  monthlyStock: MonthlyStock[];
  buyAgain: BuyAgain[];
  lowStock: LowStock[];
}
