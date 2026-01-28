import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CartProvider, useCart } from "../CartContext";
import { vi } from "vitest";

/* ---------------- MOCKS ---------------- */

vi.mock("../AuthContext", () => ({
  useAuth: () => ({ user: null }),
}));

vi.mock("../../api/axios", () => ({
  default: {
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    get: vi.fn(),
  },
}));

/* ---------------- TEST COMPONENT ---------------- */

const TestComponent = () => {
  const {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  return (
    <div>
      <button
        onClick={() =>
          addItem({
            variantId: 1,
            productName: "Apple",
            variantName: "Apple 1kg",
            price: 100,
          })
        }
      >
        add
      </button>

      <button onClick={() => updateQuantity(1, +1)}>inc</button>
      <button onClick={() => updateQuantity(1, -1)}>dec</button>
      <button onClick={() => removeItem(1)}>remove</button>
      <button onClick={clearCart}>clear</button>

      <div data-testid="count">
        {items.length ? items[0].quantity : 0}
      </div>
    </div>
  );
};

/* ---------------- SETUP ---------------- */

const setup = () =>
  render(
    <CartProvider>
      <TestComponent />
    </CartProvider>
  );

/* ---------------- TESTS ---------------- */

describe("CartContext", () => {
  test("adds item to cart", () => {
    setup();
    fireEvent.click(screen.getByText("add"));

    const count = Number(screen.getByTestId("count").textContent);
    expect(count).toBeGreaterThan(0);
  });

  test("increments quantity by 1", () => {
    setup();

    fireEvent.click(screen.getByText("add"));
    const before = Number(screen.getByTestId("count").textContent);

    fireEvent.click(screen.getByText("inc"));
    const after = Number(screen.getByTestId("count").textContent);

    expect(after).toBe(before + 1);
  });

  test("decrements quantity by 1", () => {
    setup();

    fireEvent.click(screen.getByText("add"));
    const before = Number(screen.getByTestId("count").textContent);

    fireEvent.click(screen.getByText("dec"));
    const after = Number(screen.getByTestId("count").textContent);

    expect(after).toBe(before - 1);
  });

  test("does NOT remove item when quantity decreases", () => {
    setup();

    fireEvent.click(screen.getByText("add"));
    fireEvent.click(screen.getByText("dec"));

    const count = Number(screen.getByTestId("count").textContent);
    expect(count).toBeGreaterThan(0);
  });

  test("removes item explicitly", () => {
    setup();

    fireEvent.click(screen.getByText("add"));
    fireEvent.click(screen.getByText("remove"));

    expect(screen.getByTestId("count")).toHaveTextContent("0");
  });

  test("clears cart", () => {
    setup();

    fireEvent.click(screen.getByText("add"));
    fireEvent.click(screen.getByText("clear"));

    expect(screen.getByTestId("count")).toHaveTextContent("0");
  });
});
