
// App.js
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import VideoList from './components/Video/VideoList';
import VideoUpload from './components/Video/VideoUpload';
import VideoPlayer from './components/Video/VideoPlayer';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar/Navbar'

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token')
  );

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <div className='app'>
       {isAuthenticated && <Navbar onLogout={handleLogout} />}
   
    <div className="container">
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <VideoList />
            </PrivateRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <VideoUpload />
            </PrivateRoute>
          }
        />
        <Route
          path="/video/:id"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <VideoPlayer />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
    </div>
  );
};

export default App;