import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Presentational SearchBar component.
 * - UI layer only: accepts props and renders UI / interactions only.
 * - No API calls, routing, or business logic.
 */
const SearchBar = ({
  value,
  defaultValue,
  onChange,
  onSubmit,
  placeholder,
  className,
  ariaLabel,
  name,
  disabled,
  showClear,
  ...rest
}) => {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue || '');

  useEffect(() => {
    if (isControlled) return;
    setInternalValue(defaultValue || '');
  }, [defaultValue, isControlled]);

  const currentValue = isControlled ? value : internalValue;

  const handleChange = (e) => {
    const v = e.target.value;
    if (!isControlled) setInternalValue(v);
    if (onChange) onChange(v, e);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(currentValue, e);
  };

  const handleClear = (e) => {
    e.preventDefault();
    if (!isControlled) setInternalValue('');
    if (onChange) onChange('', e);
    if (onSubmit) onSubmit('', e);
  };

  const rootClass = `searchbar${className ? ` ${className}` : ''}`;

  return (
    <form className={rootClass} onSubmit={handleSubmit} {...rest} aria-label={ariaLabel}>
      <input
        type="search"
        name={name}
        className="searchbar__input"
        placeholder={placeholder}
        value={currentValue}
        onChange={handleChange}
        disabled={disabled}
        aria-label={ariaLabel || 'Search'}
      />
      <button type="submit" className="searchbar__btn" aria-label="Submit search" disabled={disabled}>
        Search
      </button>
      {showClear && currentValue && (
        <button
          type="button"
          className="searchbar__clear"
          aria-label="Clear search"
          onClick={handleClear}
          disabled={disabled}
        >
          ×
        </button>
      )}
    </form>
  );
};

SearchBar.propTypes = {
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func, // receives (value, event)
  onSubmit: PropTypes.func, // receives (value, event)
  placeholder: PropTypes.string,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
  name: PropTypes.string,
  disabled: PropTypes.bool,
  showClear: PropTypes.bool,
};

SearchBar.defaultProps = {
  value: undefined,
  defaultValue: '',
  onChange: undefined,
  onSubmit: undefined,
  placeholder: 'Search...',
  className: '',
  ariaLabel: undefined,
  name: 'search',
  disabled: false,
  showClear: true,
};

export default SearchBar;