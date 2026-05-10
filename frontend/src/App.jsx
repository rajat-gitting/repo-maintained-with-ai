import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProfileView from './components/ProfileView';
import ProfileEdit from './components/ProfileEdit';
import ToastProvider from './components/ToastProvider';

const App = () => {
import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Login from './components/Login.js'
import Signup from './components/Signup.js'
import MultiStepForm from './components/MultiStepForm.js'
import Profile from './routes/Profile.jsx'
import Navbar from './components/Navbar.jsx'

function App() {
  return (
    <BrowserRouter>
      <ToastProvider />
      <Navbar />
      <Routes>
        <Route path="/profile" element={<ProfileView />} />
        <Route path="/profile/edit" element={<ProfileEdit />} />
        <Route path="*" element={<Navigate to="/profile" replace />} />
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/form" element={<MultiStepForm />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;