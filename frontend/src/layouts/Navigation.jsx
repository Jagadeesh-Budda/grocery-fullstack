import React from 'react';
import PropTypes from 'prop-types';

/**
 * Layout Navigation component.
 * - Layout and structure only.
 * - No API calls, no auth, no routing logic.
 * - Renders provided menu items and children unchanged.
 */
const Navigation = ({
  brand,
  menuItems,
  children,
  className,
  ariaLabel,
  ...rest
}) => {
  const rootClass = `layout-navigation${className ? ` ${className}` : ''}`;

  return (
    <div className={rootClass} {...rest}>
      <header className="layout-navigation__header" aria-label={ariaLabel || 'Main navigation'}>
        <div className="layout-navigation__brand">{brand}</div>
        {Array.isArray(menuItems) && menuItems.length > 0 && (
          <nav className="layout-navigation__nav" aria-label="Primary">
            <ul className="layout-navigation__list">
              {menuItems.map((item, idx) => (
                <li key={idx} className="layout-navigation__item">
                  <a
                    href={item.href || '#'}
                    className="layout-navigation__link"
                    title={item.title || item.label}
                  >
                    {item.icon && <span className="layout-navigation__icon" aria-hidden>{item.icon}</span>}
                    <span className="layout-navigation__label">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

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
  children: PropTypes.node,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
};

Navigation.defaultProps = {
  brand: null,
  menuItems: [],
  children: null,
  className: '',
  ariaLabel: undefined,
};

export default Navigation;