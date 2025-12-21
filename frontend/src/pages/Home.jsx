import React, { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import ShoppingList from "../features/shopping/ShoppingList";
import CategoryGrid from "../features/discovery/CategoryGrid";

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

  return (
    <MainLayout
      left={
        <ShoppingList
          items={shoppingItems}
          selectedCategory={selectedCategory}
        />
      }
      right={
        <CategoryGrid
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      }
    />
  );
}
