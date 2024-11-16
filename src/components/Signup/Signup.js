import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';

const Signup = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(localStorage.getItem('email') || '');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('email', email);
  }, [email]);

 const handleSignup = async (e) => {
  e.preventDefault();
  const validationErrors = validateForm();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }
  const isUsernameAvailable = await checkUsernameAvailability(username);
  if (!isUsernameAvailable) {
    setUsernameAvailable(false);
    return;
  }
  const response = await axiosInstance.post('/register', {
    name, username, email, mobile, password
  });
  if (response.status === 201) {
    navigate('/login');
  }
};

  const validateForm = () => {
    const errors = {};
    if (!name) errors.name = 'Name is required';
    if (!username) errors.username = 'Username is required';
    if (!email) errors.email = 'Email is required';
    if (!password) errors.password = 'Password is required';
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
    return errors;
  };

  const checkUsernameAvailability = async (username) => {
    // Implement username availability check logic
    return true;
  };

  return (
    <form onSubmit={handleSignup}>
      <h2>Register User</h2>
      <input
        type="text"
        placeholder="Name *"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={errors.name ? 'error' : 'default'}
      />
      {errors.name && <p>{errors.name}</p>}
      <input
        type="text"
        placeholder="Username *"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className={!usernameAvailable || errors.username ? 'error' : 'default'}
      />
      {!usernameAvailable && <p>Username is not available</p>}
      {errors.username && <p>{errors.username}</p>}
      <input
        type="email"
        placeholder="Email *"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={errors.email ? 'error' : 'default'}
      />
      {errors.email && <p>{errors.email}</p>}
      <input
        type="text"
        placeholder="Mobile Number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        className="default"
      />
      <input
        type="password"
        placeholder="Password *"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={errors.password ? 'error' : 'default'}
      />
      {errors.password && <p>{errors.password}</p>}
      <input
        type="password"
        placeholder="Confirm Password *"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className={errors.confirmPassword ? 'error' : 'default'}
      />
      {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
      <button type="submit">Register</button>
    </form>
  );
};

export default Signup;