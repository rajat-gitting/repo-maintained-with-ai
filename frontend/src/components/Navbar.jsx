import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Navbar = () => {
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    axios.get('/api/profile')
      .then(response => {
        setAvatarUrl(response.data.avatarUrl);
      })
      .catch(error => {
        console.error('Error fetching avatar:', error);
      });
  }, []);

  return (
    <nav>
      <div className="navbar">
        <div className="navbar-brand">
          <a href="/">MyApp</a>
        </div>
        <div className="navbar-avatar">
          {avatarUrl ? (
            <img src={`/api/avatars/${avatarUrl}`} alt="User Avatar" className="avatar" />
          ) : (
            <span>No Avatar</span>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
