import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProfileView from './components/ProfileView';
import ProfileEdit from './components/ProfileEdit';
import ToastProvider from './components/ToastProvider';

const App = () => {
  return (
    <BrowserRouter>
      <ToastProvider />
      <Routes>
        <Route path="/profile" element={<ProfileView />} />
        <Route path="/profile/edit" element={<ProfileEdit />} />
        <Route path="*" element={<Navigate to="/profile" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
