import React from 'react';
import PropTypes from 'prop-types';

/**
 * Presentational Badge component.
 * - Purely presentational: accepts props and renders UI only.
 * - No API/routing/business logic.
 */
const Badge = ({
  children,
  text,
  variant,
  className,
  ariaLabel,
  title,
  ...rest
}) => {
  const rootClass = `badge${variant ? ` badge--${variant}` : ''}${className ? ` ${className}` : ''}`;

  return (
    <span
      className={rootClass}
      aria-label={ariaLabel}
      title={title}
      {...rest}
    >
      {children != null ? children : text}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  variant: PropTypes.string,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
  title: PropTypes.string,
};

Badge.defaultProps = {
  children: null,
  text: '',
  variant: 'default',
  className: '',
  ariaLabel: undefined,
  title: undefined,
};

export default Badge;