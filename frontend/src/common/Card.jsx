import React from 'react';
import PropTypes from 'prop-types';

const Card = ({
  children,
  header,
  footer,
  title,
  subtitle,
  icon: Icon,
  trend,
  className,
  ...rest
}) => {
  return (
    <div 
      className={`bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white/30 shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-shadow duration-200 p-8 ${className}`}
      {...rest}
    >
      {/* 1. Header Area: Title & Icon */}
      <div className="flex items-start justify-between mb-4">
        <div>
          {title && <h3 className="text-sm font-semibold text-grocery-body uppercase tracking-wider">{title}</h3>}
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className="p-2.5 bg-grocery-bg rounded-[2rem] text-grocery-primary">
            <Icon size={20} />
          </div>
        )}
      </div>

      {/* 2. Body Area: The Main Number/Value */}
      <div className="flex items-baseline gap-3">
        <div className="text-2xl font-bold text-grocery-heading leading-none">
          {children}
        </div>
        
        {/* Trend Indicator (e.g., +12.5%) */}
        {trend && (
          <span className={`text-xs font-bold px-2 py-1 rounded-[2rem] ${
            trend.startsWith('+') ? 'bg-grocery-success text-grocery-successText' : 'bg-grocery-danger text-grocery-dangerText'
          }`}>
            {trend}
          </span>
        )}
      </div>

      {/* 3. Optional Footer */}
      {footer && (
        <div className="mt-4 pt-4 border-t border-gray-50 text-xs text-grocery-body">
          {footer}
        </div>
      )}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node,
  header: PropTypes.node,
  footer: PropTypes.node,
  title: PropTypes.node,
  subtitle: PropTypes.string,
  icon: PropTypes.elementType,
  trend: PropTypes.string,
  className: PropTypes.string,
};

export default Card;