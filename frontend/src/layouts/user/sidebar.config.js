import { 
  Search, 
  Leaf, 
  Milk, 
  Wheat, 
  Beef, 
  Croissant, 
  CupSoda, 
  Cookie, 
  Zap,
  User,
  ShoppingBag,
  LogOut
} from "lucide-react";

export const sidebarConfig = {
  top: [
    {
      id: "search",
      label: "Search",
      icon: Search,
      action: "focus-search"
    }
  ],
  categories: [
    { id: "veg", label: "Vegetables", icon: Leaf, categoryId: "Vegetables" },
    { id: "fruits", label: "Fruits", icon: Leaf, categoryId: "Fruits" },
    { id: "dairy", label: "Dairy", icon: Milk, categoryId: "Dairy" },
    { id: "grains", label: "Grains", icon: Wheat, categoryId: "Grains" },
    { id: "pulses", label: "Pulses", icon: Wheat, categoryId: "Pulses" },
    { id: "oils", label: "Oils", icon: CupSoda, categoryId: "Oils" },
    { id: "spices", label: "Spices", icon: Cookie, categoryId: "Spices" }
  ],
  smart: [
    { id: "running-low", label: "Running Low", icon: Zap, action: "running-low" }
  ],
  bottom: [
    { id: "account", label: "My Account", icon: User, path: "/profile" },
    { id: "orders", label: "Orders", icon: ShoppingBag, path: "/orders" },
    { id: "logout", label: "Logout", icon: LogOut, action: "logout" }
  ]
};
