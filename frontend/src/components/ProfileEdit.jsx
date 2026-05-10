import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Avatar from './Avatar';
import LoadingSpinner from './LoadingSpinner';
import { showSuccessToast, showErrorToast } from '../utils/toast';
import './ProfileEdit.css';

const ProfileEdit = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [avatarError, setAvatarError] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    bio: '',
    city: '',
    country: '',
    dateOfBirth: ''
  });

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
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          phone: data.phone || '',
          bio: data.bio || '',
          city: data.city || '',
          country: data.country || '',
          dateOfBirth: data.dateOfBirth || ''
        });
      } catch (err) {
        setError(err.message);
        showErrorToast('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const validateForm = () => {
    const errors = {};

    if (!formData.firstName || formData.firstName.trim() === '') {
      errors.firstName = 'First name is required';
    }

    if (!formData.lastName || formData.lastName.trim() === '') {
      errors.lastName = 'Last name is required';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateAvatarFile = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSizeBytes = 2 * 1024 * 1024;
    const maxDimension = 1024;

    if (!validTypes.includes(file.type)) {
      return 'Avatar must be a JPEG, PNG, or WebP image';
    }

    if (file.size > maxSizeBytes) {
      return 'Avatar file size must not exceed 2MB';
    }

    return new Promise((resolve) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        if (img.width > maxDimension || img.height > maxDimension) {
          resolve('Avatar dimensions must not exceed 1024×1024 pixels');
        } else {
          resolve(null);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve('Failed to load image for validation');
      };

      img.src = objectUrl;
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    setAvatarError(null);

    const validationError = await validateAvatarFile(file);
    if (validationError) {
      setAvatarError(validationError);
      e.target.value = '';
      return;
    }

    try {
      setUploadingAvatar(true);
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to upload avatar');
      }

      const data = await response.json();
      setProfile(prev => ({
        ...prev,
        avatarFilename: data.avatarFilename
      }));
      showSuccessToast('Avatar uploaded successfully');
    } catch (err) {
      setAvatarError('Failed to upload avatar. Please try again.');
      showErrorToast('Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to save profile');
      }

      showSuccessToast('Profile saved successfully');
      navigate('/profile');
    } catch (err) {
      setError(err.message);
      showErrorToast('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/profile');
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
      <div className="profile-edit-container">
        <div className="profile-edit-loading">
          <LoadingSpinner size="large" />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="profile-edit-container">
        <div className="profile-edit-error">
          <p>Failed to load profile. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-edit-container">
      <div className="profile-edit-header">
        <h1>Edit Profile</h1>
      </div>

      <form onSubmit={handleSubmit} className="profile-edit-form">
        <div className="profile-edit-avatar-section">
          <Avatar
            src={getAvatarUrl(profile?.avatarFilename)}
            name={getFullName()}
            size={120}
          />
          <div className="profile-edit-avatar-upload">
            <label htmlFor="avatar-upload" className="btn btn-secondary">
              {uploadingAvatar ? (
                <>
                  <LoadingSpinner size="small" color="neutral" />
                  Uploading...
                </>
              ) : (
                'Change Avatar'
              )}
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleAvatarChange}
              disabled={uploadingAvatar}
              className="profile-edit-avatar-input"
            />
            {avatarError && (
              <p className="profile-edit-field-error">{avatarError}</p>
            )}
            <p className="profile-edit-avatar-hint">
              JPEG, PNG, or WebP. Max 2MB, 1024×1024px.
            </p>
          </div>
        </div>

        <div className="profile-edit-card">
          <h2>Personal Information</h2>
          <div className="profile-edit-field-group">
            <div className="profile-edit-field">
              <label htmlFor="firstName">
                First Name <span className="profile-edit-required">*</span>
              </label>
              <input
                id="firstName"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Enter your first name"
                className={fieldErrors.firstName ? 'input-error' : ''}
              />
              {fieldErrors.firstName && (
                <p className="profile-edit-field-error">{fieldErrors.firstName}</p>
              )}
            </div>
            <div className="profile-edit-field">
              <label htmlFor="lastName">
                Last Name <span className="profile-edit-required">*</span>
              </label>
              <input
                id="lastName"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Enter your last name"
                className={fieldErrors.lastName ? 'input-error' : ''}
              />
              {fieldErrors.lastName && (
                <p className="profile-edit-field-error">{fieldErrors.lastName}</p>
              )}
            </div>
          </div>
          <div className="profile-edit-field">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
            />
          </div>
          <div className="profile-edit-field">
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input
              id="dateOfBirth"
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="profile-edit-card">
          <h2>Location</h2>
          <div className="profile-edit-field">
            <label htmlFor="city">City</label>
            <input
              id="city"
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="Enter your city"
            />
          </div>
          <div className="profile-edit-field">
            <label htmlFor="country">Country</label>
            <input
              id="country"
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              placeholder="Enter your country"
            />
          </div>
        </div>

        <div className="profile-edit-card">
          <h2>About</h2>
          <div className="profile-edit-field">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself"
              rows={5}
            />
          </div>
        </div>

        {error && (
          <div className="profile-edit-form-error">
            <p>{error}</p>
          </div>
        )}

        <div className="profile-edit-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancel}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
          >
            {saving ? (
              <>
                <LoadingSpinner size="small" color="white" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

ProfileEdit.propTypes = {};

export default ProfileEdit;