import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X, Bell, Search } from "lucide-react";

export default function MainLayout({ left, right, showSidebar = true }) {
 const [sidebarOpen, setSidebarOpen] = useState(false);
const [avatarOpen, setAvatarOpen] = useState(false);

const username = localStorage.getItem("username") || "User";
const userInitial = username.charAt(0).toUpperCase();

const handleLogout = async () => {
  try {
    await fetch("http://localhost:8080/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch (e) {
    // ignore backend error
  } finally {
    localStorage.clear();
    window.location.href = "/login";
  }
};


  const navItems = [
    { label: "Dashboard", href: "/" },
    { label: "Grocery List", href: "/list" },
    { label: "Recipes", href: "/recipes" },
    { label: "Settings", href: "/settings" },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#f9fafb' }}>
      {/* Top Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="container-base flex items-center justify-between h-16 gap-4">
          {/* Logo & App Name */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">G</span>
            </div>
            <h1 className="text-xl font-semibold text-slate-900 hidden sm:block">
              GroceryHub
            </h1>
          </div>

          {/* Center: search (desktop) */}
          <div className="hidden md:flex items-center flex-1 px-4">
            <div className="flex items-center w-full max-w-xl bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="search"
                placeholder="Search products, recipes..."
                className="w-full bg-transparent outline-none text-sm text-slate-700"
              />
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          {/* Right controls: notifications + avatar */}
<div className="relative flex items-center gap-4">
  <button
    title="Notifications"
    className="relative p-2 rounded-lg hover:bg-slate-100 transition"
  >
    <Bell className="w-5 h-5 text-slate-600" />
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
  </button>

  <button
    onClick={() => setAvatarOpen(!avatarOpen)}
    className="w-9 h-9 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm focus:outline-none"
  >
    {userInitial}
  </button>

  {avatarOpen && (
    <div className="absolute right-0 top-12 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
      <div className="px-4 py-2 text-sm text-slate-600 border-b">
        Signed in as
        <div className="font-medium text-slate-900 truncate">
          {username}
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-50"
      >
        Logout
      </button>
    </div>
  )}
</div>
        </div>
      </nav>

      <div className="flex">
        {/* Left Sidebar (Optional) */}
        {showSidebar && (
          <aside
            className={`fixed lg:static inset-y-16 left-0 w-64 bg-white border-r border-slate-200 p-6 transition-transform duration-300 lg:translate-x-0 z-40 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
            style={{ width: 260 }}
          >
            <nav className="space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition font-medium"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>
        )}

        {/* Main Content Area */}
        <main className="flex-1 w-full" style={{ height: 'calc(100vh - 64px)', overflow: 'auto' }}>
          <div className="container-base section-spacing py-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Content */}
              <div className="lg:col-span-7">
                <div className="card p-6" style={{ borderRadius: 12, boxShadow: '0 6px 18px rgba(15,23,42,0.06)', background: '#fff' }}>
                  {left || <Outlet />}
                </div>
              </div>

              {/* Right Content */}
              <div className="lg:col-span-5 space-y-6">{right}</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
