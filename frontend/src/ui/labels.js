export const UI_LABELS = {
  search: {
    placeholder: "Search apples, rice, milk…",
  },

  dock: {
    home: "Home",
    groups: "Groups",
    search: "Search",
    cart: "My Bag",
  },

  product: {
    add: "Add",
    outOfStock: "Out of Stock",
    notifyMe: "Notify Me",
    restocking: "Restocking Soon",
    added: "Added to cart",
    outOfStockToast: "Item is out of stock",
    addAria: (name, unit) => `Add ${name}${unit ? ` (${unit})` : ""} to cart`,
  },

  actions: {
    buyAgain: {
      title: "Quick Reorder",
      description: "Reorder items you often buy",
      cta: "Reorder",
    },
    monthlyStock: {
      title: "Top Up Stock",
      description: "Top up staples for the week",
      cta: "Add Stock",
    },
    runningLow: {
      title: "Restock Alerts",
      description: "Quickly bump low-quantity items",
      cta: "Restock Now",
    },
  },
};
