import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import BuyAgainCard from "../components/dashboard/BuyAgainCard";
const mockOnNavigate = vi.fn();

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const addToCartMock = vi.fn(async () => undefined);


vi.mock("../context/CartContext", () => ({
  useCart: () => ({
    addToCart: addToCartMock,
  }),
}));

describe("BuyAgainCard", () => {
  beforeEach(() => {
    addToCartMock.mockClear();
  });

  it("opens confirm modal when clicking Buy again", async () => {
    render(
      <BuyAgainCard
        onNavigate={mockOnNavigate}
        item={{
          productVariantId: 101,
          orderCount: 3,
          lastOrderedAt: "2026-01-15T10:00:00.000Z",
        }}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /buy again/i }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("confirms and calls addToCart with variantId and quantity=1", async () => {
    render(
      <BuyAgainCard
        onNavigate={mockOnNavigate}
        item={{
          productVariantId: 101,
          orderCount: 3,
          lastOrderedAt: "2026-01-15T10:00:00.000Z",
        }}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /buy again/i }));

    // Confirm the modal action
    fireEvent.click(await screen.findByRole("button", { name: /add to cart/i }));

    await waitFor(() => {
      expect(addToCartMock).toHaveBeenCalledTimes(1);
    });

    expect(addToCartMock).toHaveBeenCalledWith(
      expect.objectContaining({ variantId: 101 }),
      1
    );
  });
});
