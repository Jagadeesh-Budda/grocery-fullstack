import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Menu, X, ChevronDown } from 'lucide-react';

/**
 * Layout Navigation component.
 * - Responsive navbar with logo, menu items, and user avatar dropdown
 * - Mobile hamburger menu with smooth transitions
 * - No API calls, no auth, no routing logic
 */
const Navigation = ({
  brand,
  menuItems,
  userAvatar,
  userMenu,
  children,
  className,
  ariaLabel,
  ...rest
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const rootClass = `layout-navigation${className ? ` ${className}` : ''}`;

  return (
    <div className={rootClass} {...rest}>
      {/* Navbar */}
      <header className="layout-navigation__header bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm" aria-label={ariaLabel || 'Main navigation'}>
        <div className="container-base flex items-center justify-between h-16">
          {/* Brand/Logo */}
          <div className="layout-navigation__brand flex items-center gap-2 font-bold text-lg text-slate-900">
            {brand}
          </div>

          {/* Desktop Navigation */}
          {Array.isArray(menuItems) && menuItems.length > 0 && (
            <nav className="layout-navigation__nav hidden lg:block" aria-label="Primary">
              <ul className="layout-navigation__list flex gap-1">
                {menuItems.map((item, idx) => (
                  <li key={idx} className="layout-navigation__item">
                    <a
                      href={item.href || '#'}
                      className="layout-navigation__link px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition font-medium"
                      title={item.title || item.label}
                    >
                      {item.icon && <span className="layout-navigation__icon inline-block mr-2" aria-hidden>{item.icon}</span>}
                      <span className="layout-navigation__label">{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* Right Section: User Avatar & Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* User Avatar Dropdown */}
            {userAvatar && (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-lg transition"
                  aria-expanded={userDropdownOpen}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {userAvatar}
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-600 hidden sm:block" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && userMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-40">
                    {Array.isArray(userMenu) && userMenu.map((item, idx) => (
                      <a
                        key={idx}
                        href={item.href || '#'}
                        className="block px-4 py-2 text-slate-700 hover:bg-slate-50 transition text-sm"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden bg-slate-50 border-t border-slate-200 p-4">
            <ul className="space-y-2">
              {Array.isArray(menuItems) && menuItems.map((item, idx) => (
                <li key={idx}>
                  <a
                    href={item.href || '#'}
                    className="block px-4 py-2 rounded-lg text-slate-700 hover:bg-white transition font-medium"
                  >
                    {item.icon && <span className="inline-block mr-2">{item.icon}</span>}
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="layout-navigation__content">
        {children}
      </main>
    </div>
  );
};

Navigation.propTypes = {
  brand: PropTypes.node,
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string,
      title: PropTypes.string,
      icon: PropTypes.node,
    })
  ),
  userAvatar: PropTypes.string,
  userMenu: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string,
    })
  ),
  children: PropTypes.node,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
};

Navigation.defaultProps = {
  brand: null,
  menuItems: [],
  userAvatar: null,
  userMenu: [],
  children: null,
  className: '',
  ariaLabel: undefined,
};

export default Navigation;