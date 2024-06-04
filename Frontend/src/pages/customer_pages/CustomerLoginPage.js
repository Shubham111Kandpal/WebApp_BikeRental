import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const validateForm = () => {
    let errors = [];
    if (!username.trim()) {
      errors.push("Username is required");
    }
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formErrors = validateForm();
    if (formErrors.length > 0) {
      alert(formErrors.join("\n"));
    } else {
      console.log('Login attempt with:', username, password);

      const response = await fetch(`http://127.0.0.1:8005/users/${encodeURIComponent(username)}`);
      const user = await response.json();

      if (user.username === username) {
        console.log('User validated:', user);
        sessionStorage.setItem('userId', user.user_id);
        sessionStorage.setItem('username', username); 
        navigate('/customer/home-customer');  
      } else {
        console.error('Invalid username or password');
        alert('Invalid username or password');
      }
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <div className="input-full-width">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            aria-label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="input-focus input-full-width"
          />
        </div>
        <div className="input-full-width">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            aria-label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-focus input-full-width"
          />
        </div>
        <button type="submit" className="button-small">
          Sign In
        </button>
        <p>
          Not yet registered? <a href="/customer/register">Register</a>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
