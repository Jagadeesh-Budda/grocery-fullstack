// src/components/AdminSidebar.jsx (Refactored for FreshCartFlow)
import React from 'react';
import { Home, Grid, ShoppingCart, Settings, LogOut, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const items = [
  { key: 'dashboard', label: 'Dashboard', icon: Home, href: '/admin' },
  { key: 'categories', label: 'Categories', icon: Grid, href: '/admin/categories' },
  { key: 'products', label: 'Products', icon: Package, href: '/admin/products' },
  { key: 'orders', label: 'Orders', icon: ShoppingCart, href: '/admin/orders' },
  { key: 'settings', label: 'Settings', icon: Settings, href: '/admin/settings' },
];

export default function AdminSidebar({ active = 'dashboard', onLogout = () => {} }) {
  const navigate = useNavigate();

  return (
    // Gromuse Style: Softer shadow and more padding
    <aside className="w-72 h-screen bg-[#F8F9FA] border-r border-gray-100 p-6 flex flex-col justify-between">
      <div>
        {/* Updated Logo: FreshCartFlow style */}
      
<div className="flex items-center gap-3 mb-8 px-2">
  <div className="w-9 h-9 rounded-xl bg-grocery-primary flex items-center justify-center text-white shadow-lg shadow-green-100">
    <ShoppingCart size={20} strokeWidth={2.5} />
  </div>
            <div className="font-extrabold text-xl text-gray-900 tracking-tight">
            groce<span className="text-[#28a745]">Rythm</span>
          </div>
        </div>

        <nav>
          <ul className="space-y-3">
            {items.map((it) => {
              const Icon = it.icon;
              const isActive = it.key === active;
              return (
                <li key={it.key}>
                  <button
                    onClick={() => navigate(it.href)} // Navigation logic preserved
                    className={`
                      w-full flex items-center gap-4 px-4 py-3.5 rounded-[24px] transition-all duration-300
                      ${isActive 
                        ? 'bg-[#28a745] text-white shadow-md shadow-green-100' 
                        : 'text-gray-500 hover:bg-white hover:text-[#28a745] hover:shadow-sm'}
                    `}
                  >
                    <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                    <span className="text-sm font-bold">{it.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Logout stays at bottom */}
      <div className="pt-6 border-t border-gray-100">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-4 py-3.5 rounded-[24px] text-red-500 hover:bg-red-50 font-bold transition-all"
        >
          <LogOut size={22} />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}