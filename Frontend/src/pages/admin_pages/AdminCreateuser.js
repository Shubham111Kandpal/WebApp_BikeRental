import React, { useState } from "react";
import "../css/AdminCreateuser.css";
import AdminHeader from '../components/AdminHeader';

function CreateUser() {
  const formatDate = (date) => {
    const d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    return [year, month.padStart(2, "0"), day.padStart(2, "0")].join("-");
  };

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    creditCardNumber: "",
    expirationDate: "",
    cvv: "",
    registration_date: formatDate(new Date()),
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8005/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessages = errorData.detail
          .map((err) => {
            return `${err.loc.join(" -> ")}: ${err.msg}`;
          })
          .join(", ");
        throw new Error(`Error ${response.status}: ${errorMessages}`);
      }

      alert("User created successfully!"); // Success message
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      alert("Failed to create user: " + error.message); // Error message
    }
  };

  return (
    <div className="form-container createuser-form">
      <AdminHeader />
      <h1>Create New User</h1>
      <form onSubmit={handleSubmit}>
        {/* Username Field */}
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          required
        />
        <br />

        {/* Email Field */}
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <br />

        <label htmlFor="phone_number">Phone Number:</label>
        <input
          id="phone_number"
          type="text"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
          placeholder="Phone Number"
          required
        />

        {/* Password Field */}
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <br />

        {/* Confirm Password Field */}
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
          required
        />
        <br />

        {/* Credit Card Number Field */}
        <label htmlFor="creditCardNumber">Credit Card Number:</label>
        <input
          id="creditCardNumber"
          type="text"
          name="creditCardNumber"
          value={formData.creditCardNumber}
          onChange={handleChange}
          placeholder="0000 0000 0000 0000"
          pattern="\d{4} \d{4} \d{4} \d{4}"
          title="Enter a valid credit card number (e.g., 0000 0000 0000 0000)"
          required
        />
        <br />

        {/* Expiration Date Field */}
        <label htmlFor="expirationDate">Expiration Date:</label>
        <input
          id="expirationDate"
          type="text"
          name="expirationDate"
          value={formData.expirationDate}
          onChange={handleChange}
          placeholder="MM/YY"
          pattern="\d{2}/\d{2}"
          title="Expiration date must be in MM/YY format"
          required
        />
        <br />

        {/* CVV Field */}
        <label htmlFor="cvv">CVV:</label>
        <input
          id="cvv"
          type="text"
          name="cvv"
          value={formData.cvv}
          onChange={handleChange}
          placeholder="CVV"
          pattern="\d{3}"
          title="CVV must be 3 digits"
          required
        />
        <br />
        <label htmlFor="registration_date">Registration Date:</label>
        <input
          id="registration_date"
          type="date"
          name="registration_date"
          value={formData.registration_date}
          onChange={handleChange}
          readOnly // This makes the field non-editable
          required
        />

        <button type="submit">Create User</button>
      </form>
    </div>
  );
}

export default CreateUser;
