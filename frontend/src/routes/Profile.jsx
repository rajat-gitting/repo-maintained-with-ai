import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    bio: '',
    dateOfBirth: '',
    city: '',
    country: '',
    avatarUrl: ''
  });
  const [avatar, setAvatar] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios.get('/api/profile')
      .then(response => {
        setProfile(response.data);
      })
      .catch(error => {
        console.error('Error fetching profile:', error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors({ avatar: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' });
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setErrors({ avatar: 'File size exceeds 2 MB.' });
        return;
      }
      setAvatar(file);
      setErrors({});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = ['firstName', 'lastName'];
    const newErrors = {};
    requiredFields.forEach(field => {
      if (!profile[field]) {
        newErrors[field] = 'This field is required.';
      }
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      const response = await axios.put('/api/profile', profile);
      setProfile(response.data);
      setErrors({});

      if (avatar) {
        const formData = new FormData();
        formData.append('avatar', avatar);
        await axios.post('/api/profile/avatar', formData);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div>
      <h1>Profile</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username: {profile.username}</label>
        </div>
        <div>
          <label>Email: {profile.email}</label>
        </div>
        <div>
          <label>First Name</label>
          <input type="text" name="firstName" value={profile.firstName} onChange={handleInputChange} />
          {errors.firstName && <span>{errors.firstName}</span>}
        </div>
        <div>
          <label>Last Name</label>
          <input type="text" name="lastName" value={profile.lastName} onChange={handleInputChange} />
          {errors.lastName && <span>{errors.lastName}</span>}
        </div>
        <div>
          <label>Phone</label>
          <input type="text" name="phone" value={profile.phone} onChange={handleInputChange} />
        </div>
        <div>
          <label>Bio</label>
          <textarea name="bio" value={profile.bio} onChange={handleInputChange} maxLength="250" />
        </div>
        <div>
          <label>Date of Birth</label>
          <input type="date" name="dateOfBirth" value={profile.dateOfBirth} onChange={handleInputChange} />
        </div>
        <div>
          <label>City</label>
          <input type="text" name="city" value={profile.city} onChange={handleInputChange} />
        </div>
        <div>
          <label>Country</label>
          <input type="text" name="country" value={profile.country} onChange={handleInputChange} />
        </div>
        <div>
          <label>Avatar</label>
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleAvatarChange} />
          {errors.avatar && <span>{errors.avatar}</span>}
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default Profile;
