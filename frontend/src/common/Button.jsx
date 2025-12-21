import React from 'react';
import PropTypes from 'prop-types';

/**
 * Presentational Button component.
 * - Purely presentational: accepts props and renders UI only.
 * - No API/routing/business logic.
 */
const Button = ({
  children,
  variant,
  size,
  type,
  disabled,
  className,
  ariaLabel,
  title,
  onClick,
  ...rest
}) => {
  const rootClass = `btn${variant ? ` btn--${variant}` : ''}${size ? ` btn--${size}` : ''}${disabled ? ' btn--disabled' : ''}${className ? ` ${className}` : ''}`;

  return (
    <button
      type={type}
      className={rootClass}
      disabled={disabled}
      aria-label={ariaLabel}
      title={title}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.string,
  size: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  disabled: PropTypes.bool,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
  title: PropTypes.string,
  onClick: PropTypes.func,
};

Button.defaultProps = {
  children: null,
  variant: 'default',
  size: 'md',
  type: 'button',
  disabled: false,
  className: '',
  ariaLabel: undefined,
  title: undefined,
  onClick: undefined,
};

export default Button;