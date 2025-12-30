import React from 'react';
import PropTypes from 'prop-types';

const Badge = ({
  children,
  text,
  variant = 'info', // Defaulting to info
  className = '',
  ...rest
}) => {
  // Mapping variants to our grocery design system colors
  const variants = {
    success: 'bg-grocery-success text-grocery-successText',
    warning: 'bg-grocery-warning text-grocery-warningText',
    danger: 'bg-grocery-danger text-grocery-dangerText',
    info: 'bg-grocery-info text-grocery-infoText',
    default: 'bg-gray-100 text-gray-600',
  };

  const selectedVariant = variants[variant] || variants.default;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold tracking-wide uppercase ${selectedVariant} ${className}`}
      {...rest}
    >
      {children || text}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  variant: PropTypes.oneOf(['success', 'warning', 'danger', 'info', 'default']),
  className: PropTypes.string,
};

export default Badge;