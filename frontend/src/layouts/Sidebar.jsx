// src/components/Sidebar.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Home, Grid, ShoppingCart, Settings, LogOut, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const items = [
  { key: 'dashboard', label: 'Dashboard', icon: Home, href: '/admin' },
  { key: 'categories', label: 'Categories', icon: Grid, href: '/admin/categories' },
  { key: 'products', label: 'Products', icon: Package, href: '/admin/products' },
  { key: 'orders', label: 'Orders', icon: ShoppingCart, href: '/admin/orders' },
  { key: 'settings', label: 'Settings', icon: Settings, href: '/admin/settings' },
];

export default function Sidebar({ active = 'dashboard', onLogout = () => {} }) {
  const navigate = useNavigate();

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-100 p-4 flex flex-col justify-between shadow-sm">
      <div>
        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-9 h-9 rounded-xl bg-grocery-primary flex items-center justify-center text-white shadow-lg shadow-green-100">
            <ShoppingCart size={20} strokeWidth={2.5} />
          </div>
          <div className="font-bold text-lg text-grocery-heading tracking-tight">
            Grocery<span className="text-grocery-primary">Hub</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav aria-label="Sidebar navigation">
          <ul className="space-y-2">
            {items.map((it) => {
              const Icon = it.icon;
              const isActive = it.key === active;
              return (
                <li key={it.key}>
                  <button
                    onClick={() => navigate(it.href)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                      ${isActive 
                        ? 'bg-grocery-success text-grocery-successText' 
                        : 'text-grocery-body hover:bg-gray-50 hover:text-grocery-heading'}
                    `}
                  >
                    <Icon 
                      size={20} 
                      className={`${isActive ? 'text-grocery-primary' : 'text-gray-400 group-hover:text-grocery-primary'}`} 
                    />
                    <span className="text-sm font-semibold">{it.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Logout Section */}
      <div className="pt-4 border-t border-gray-50">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 font-semibold transition-colors"
        >
          <LogOut size={20} />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}

Sidebar.propTypes = {
  active: PropTypes.string,
  onLogout: PropTypes.func,
};