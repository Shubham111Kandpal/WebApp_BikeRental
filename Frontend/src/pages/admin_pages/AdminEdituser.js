import React, { useState } from "react";
import "../css/AdminEditUser.css";

function EditUser({ user, onSave, onCancel }) {
  const [editedUser, setEditedUser] = useState({ ...user });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setEditedUser({ ...editedUser, [name]: checked });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedUser);
  };

  return (
    <div className="edit-user-container">
      <h2 className="edit-user-header">Edit User</h2>
      <form onSubmit={handleSubmit}>
        {/* User ID */}
        <div className="edit-user-form-group">
          <span className="edit-user-label">User ID: {editedUser.user_id}</span>
        </div>

        {/* Username */}
        <div className="edit-user-form-group">
          <input
            type="text"
            name="username"
            value={editedUser.username}
            onChange={handleInputChange}
            className="edit-user-input"
          />
        </div>

        {/* Email */}
        <div className="edit-user-form-group">
          <input
            type="email"
            name="email"
            value={editedUser.email}
            onChange={handleInputChange}
            className="edit-user-input"
          />
        </div>

        {/* Phone Number */}
        <div className="edit-user-form-group">
          <input
            type="text"
            name="phone_number"
            value={editedUser.phone_number}
            onChange={handleInputChange}
            className="edit-user-input"
          />
        </div>

        {/* Active Checkbox */}
        {/* Active Checkbox */}
        <div className="edit-user-form-group">
          <label className="edit-user-label">Status:</label>
          <div className="edit-user-checkbox-container">
            <input
              type="checkbox"
              name="active"
              checked={editedUser.active || false}
              onChange={handleCheckboxChange}
              className="edit-user-checkbox"
            />
            <div className="edit-user-checkbox-status">
              {editedUser.active ? "Active" : "Inactive"}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="edit-user-button-container">
          <button
            type="submit"
            className="edit-user-button edit-user-save-button"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="edit-user-button edit-user-cancel-button"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditUser;
