import React from "react";
import { recipes } from "./recipes";
import RecipeCard from "./RecipeCard";

export default function RecipeList() {
    return (
        <div className="rounded-2xl bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-gray-800">
                Quick Recipes
            </h3>

            <div className="space-y-3">
                {recipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
            </div>
        </div>
    );
}
