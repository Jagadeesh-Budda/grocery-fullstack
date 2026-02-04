import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  clearCart: vi.fn().mockResolvedValue(undefined),
  createOrder: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mocks.navigate,
    useLocation: () => ({ pathname: "/checkout" }),
  };
});

vi.mock("../context/CartContext", () => ({
  useCart: () => ({
    cartItems: [
      {
        variantId: 1,
        productName: "Apple",
        variantName: "Apple 1kg",
        price: 100,
        quantity: 2,
      },
    ],
    clearCart: mocks.clearCart,
    loading: false,
  }),
}));

vi.mock("../api/ordersApi", () => ({
  createOrder: mocks.createOrder,
}));

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import CheckoutPage from "../pages/CheckoutPage";

describe("Checkout order flow (E2E-style)", () => {
  beforeEach(() => {
    mocks.navigate.mockReset();
    mocks.clearCart.mockClear();
    mocks.createOrder.mockReset();
  });

  test("places order, navigates to order-success, and clears cart", async () => {
    const order = { orderId: 123, totalAmount: 250, status: "CREATED" };
    mocks.createOrder.mockResolvedValueOnce(order);

    render(
      <MemoryRouter>
        <CheckoutPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /place order/i }));

    await waitFor(() => expect(mocks.createOrder).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(mocks.clearCart).toHaveBeenCalledTimes(1));

    expect(mocks.navigate).toHaveBeenCalledWith(
      "/order-success",
      expect.objectContaining({
        replace: true,
        state: { order },
      })
    );
  });
});
