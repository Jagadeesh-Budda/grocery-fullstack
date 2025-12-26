import React from 'react';
import PropTypes from 'prop-types';
import { Home, Grid, ShoppingCart, Heart, Settings, LogOut } from 'lucide-react';

const items = [
  { key: 'dashboard', label: 'Dashboard', icon: Home, href: '/' },
  { key: 'categories', label: 'Categories', icon: Grid, href: '/categories' },
  { key: 'orders', label: 'Orders', icon: ShoppingCart, href: '/orders' },
  { key: 'favorites', label: 'Favorites', icon: Heart, href: '/favorites' },
  { key: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
];

export default function Sidebar({ active = 'dashboard', onNavigate = () => {}, onLogout = () => {} }) {
  return (
    <aside
      aria-label="Primary"
      style={{
        width: 260,
        background: '#ffffff',
        borderRight: '1px solid rgba(15,23,42,0.06)',
        padding: 16,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 12,
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(135deg,#34d399,#10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>
            G
          </div>
          <div style={{ fontWeight: 700, fontSize: 16, color: '#0f172a' }}>GroceryHub</div>
        </div>

        <nav aria-label="Sidebar navigation">
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {items.map((it) => {
              const Icon = it.icon;
              const isActive = it.key === active;
              return (
                <li key={it.key}>
                  <button
                    onClick={() => onNavigate(it)}
                    aria-current={isActive ? 'page' : undefined}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 12px',
                      borderRadius: 10,
                      background: isActive ? '#ecfdf5' : 'transparent',
                      color: isActive ? '#065f46' : '#0f172a',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      boxShadow: isActive ? 'inset 0 1px 0 rgba(0,0,0,0.02)' : 'none',
                      transition: 'background 160ms ease, transform 160ms ease',
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={18} />
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{it.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div>
        <button
          onClick={onLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 12px',
            borderRadius: 10,
            background: 'transparent',
            color: '#ef4444',
            border: '1px solid rgba(239,68,68,0.08)',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

Sidebar.propTypes = {
  active: PropTypes.string,
  onNavigate: PropTypes.func,
  onLogout: PropTypes.func,
};