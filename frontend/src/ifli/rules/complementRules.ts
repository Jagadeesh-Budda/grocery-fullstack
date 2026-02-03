/**
 * Bundle Opportunity — Complement Rules
 * Static rule-based detection for complementary products.
 * 
 * Rules define: when cart contains items from trigger categories,
 * suggest items from complement category if missing.
 */

export interface ComplementRule {
  /** Rule identifier */
  id: string;
  /** Categories that trigger this rule (need 2+ items from these) */
  triggerCategories: string[];
  /** Category that should be present but is missing */
  complementCategory: string;
  /** Suggested product name for display */
  suggestedProduct: string;
  /** Optional product ID for quick-add (if known) */
  suggestedProductId?: string;
  /** Confidence boost (0-5) — how strong is this pairing? */
  matchStrength: number;
  /** Human-readable meal/context name */
  contextName: string;
}

/**
 * Static complement rules — no ML, no backend.
 * Match strength: 1-5 (affects confidence calculation)
 */
export const COMPLEMENT_RULES: ComplementRule[] = [
  // Pasta combinations
  {
    id: "pasta-cheese",
    triggerCategories: ["pasta", "sauce", "marinara", "alfredo"],
    complementCategory: "cheese",
    suggestedProduct: "Parmesan Cheese",
    matchStrength: 5,
    contextName: "pasta",
  },
  {
    id: "pasta-garlic-bread",
    triggerCategories: ["pasta", "sauce"],
    complementCategory: "bread",
    suggestedProduct: "Garlic Bread",
    matchStrength: 4,
    contextName: "pasta dinner",
  },

  // Breakfast combinations
  {
    id: "bread-butter",
    triggerCategories: ["bread", "toast", "bagels"],
    complementCategory: "spread",
    suggestedProduct: "Butter",
    matchStrength: 4,
    contextName: "breakfast",
  },
  {
    id: "eggs-bacon",
    triggerCategories: ["eggs"],
    complementCategory: "bacon",
    suggestedProduct: "Bacon",
    matchStrength: 4,
    contextName: "breakfast",
  },
  {
    id: "cereal-milk",
    triggerCategories: ["cereal", "granola"],
    complementCategory: "milk",
    suggestedProduct: "Milk",
    matchStrength: 5,
    contextName: "breakfast",
  },

  // Snack combinations
  {
    id: "chips-dip",
    triggerCategories: ["chips", "tortilla chips", "nachos"],
    complementCategory: "dip",
    suggestedProduct: "Salsa",
    matchStrength: 5,
    contextName: "snacking",
  },
  {
    id: "chips-guac",
    triggerCategories: ["tortilla chips", "nachos"],
    complementCategory: "guacamole",
    suggestedProduct: "Guacamole",
    matchStrength: 4,
    contextName: "Mexican snacks",
  },

  // Beverage combinations
  {
    id: "coffee-creamer",
    triggerCategories: ["coffee", "espresso"],
    complementCategory: "creamer",
    suggestedProduct: "Coffee Creamer",
    matchStrength: 4,
    contextName: "coffee",
  },
  {
    id: "tea-honey",
    triggerCategories: ["tea", "herbal tea"],
    complementCategory: "honey",
    suggestedProduct: "Honey",
    matchStrength: 3,
    contextName: "tea time",
  },

  // Sandwich combinations
  {
    id: "sandwich-condiment",
    triggerCategories: ["deli meat", "sliced cheese", "lunch meat"],
    complementCategory: "condiment",
    suggestedProduct: "Mayonnaise",
    matchStrength: 3,
    contextName: "sandwiches",
  },
  {
    id: "burger-buns",
    triggerCategories: ["ground beef", "burger patties"],
    complementCategory: "buns",
    suggestedProduct: "Hamburger Buns",
    matchStrength: 5,
    contextName: "burgers",
  },

  // Salad combinations
  {
    id: "salad-dressing",
    triggerCategories: ["lettuce", "salad mix", "greens"],
    complementCategory: "dressing",
    suggestedProduct: "Ranch Dressing",
    matchStrength: 4,
    contextName: "salad",
  },
  {
    id: "salad-croutons",
    triggerCategories: ["lettuce", "salad mix"],
    complementCategory: "croutons",
    suggestedProduct: "Croutons",
    matchStrength: 3,
    contextName: "salad",
  },

  // Taco/Mexican combinations
  {
    id: "taco-shells",
    triggerCategories: ["ground beef", "taco seasoning"],
    complementCategory: "taco shells",
    suggestedProduct: "Taco Shells",
    matchStrength: 5,
    contextName: "tacos",
  },
  {
    id: "taco-cheese",
    triggerCategories: ["taco shells", "tortillas", "taco seasoning"],
    complementCategory: "shredded cheese",
    suggestedProduct: "Shredded Cheese",
    matchStrength: 4,
    contextName: "tacos",
  },

  // Pizza combinations
  {
    id: "pizza-ranch",
    triggerCategories: ["frozen pizza", "pizza"],
    complementCategory: "dipping sauce",
    suggestedProduct: "Ranch Dressing",
    matchStrength: 3,
    contextName: "pizza night",
  },
];

/**
 * Category aliases — map common product categories to rule categories
 * This helps match real product categories to our rule triggers
 */
export const CATEGORY_ALIASES: Record<string, string[]> = {
  pasta: ["pasta", "spaghetti", "penne", "linguine", "fettuccine", "macaroni"],
  sauce: ["sauce", "marinara", "alfredo", "pesto", "pasta sauce", "tomato sauce"],
  cheese: ["cheese", "parmesan", "mozzarella", "cheddar", "shredded cheese"],
  bread: ["bread", "loaf", "baguette", "rolls", "toast"],
  spread: ["butter", "margarine", "cream cheese", "jam", "jelly", "peanut butter"],
  chips: ["chips", "potato chips", "tortilla chips", "corn chips"],
  dip: ["salsa", "dip", "hummus", "queso", "guacamole"],
  milk: ["milk", "whole milk", "2% milk", "skim milk", "oat milk", "almond milk"],
  eggs: ["eggs", "egg", "dozen eggs"],
  bacon: ["bacon", "turkey bacon"],
  coffee: ["coffee", "ground coffee", "coffee beans", "espresso"],
  creamer: ["creamer", "half and half", "coffee creamer", "oat creamer"],
};

/**
 * Normalize a category string to match against rules
 */
export function normalizeCategory(category: string): string[] {
  const lower = category.toLowerCase().trim();
  
  // Check if it matches any alias
  for (const [canonical, aliases] of Object.entries(CATEGORY_ALIASES)) {
    if (aliases.some(alias => lower.includes(alias) || alias.includes(lower))) {
      return [canonical, lower];
    }
  }
  
  return [lower];
}

/**
 * Find matching complement rules for a set of cart categories
 */
export function findMatchingRules(
  cartCategories: string[],
  cartCategorySet: Set<string>
): Array<{ rule: ComplementRule; matchCount: number }> {
  const normalizedCart = new Set<string>();
  
  // Normalize all cart categories
  for (const cat of cartCategories) {
    for (const normalized of normalizeCategory(cat)) {
      normalizedCart.add(normalized);
    }
  }
  
  const matches: Array<{ rule: ComplementRule; matchCount: number }> = [];
  
  for (const rule of COMPLEMENT_RULES) {
    // Count how many trigger categories are in cart
    let matchCount = 0;
    for (const trigger of rule.triggerCategories) {
      if (normalizedCart.has(trigger)) {
        matchCount++;
      }
    }
    
    // Need at least 1 trigger match
    if (matchCount === 0) continue;
    
    // Check if complement category is missing
    const complementNormalized = normalizeCategory(rule.complementCategory);
    const hasComplement = complementNormalized.some(c => normalizedCart.has(c));
    
    if (!hasComplement) {
      matches.push({ rule, matchCount });
    }
  }
  
  // Sort by match count (descending) then match strength
  return matches.sort((a, b) => {
    if (b.matchCount !== a.matchCount) return b.matchCount - a.matchCount;
    return b.rule.matchStrength - a.rule.matchStrength;
  });
}
