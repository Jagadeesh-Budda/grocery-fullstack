import React, { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import ShoppingList from "../features/shopping/ShoppingList";
import CategoryGrid from "../features/discovery/CategoryGrid";
import ProductGrid from "../features/products/ProductGrid";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const shoppingItems = [
    {
      id: 1,
      name: "Wheat Flour",
      category: "grains",
      quantity: 15,
    },
    {
      id: 2,
      name: "Sugar",
      category: "condiments",
      quantity: 20,
    },
    {
      id: 3,
      name: "Milk",
      category: "dairy",
      quantity: 2,
    },
  ];

  const sampleProducts = [
    { id: 1, name: "Tomatoes", image: "", pricePerKg: 2.5 },
    { id: 2, name: "Potatoes", image: "", pricePerKg: 1.2 },
    { id: 3, name: "Onions", image: "", pricePerKg: 1.8 },
    { id: 4, name: "Apples", image: "", pricePerKg: 3.4 },
  ];

  const handleAddToCart = (product) => {
    // placeholder handler
    // eslint-disable-next-line no-console
    console.log("Add to cart:", product);
  };

  return (
    <MainLayout
      left={
        <ShoppingList
          items={shoppingItems}
          selectedCategory={selectedCategory}
        />
      }
      right={
        <div>
          <CategoryGrid
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          <ProductGrid products={sampleProducts} onAddToCart={handleAddToCart} />
        </div>
      }
    />
  );
}
