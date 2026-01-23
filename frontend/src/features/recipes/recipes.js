// src/features/recipes/recipes.js

export const recipes = [
  {
    id: 1,
    title: "Quick Tomato Omelette",
    time: "10 mins",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8",
    items: [
      { variantId: 1, variantName: "Organic Eggs (6pk)", price: 120, quantity: 1 },
      { variantId: 2, variantName: "Fresh Tomato (500g)", price: 30, quantity: 1 }
    ]
  },
  {
    id: 2,
    title: "Fresh Fruit Bowl",
    time: "5 mins",
    image: "https://images.unsplash.com/photo-1572441710534-680cfed1ddab",
    items: [
      { variantId: 3, variantName: "Banana (1kg)", price: 60, quantity: 1 },
      { variantId: 4, variantName: "Apple Gala (4pk)", price: 180, quantity: 1 }
    ]
  },
  {
    id: 3,
    title: "Simple Veg Stir Fry",
    time: "15 mins",
    image: "https://images.unsplash.com/photo-1604908177225-6d4c1b1b79a2",
    items: [
      { variantId: 5, variantName: "Broccoli (250g)", price: 45, quantity: 1 },
      { variantId: 6, variantName: "Capsicum (250g)", price: 35, quantity: 1 }
    ]
  },
];
