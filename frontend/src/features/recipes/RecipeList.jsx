import React, { useEffect, useState } from "react";
import { recipes } from "./recipes";
import RecipeCard from "./RecipeCard";
import {
    getHourInTimeZone,
    getStoredTimeZone,
    getStoredRegion,
    LOCATION_EVENT,
} from "../../utils/locationTime";

export default function RecipeList({ searchTerm = "" }) {
    const [timeZone, setTimeZone] = useState(() => getStoredTimeZone());
    const [region, setRegion] = useState(() => getStoredRegion());

    useEffect(() => {
        const handler = () => {
            setTimeZone(getStoredTimeZone());
            setRegion(getStoredRegion());
        };
        window.addEventListener(LOCATION_EVENT, handler);
        return () => window.removeEventListener(LOCATION_EVENT, handler);
    }, []);

    const hour = getHourInTimeZone(timeZone);

    const mealTime =
        hour >= 5 && hour < 11
            ? "breakfast"
            : hour >= 11 && hour < 15
            ? "lunch"
            : hour >= 15 && hour < 18
            ? "snacks"
            : "dinner";

    const heading =
        mealTime === "breakfast"
            ? "Breakfast Ideas"
            : mealTime === "lunch"
            ? "Lunch Picks"
            : mealTime === "snacks"
            ? "Snack Time"
            : "Dinner Ideas";

    const search = searchTerm.trim().toLowerCase();

    const filtered = recipes.filter((r) => {
        if (r.mealTime !== mealTime) return false;

        if (search) {
            const title = (r?.title ?? "").toString().toLowerCase();
            if (!title.includes(search)) return false;
        }

        // Region-based breakfast ideas with generic fallback
        if (mealTime === "breakfast") {
            if (region === "south" || region === "north") {
                return r.region === region || r.region === "generic";
            }
            return r.region === "generic";
        }

        return true;
    });

    return (
        <div className="rounded-2xl bg-white/55 backdrop-blur-xl p-4 ring-1 ring-white/30 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
            <h3 className="mb-3 text-sm font-semibold text-gray-800">
                {heading}
            </h3>

            {filtered.length === 0 ? (
                <p className="text-sm text-gray-500">
                    No recipes available for this time right now.
                </p>
            ) : (
                <div className="space-y-3">
                    {filtered.map((recipe) => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                </div>
            )}
        </div>
    );
}
