import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login/Login.js';
import Signup from './components/Signup/Signup.js';
import HomePage from './components/HomePage/HomePage.js';
import ChatWindow from './components/ChatWindow/ChatWindow.js';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('loggedInUserName'));
  const [selectedFriend, setSelectedFriend] = useState(localStorage.getItem('selectedFriend'));

  const handleLogin = (user) => {
    localStorage.setItem('loggedInUserId', user.userId);
    localStorage.setItem('loggedInUserName', user.username);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUserId');
    localStorage.removeItem('loggedInUserName');
    localStorage.removeItem('selectedFriend');
    setIsLoggedIn(false);
  };

  const startChat = (friend) => {
    setSelectedFriend(friend);
    localStorage.setItem('selectedFriend', friend);
  };

  return (
    <Router>
      <div className="app-container">
        <header>
          <h1>Scalable Chat Application</h1>
          <div className="nav-buttons">
            {isLoggedIn ? (
              <>
                <Link to="/" className="nav-button" onClick={handleLogout}>Logout</Link>
                <Link to="/home" className="nav-button">Home</Link>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-button">Login</Link>
                <Link to="/register" className="nav-button">Register</Link>
              </>
            )}
          </div>
        </header>
        <Routes>
          <Route path="/login" element={isLoggedIn ? <Navigate to="/home" /> : <Login onLogin={handleLogin} />} />
          <Route path="/register" element={isLoggedIn ? <Navigate to="/home" /> : <Signup />} />
          <Route path="/home" element={isLoggedIn ? <HomePage startChat={startChat} /> : <Navigate to="/login" />} />
          <Route path="/chat" element={isLoggedIn && selectedFriend ? <ChatWindow /> : <Navigate to="/home" />} />
          <Route path="/" element={isLoggedIn ? <HomePage startChat={startChat} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;