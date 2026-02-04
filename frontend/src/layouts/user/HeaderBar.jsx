import React, { useState } from "react";
import { useNavigate, Link, NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { ShoppingCart, Bell, Search, User, ChevronDown, LogOut, Menu, ShoppingBag } from "lucide-react";
import "./HeaderBar.css";
import {
  getStoredCity,
  getStoredTimeZone,
  reverseGeocodeLocation,
  lookupTimeZone,
  setStoredLocation,
  deriveRegionFromIndianState,
  getStoredRegion,
} from "../../utils/locationTime";
import { UI_LABELS } from "../../ui/labels";

export default function HeaderBar({
  onToggleSidebar,
  sidebarCollapsed,
  searchTerm = "",
  onSearchTermChange = () => {},
}) {
  const navigate = useNavigate();
  const {itemCount}= useCart();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [city, setCity] = useState(() => getStoredCity());
  const [timeZone, setTimeZone] = useState(() => getStoredTimeZone());
  const [region, setRegion] = useState(() => getStoredRegion());
  const [isLocating, setIsLocating] = useState(false);

  const username = user?.username || "Guest";
  const avatarLetter = username.charAt(0).toUpperCase();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleDetectLocation = () => {
    if (!navigator?.geolocation || isLocating) {
      if (!navigator?.geolocation) {
        toast.error("Geolocation is not supported in this browser");
      }
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos?.coords?.latitude;
          const lon = pos?.coords?.longitude;

          if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
            toast.error("Couldn't detect location. Using selected city.");
            return;
          }

          const [cityResult, tzResult] = await Promise.allSettled([
            reverseGeocodeLocation(lat, lon),
            lookupTimeZone(lat, lon),
          ]);

          const geo =
            cityResult.status === "fulfilled" ? cityResult.value : null;
          const nextCity = geo?.city ?? null;
          const nextState = geo?.state ?? null;
          const nextTz =
            tzResult.status === "fulfilled" ? tzResult.value : null;

          const nextRegion = nextState
            ? deriveRegionFromIndianState(nextState)
            : null;

          if (!nextCity && !nextTz && !nextRegion) {
            toast.error("Couldn't detect location. Using selected city.");
            return;
          }

          if (nextCity) setCity(nextCity);
          if (nextTz) setTimeZone(nextTz);
          if (nextRegion) setRegion(nextRegion);
          setStoredLocation({
            city: nextCity || city,
            timeZone: nextTz || timeZone,
            region: nextRegion || region,
          });
        } catch {
          toast.error("Couldn't detect location. Using selected city.");
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        if (err?.code === 1) {
          toast.error("Location access denied. Using selected city.");
        } else {
          toast.error("Couldn't detect location. Using selected city.");
        }
        setIsLocating(false);
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 }
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[rgba(255,255,255,0.35)] backdrop-blur-[14px] backdrop-saturate-[160%] border-b border-white/30 shadow-[0_6px_24px_rgba(0,0,0,0.06)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          
          {/* LEFT: Logo */}
          <div className="flex-shrink-0 flex items-center gap-4">
            {typeof onToggleSidebar === "function" && (
              <button 
                onClick={onToggleSidebar}
                className="hidden lg:flex p-2 text-emerald-950/70 hover:bg-white/45 rounded-[2rem] transition-colors duration-200"
                aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <Menu size={20} />
              </button>
            )}
            <Link to="/" className="text-2xl font-bold tracking-tight">
              <span className="text-emerald-950/95">FreshCartFlow</span>
            </Link>
          </div>

          {/* DESKTOP NAV: Home & Groups */}
          <nav className="hidden lg:flex items-center gap-2 mr-4">
            <NavLink
              to="/groceries"
              end
              className={({ isActive }) =>
                `px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-white/45 text-emerald-950/90 shadow-sm ring-1 ring-white/45"
                    : "text-emerald-950/75 hover:bg-white/35 hover:text-emerald-950/90"
                }`
              }
            >
              {UI_LABELS.dock.home}
            </NavLink>
            <NavLink
              to="/groceries/categories"
              className={({ isActive }) =>
                `px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-white/45 text-emerald-950/90 shadow-sm ring-1 ring-white/45"
                    : "text-emerald-950/75 hover:bg-white/35 hover:text-emerald-950/90"
                }`
              }
            >
              {UI_LABELS.dock.groups}
            </NavLink>
          </nav>

          {/* CENTER: Pill-shaped Glass Search */}
          <div className="flex-1 max-w-2xl hidden md:flex items-center justify-center gap-4">
            <div className="relative flex-1 max-w-md group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-emerald-950/45 group-focus-within:text-emerald-700 transition-colors" />
              </div>
              <input
                id="global-search"
                type="text"
                className="block w-full bg-white/45 backdrop-blur-[14px] border border-white/40 rounded-full py-2.5 pl-12 pr-4 text-[14px] text-emerald-950/90 placeholder-emerald-950/40 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:bg-white/55 transition-all"
                placeholder={UI_LABELS.search.placeholder}
                value={searchTerm}
                onChange={(e) => onSearchTermChange(e.target.value)}
              />
            </div>
            
            {/* Location Picker */}
            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={isLocating}
              title={timeZone}
              className="flex items-center gap-2 px-4 py-2 bg-white/45 backdrop-blur-[14px] text-emerald-950/90 rounded-full cursor-pointer hover:bg-white/55 transition-colors border border-white/40 disabled:opacity-70"
            >
              <span
                className={
                  "w-2 h-2 bg-emerald-400 rounded-full " +
                  (isLocating ? "animate-ping" : "animate-pulse")
                }
              ></span>
              <span className="text-[13px] font-bold">
                {isLocating ? "Detecting..." : city}
              </span>
              <ChevronDown size={14} />
            </button>
          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Notification Placeholder */}
            <button className="p-2 text-emerald-950/70 hover:bg-white/35 rounded-full transition-colors relative">
              <Bell size={22} />
              <span className="absolute top-2 right-2.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white/30"></span>
            </button>

            {/* Cart */}
            <Link 
              to="/groceries/cart" 
              className="p-2 text-emerald-950/70 hover:bg-white/35 rounded-full transition-colors relative"
            >
              <ShoppingCart size={22} />
              {itemCount > 0 && (
                <span
                  key={itemCount}   // 🔥 important: re-triggers animation
                  className="cart-badge absolute -top-1 -right-1
                             flex items-center justify-center
                             min-w-[20px] h-5 px-1
                             bg-emerald-500 text-white
                             text-[10px] font-bold
                             rounded-full border-2 border-white/30"
                >
                  {itemCount}
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
                <div className="absolute right-0 mt-2 w-48 bg-white/60 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/30 py-2 z-50">
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
                    onClick={() => {
                      setOpen(false);
                      navigate("/orders");
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                  >
                    <ShoppingBag size={16} />
                    Orders
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
