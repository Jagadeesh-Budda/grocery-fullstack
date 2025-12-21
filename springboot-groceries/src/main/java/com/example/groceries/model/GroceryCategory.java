package com.example.groceries.model;

public enum GroceryCategory {
    DAILY_ESSENTIALS("Daily Essentials"),
    FRUITS("Fruits"),
    VEGETABLES("Vegetables"),
    BEVERAGES("Beverages"),
    SNACKS("Snacks"),
    DAIRY("Dairy"),
    MEAT("Meat & Seafood"),
    BAKERY("Bakery"),
    FROZEN("Frozen Foods"),
    OTHER("Other");

    private final String displayName;

    GroceryCategory(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static String[] getAllDisplayNames() {
        GroceryCategory[] categories = values();
        String[] names = new String[categories.length];
        for (int i = 0; i < categories.length; i++) {
            names[i] = categories[i].getDisplayName();
        }
        return names;
    }
}


