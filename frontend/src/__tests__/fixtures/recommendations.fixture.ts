import type { HomeDashboard } from "../../types/homeDashboard";

// Fixtures are small, explicit, and reflect realistic API responses.
// They should not embed business logic; only provide controlled data.

export type BuyAgainApiItem = HomeDashboard["buyAgain"][number] & {
  productName?: string;
  variantName?: string;
  price?: number;
  imageUrl?: string;
  stock?: number;
};

export type MonthlyStockApiItem = HomeDashboard["monthlyStock"][number];
export type LowStockApiItem = HomeDashboard["lowStock"][number];

export const homeDashboardEmptyFixture: HomeDashboard = {
  buyAgain: [],
  monthlyStock: [],
  lowStock: [],
};

export const homeDashboardFixture: HomeDashboard & {
  buyAgain: BuyAgainApiItem[];
  monthlyStock: MonthlyStockApiItem[];
  lowStock: LowStockApiItem[];
} = {
  buyAgain: [
    {
      productVariantId: 101,
      orderCount: 3,
      lastOrderedAt: "2026-01-15T10:00:00.000Z",
      productName: "Organic Bananas",
      variantName: "1 kg",
      price: 49,
      imageUrl: "",
      stock: 12,
    },
  ],
  monthlyStock: [
    {
      productVariantId: 202,
      monthlyUsage: 4,
    },
  ],
  lowStock: [
    {
      productVariantId: 101,
      stock: 1,
      threshold: 2,
    },
  ],
};

export const homeDashboardBuyAgainOnlyFixture: HomeDashboard & {
  buyAgain: BuyAgainApiItem[];
} = {
  buyAgain: homeDashboardFixture.buyAgain,
  monthlyStock: [],
  lowStock: [],
};

export const homeDashboardMonthlyOnlyFixture: HomeDashboard = {
  buyAgain: [],
  monthlyStock: homeDashboardFixture.monthlyStock,
  lowStock: [],
};

export const homeDashboardLowStockOnlyFixture: HomeDashboard = {
  buyAgain: [],
  monthlyStock: [],
  lowStock: homeDashboardFixture.lowStock,
};
