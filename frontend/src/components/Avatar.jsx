import React from 'react';
import PropTypes from 'prop-types';
import './Avatar.css';

const Avatar = ({ src, name, size = 120 }) => {
  const getInitials = (fullName) => {
    if (!fullName || typeof fullName !== 'string') {
      return '?';
    }
    const trimmed = fullName.trim();
    if (trimmed.length === 0) {
      return '?';
    }
    const parts = trimmed.split(/\s+/);
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  };

  const getBackgroundColor = (fullName) => {
    if (!fullName || typeof fullName !== 'string') {
      return '#9CA3AF';
    }
    const colors = [
      '#EF4444',
      '#F59E0B',
      '#10B981',
      '#3B82F6',
      '#6366F1',
      '#8B5CF6',
      '#EC4899',
      '#14B8A6',
      '#F97316',
      '#84CC16'
    ];
    const hash = hashString(fullName);
    return colors[hash % colors.length];
  };

  const initials = getInitials(name);
  const backgroundColor = getBackgroundColor(name);

  if (src) {
    return (
      <div
        className="avatar"
        style={{
          width: `${size}px`,
          height: `${size}px`
        }}
      >
        <img
          src={src}
          alt={name || 'User avatar'}
          className="avatar-image"
        />
      </div>
    );
  }

  return (
    <div
      className="avatar avatar-fallback"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor,
        fontSize: `${size * 0.4}px`
      }}
      aria-label={`Avatar for ${name || 'user'}`}
    >
      <span className="avatar-initials">{initials}</span>
    </div>
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  name: PropTypes.string.isRequired,
  size: PropTypes.number
};

export default Avatar;
