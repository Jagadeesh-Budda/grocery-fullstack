// src/features/recipes/recipes.js

export const recipes = [
  {
    id: 1,
    title: "Quick Tomato Omelette",
    mealTime: "breakfast",
    region: "generic",
    time: "10 mins",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8",
    items: [
      { variantId: 1, variantName: "Organic Eggs (6pk)", price: 120, quantity: 1, available: true },
      { variantId: 2, variantName: "Fresh Tomato (500g)", price: 30, quantity: 1, available: true }
    ]
  },
  {
    id: 4,
    title: "Idli & Sambar",
    mealTime: "breakfast",
    region: "south",
    time: "12 mins",
    image: "https://images.unsplash.com/photo-1660133411283-e26a1b3ad720",
    items: [
      { variantId: 7, variantName: "Idli Batter (500g)", price: 80, quantity: 1, available: true },
      { variantId: 8, variantName: "Sambar Masala", price: 45, quantity: 1, available: true }
    ]
  },
  {
    id: 5,
    title: "Aloo Paratha",
    mealTime: "breakfast",
    region: "north",
    time: "20 mins",
    image: "https://images.unsplash.com/photo-1627308595216-439c00b644d7",
    items: [
      { variantId: 9, variantName: "Whole Wheat Flour (1kg)", price: 55, quantity: 1, available: true },
      { variantId: 10, variantName: "Potato (1kg)", price: 35, quantity: 1, available: true }
    ]
  },
  {
    id: 6,
    title: "Curd Rice",
    mealTime: "lunch",
    region: "south",
    time: "10 mins",
    image: "https://images.unsplash.com/photo-1627308595216-439c00b644d7",
    items: [
      { variantId: 11, variantName: "Cooked Rice", price: 40, quantity: 1, available: true },
      { variantId: 12, variantName: "Curd (500g)", price: 35, quantity: 1, available: true }
    ]
  },
  {
    id: 7,
    title: "Rajma Chawal",
    mealTime: "lunch",
    region: "north",
    time: "25 mins",
    image: "https://images.unsplash.com/photo-1604908177225-6d4c1b1b79a2",
    items: [
      { variantId: 13, variantName: "Rajma (500g)", price: 85, quantity: 1, available: true },
      { variantId: 11, variantName: "Cooked Rice", price: 40, quantity: 1, available: true }
    ]
  },
  {
    id: 8,
    title: "Quick Veg Salad",
    mealTime: "lunch",
    region: "generic",
    time: "8 mins",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
    items: [
      { variantId: 2, variantName: "Fresh Tomato (500g)", price: 30, quantity: 1, available: true },
      { variantId: 6, variantName: "Capsicum (250g)", price: 35, quantity: 1, available: true }
    ]
  },
  {
    id: 2,
    title: "Fresh Fruit Bowl",
    mealTime: "snacks",
    time: "5 mins",
    image: "https://images.unsplash.com/photo-1572441710534-680cfed1ddab",
    items: [
      { variantId: 3, variantName: "Banana (1kg)", price: 60, quantity: 1, available: false },
      { variantId: 4, variantName: "Apple Gala (4pk)", price: 180, quantity: 1, available: true }
    ]
  },
  {
    id: 3,
    title: "Simple Veg Stir Fry",
    mealTime: "dinner",
    time: "15 mins",
    image: "https://images.unsplash.com/photo-1604908177225-6d4c1b1b79a2",
    items: [
      { variantId: 5, variantName: "Broccoli (250g)", price: 45, quantity: 1, available: true },
      { variantId: 6, variantName: "Capsicum (250g)", price: 35, quantity: 1, available: false }
    ]
  },
];
