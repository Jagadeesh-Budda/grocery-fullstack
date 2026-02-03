import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { homeDashboardLowStockOnlyFixture } from "./fixtures/recommendations.fixture";

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
    dismiss: vi.fn(),
  },
}));

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({ user: { id: 1, username: "Sam" } }),
}));

vi.mock("../context/CartContext", () => ({
  useCart: () => ({
    items: [],
    updateItem: vi.fn(),
  }),
}));

vi.mock("../api/homeDashboardApi", () => ({
  fetchHomeDashboard: vi.fn(async () => homeDashboardLowStockOnlyFixture),
}));

vi.mock("../features/recipes/RecipeList", () => ({
  default: function RecipeListMock() {
    return (
      <section aria-label="Dinner Ideas">
        <h2>Dinner Ideas</h2>
      </section>
    );
  },
}));

vi.mock("../features/products/ProductGrid", () => ({
  default: function ProductGridMock() {
    return <div data-testid="product-grid" />;
  },
}));

vi.mock("../components/dashboard/ProductsSection", () => ({
  default: function ProductsSectionMock({ children }: any) {
    return <section aria-label="Products">{children}</section>;
  },
}));

vi.mock("react-router-dom", async () => {
  const actual: any = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useOutletContext: () => ({ activeCategory: "", searchTerm: "" }),
    useNavigate: () => vi.fn(),
    Link: ({ to, children, ...rest }: any) => (
      <a href={typeof to === "string" ? to : "#"} {...rest}>
        {children}
      </a>
    ),
  };
});

import UserDashboard from "../pages/UserDashboard";

describe("UserDashboard — section order", () => {
  it("renders sections in DOM order: Quick Actions → Dinner Ideas → Popular Near Me → Low Stock / Restock", async () => {
    render(<UserDashboard />);

    const quickActions = screen.getByLabelText(/quick actions/i);
    const dinnerIdeas = screen.getByLabelText(/dinner ideas/i);

    // Popular near you heading exists in page markup
    const popularNearMeHeading = await screen.findByRole("heading", {
      name: /popular near you/i,
    });

    // Low-stock section title from HomeDashboardSections
    const lowStockHeading = await screen.findByRole("heading", {
      name: /running low/i,
    });

    const posQuickVsDinner = quickActions.compareDocumentPosition(dinnerIdeas);
    const posDinnerVsPopular = dinnerIdeas.compareDocumentPosition(popularNearMeHeading);
    const posPopularVsLow = popularNearMeHeading.compareDocumentPosition(lowStockHeading);

    expect(posQuickVsDinner & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(posDinnerVsPopular & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(posPopularVsLow & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
