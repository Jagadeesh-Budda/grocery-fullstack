import React from "react";
import MainLayout from "../layouts/MainLayout";
import ShoppingList from "../features/shopping/ShoppingList";
import CategoryGrid from "../features/discovery/CategoryGrid";

export default function Home() {
  return (
    <MainLayout
      left={<ShoppingList />}
      right={<CategoryGrid />}
    />
  );
}
