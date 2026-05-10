import React from 'react';
import PropTypes from 'prop-types';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', color = 'primary' }) => {
  const sizeMap = {
    small: 16,
    medium: 24,
    large: 32
  };

  const sizeValue = sizeMap[size] || sizeMap.medium;

  return (
    <div
      className={`loading-spinner loading-spinner--${size} loading-spinner--${color}`}
      style={{
        width: `${sizeValue}px`,
        height: `${sizeValue}px`
      }}
      role="status"
      aria-label="Loading"
    >
      <svg
        className="loading-spinner-svg"
        viewBox="0 0 50 50"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="loading-spinner-circle"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="5"
        />
      </svg>
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  color: PropTypes.oneOf(['primary', 'white', 'neutral'])
};

export default LoadingSpinner;
