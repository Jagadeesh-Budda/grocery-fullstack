import React from 'react';
import PropTypes from 'prop-types';

/**
 * Presentational Card component.
 * - Purely presentational: accepts props and renders UI only.
 * - No API/routing/business logic.
 */
const Card = ({
  children,
  header,
  footer,
  title,
  variant,
  className,
  ariaLabel,
  titleAttr,
  ...rest
}) => {
  const rootClass = `card${variant ? ` card--${variant}` : ''}${className ? ` ${className}` : ''}`;

  return (
    <div className={rootClass} aria-label={ariaLabel} title={titleAttr} {...rest}>
      {header != null && <div className="card__header">{header}</div>}
      {title != null && <div className="card__title">{title}</div>}
      <div className="card__body">{children}</div>
      {footer != null && <div className="card__footer">{footer}</div>}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node,
  header: PropTypes.node,
  footer: PropTypes.node,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  variant: PropTypes.string,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
  titleAttr: PropTypes.string,
};

Card.defaultProps = {
  children: null,
  header: null,
  footer: null,
  title: undefined,
  variant: 'default',
  className: '',
  ariaLabel: undefined,
  titleAttr: undefined,
};

export default Card;