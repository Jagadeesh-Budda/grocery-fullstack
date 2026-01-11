import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { ShoppingCart, Bell, Search, User, ChevronDown, LogOut, Menu } from "lucide-react";
import "./HeaderBar.css";

export default function HeaderBar({ onToggleSidebar, sidebarCollapsed }) {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const username = user?.username || "Guest";
  const avatarLetter = username.charAt(0).toUpperCase();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          
          {/* LEFT: Logo */}
          <div className="flex-shrink-0 flex items-center gap-4">
            <button 
              onClick={onToggleSidebar}
              className="hidden lg:flex p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <Menu size={20} />
            </button>
            <Link to="/" className="text-2xl font-bold tracking-tight">
              <span className="text-grocery-primary">Bloom</span>
            </Link>
          </div>

          {/* CENTER: Search */}
          <div className="flex-1 max-w-2xl hidden md:flex items-center gap-4">
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full bg-slate-50 border border-slate-100 rounded-full py-2.5 pl-12 pr-4 text-[14px] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all"
                placeholder="Search for fruits, vegetables, etc.."
              />
            </div>
            
            {/* Location Picker */}
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full cursor-pointer hover:bg-emerald-100 transition-colors border border-emerald-100">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[13px] font-bold">Mumbai</span>
              <ChevronDown size={14} />
            </div>
          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Notification Placeholder */}
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative">
              <Bell size={22} />
              <span className="absolute top-2 right-2.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>

            {/* Cart */}
            <Link 
              to="/groceries/cart" 
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative"
            >
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1 bg-grocery-primary text-white text-[10px] font-bold rounded-full border-2 border-white">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Dropdown */}
            <div className="relative ml-2">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 p-1 pr-2 hover:bg-gray-50 rounded-full transition-colors border border-transparent hover:border-gray-100"
              >
                <div className="w-8 h-8 rounded-full bg-grocery-primary/10 flex items-center justify-center text-grocery-primary font-semibold text-sm border border-grocery-primary/20">
                  {avatarLetter}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-gray-900 leading-none">{username}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5 leading-none">Customer</p>
                </div>
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-50 mb-1">
                    <p className="text-xs text-gray-400">Signed in as</p>
                    <p className="text-sm font-medium text-gray-900 truncate">{username}</p>
                  </div>
                  
                  <button 
                    disabled
                    className="w-full text-left px-4 py-2 text-sm text-gray-400 cursor-not-allowed flex items-center gap-2"
                  >
                    <User size={16} />
                    Profile
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
