import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import {
  BuyAgainSection,
  MonthlyStockSection,
  LowStockSection,
} from "../components/dashboard/HomeDashboardSections";

import {
  homeDashboardBuyAgainOnlyFixture,
  homeDashboardMonthlyOnlyFixture,
  homeDashboardLowStockOnlyFixture,
} from "./fixtures/recommendations.fixture";

// BuyAgainSection renders BuyAgainCard, which consumes CartContext.
// Sections are render-only; we mock CartContext here only to avoid provider setup.
vi.mock("../context/CartContext", () => ({
  useCart: () => ({
    addToCart: vi.fn(async () => undefined),
  }),
}));

/**
 * Architecture rule:
 * - Sections (BuyAgainSection, MonthlyStockSection, LowStockSection) are render/visibility only.
 * - Interaction logic is owned by card components.
 *
 * Therefore these tests assert ONLY rendering and hiding behavior.
 */

describe("Home Dashboard Sections — render-only", () => {
  const onItemClick = vi.fn();

  it("Buy Again: hides when items are empty and showEmpty=false", () => {
    render(<BuyAgainSection items={[]} showEmpty={false} onItemClick={onItemClick} />);
    expect(screen.queryByRole("heading", { name: /buy again/i })).not.toBeInTheDocument();
  });

  it("Buy Again: renders when items exist", () => {
    render(
      <BuyAgainSection
        items={homeDashboardBuyAgainOnlyFixture.buyAgain}
        showEmpty={false}
        onItemClick={onItemClick}
      />
    );

    expect(screen.getByRole("heading", { name: /buy again/i })).toBeInTheDocument();
    // Presence of at least one Buy Again action button indicates an item rendered.
    expect(screen.getAllByRole("button", { name: /buy again/i }).length).toBeGreaterThan(0);
  });

  it("Monthly Stock: hides when items are empty and showEmpty=false", () => {
    render(<MonthlyStockSection items={[]} showEmpty={false} onItemClick={onItemClick} />);
    expect(screen.queryByRole("heading", { name: /monthly stock/i })).not.toBeInTheDocument();
  });

  it("Monthly Stock: renders when items exist", () => {
    render(
      <MonthlyStockSection
        items={homeDashboardMonthlyOnlyFixture.monthlyStock}
        showEmpty={false}
        onItemClick={onItemClick}
      />
    );

    expect(screen.getByRole("heading", { name: /monthly stock/i })).toBeInTheDocument();
    // Presence of at least one "Add to cart" icon button indicates an item rendered.
    expect(screen.getAllByRole("button", { name: /add to cart/i }).length).toBeGreaterThan(0);
  });

  it("Running Low: hides when items are empty and showEmpty=false", () => {
    render(<LowStockSection items={[]} showEmpty={false} onItemClick={onItemClick} />);
    expect(screen.queryByRole("heading", { name: /running low/i })).not.toBeInTheDocument();
  });

  it("Running Low: renders when items exist", () => {
    render(
      <LowStockSection
        items={homeDashboardLowStockOnlyFixture.lowStock}
        showEmpty={false}
        onItemClick={onItemClick}
      />
    );

    expect(screen.getByRole("heading", { name: /running low/i })).toBeInTheDocument();
    // Presence of at least one Restock icon button indicates an item rendered.
    expect(screen.getAllByRole("button", { name: /restock/i }).length).toBeGreaterThan(0);
  });
});
