import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/LoginPage.css"; 

function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
      console.log("Login attempt with:", username, password);

      // Fetch the list of users from the API
      const response = await fetch("http://127.0.0.1:8001/admins/");
      const users = await response.json();

      // Validate if the user is available in the list
      const user = users.find((user) => user.username === username);
      if (user) {
        // Username validated successfully
        console.log("User validated:", user);
        navigate("/admin/home-admin"); // Navigate to Home Page
      } else {
        // Username validation failed
        console.error("Invalid username");
        alert("Invalid username");
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
            className="input-full-width"
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
            className="input-full-width"
          />
        </div>
        <button type="submit" className="button-small">
          Sign In
        </button>
      </form>
    </div>
  );
}

export default AdminLoginPage;
