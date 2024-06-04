import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/RegistrationPage.css"; 
import Header from "../components/Header";

function RegistrationPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phone_number: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      username: form.username,
      email: form.email,
      password: form.password,
      phone_number: form.phone_number,
      registration_date: new Date().toISOString(),
    };

    try {
      const response = await fetch("http://127.0.0.1:8005/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      navigate("/customer/home-customer"); // Navigate to Home Page on successful registration
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Error registering user. Please try again.");
    }
  };

  return (
    <div className="registration-form-container">
      <Header />
      <form onSubmit={handleSubmit} className="registration-form">
        <div className="form-group">
          <label htmlFor="username" className="form-label">
            Username:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-goup">
          <label htmlFor="phone_number" className="form-label">
            Phone:
          </label>
          <input
            type="tel"
            id="phone_number"
            name="phone_number"
            value={form.phone_number}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <button type="submit" className="form-button">
          Register
        </button>
      </form>
    </div>
  );
}

export default RegistrationPage;
