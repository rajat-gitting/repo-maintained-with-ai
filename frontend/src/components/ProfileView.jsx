import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Avatar from './Avatar';
import LoadingSpinner from './LoadingSpinner';
import { showErrorToast } from '../utils/toast';
import './ProfileView.css';

const ProfileView = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err.message);
        showErrorToast('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEditClick = () => {
    navigate('/profile/edit');
  };

  const formatFieldValue = (value) => {
    if (value === null || value === undefined || value === '') {
      return '—';
    }
    return value;
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return '—';
    }
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return '—';
    }
  };

  const getAvatarUrl = (avatarFilename) => {
    if (!avatarFilename) {
      return null;
    }
    return `/api/avatars/${avatarFilename}`;
  };

  const getFullName = () => {
    if (!profile) {
      return '';
    }
    const firstName = profile.firstName || '';
    const lastName = profile.lastName || '';
    return `${firstName} ${lastName}`.trim();
  };

  if (loading) {
    return (
      <div className="profile-view-container">
        <div className="profile-view-loading">
          <LoadingSpinner size="large" />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="profile-view-container">
        <div className="profile-view-error">
          <p>Failed to load profile. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-view-container">
      <div className="profile-view-header">
        <h1>Profile</h1>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleEditClick}
        >
          Edit Profile
        </button>
      </div>

      <div className="profile-view-content">
        <div className="profile-view-avatar-section">
          <Avatar
            src={getAvatarUrl(profile.avatarFilename)}
            name={getFullName()}
            size={120}
          />
        </div>

        <div className="profile-view-card">
          <h2>Personal Information</h2>
          <div className="profile-view-field-group">
            <div className="profile-view-field">
              <label>First Name</label>
              <p>{formatFieldValue(profile.firstName)}</p>
            </div>
            <div className="profile-view-field">
              <label>Last Name</label>
              <p>{formatFieldValue(profile.lastName)}</p>
            </div>
          </div>
          <div className="profile-view-field">
            <label>Email</label>
            <p>{formatFieldValue(profile.email)}</p>
          </div>
          <div className="profile-view-field">
            <label>Username</label>
            <p>{formatFieldValue(profile.username)}</p>
          </div>
          <div className="profile-view-field">
            <label>Phone</label>
            <p>{formatFieldValue(profile.phone)}</p>
          </div>
          <div className="profile-view-field">
            <label>Date of Birth</label>
            <p>{formatDate(profile.dateOfBirth)}</p>
          </div>
        </div>

        <div className="profile-view-card">
          <h2>Location</h2>
          <div className="profile-view-field">
            <label>City</label>
            <p>{formatFieldValue(profile.city)}</p>
          </div>
          <div className="profile-view-field">
            <label>Country</label>
            <p>{formatFieldValue(profile.country)}</p>
          </div>
        </div>

        <div className="profile-view-card">
          <h2>About</h2>
          <div className="profile-view-field">
            <label>Bio</label>
            <p className="profile-view-bio">{formatFieldValue(profile.bio)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

ProfileView.propTypes = {};

export default ProfileView;