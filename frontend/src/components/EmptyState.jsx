import React from 'react';
import PropTypes from 'prop-types';

const EmptyState = ({ title = 'Nothing here yet', description = 'Try adding some products to get started.', iconSize = 56 }) => {
  const container = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    gap: 12,
    padding: 24,
    color: '#6b7280',
    width: '100%',
  };

  const titleStyle = {
    margin: 0,
    fontSize: 18,
    fontWeight: 700,
    color: '#0f172a',
  };

  const descStyle = {
    margin: 0,
    fontSize: 13,
    color: '#6b7280',
    maxWidth: 420,
  };

  return (
    <section style={container} aria-live="polite" role="status">
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <rect x="2" y="4" width="20" height="14" rx="2.5" stroke="#d1d5db" strokeWidth="1.5" fill="none" />
        <circle cx="8" cy="11" r="0.9" fill="#d1d5db" />
        <circle cx="16" cy="11" r="0.9" fill="#d1d5db" />
        <path d="M8.3 15c.9.9 2.2.9 3.1 0" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      <h3 style={titleStyle}>{title}</h3>
      {description && <p style={descStyle}>{description}</p>}
    </section>
  );
};

EmptyState.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  iconSize: PropTypes.number,
};

export default EmptyState;