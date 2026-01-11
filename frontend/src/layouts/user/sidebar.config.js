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
    { id: "fruits-veg", label: "Fruits & Vegetables", icon: Leaf, categoryId: "fruits-vegetables" },
    { id: "dairy", label: "Dairy", icon: Milk, categoryId: "dairy" },
    { id: "grains-pasta", label: "Grains & Pasta", icon: Wheat, categoryId: "grains-pasta" },
    { id: "meat-poultry", label: "Meat & Poultry", icon: Beef, categoryId: "meat-poultry" },
    { id: "bakery", label: "Bakery", icon: Croissant, categoryId: "bakery" },
    { id: "beverages", label: "Beverages", icon: CupSoda, categoryId: "beverages" },
    { id: "snacks", label: "Snacks", icon: Cookie, categoryId: "snacks" }
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
