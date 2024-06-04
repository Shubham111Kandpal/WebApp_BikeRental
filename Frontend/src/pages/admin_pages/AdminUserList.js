import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import "../css/AdminUserList.css";
import EditUser from "./AdminEdituser"; 
import Modal from "./Modal";
import AdminHeader from "../components/AdminHeader";

function AdminUserList() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editUserId, setEditUserId] = useState(null);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    setLoading(true);
    fetch("http://127.0.0.1:8005/users")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const fetchUserList = () => {
    setLoading(true);
    fetch("http://127.0.0.1:8005/users")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error:", error);
        setError(error.message);
        setLoading(false);
      });
  };

  // Filtered users based on search term
  const filteredUsers = searchTerm
    ? users.filter((user) =>
        Object.values(user).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : users;

  const handleDelete = (userId) => {
    fetch(`http://127.0.0.1:8005/users/${userId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          setUsers((prevUsers) =>
            prevUsers.filter((user) => user.user_id !== userId)
          );
        } else {
          throw new Error("Failed to delete the user");
        }
      })
      .catch((error) => {
        console.error("There was an error:", error);
      });
  };

  const handleEdit = (userId) => {
    setEditUserId(userId);
    setIsModalOpen(true);
  };

  const handleCancelEdit = () => {
    setEditUserId(null);
    setIsModalOpen(false);
  };

  const handleSaveEdit = (updatedUser) => {
    fetch(`http://127.0.0.1:8005/users/${updatedUser.user_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    })
      .then((response) => {
        if (response.ok) {
          // If the update is successful, update the local state
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.user_id === updatedUser.user_id ? updatedUser : user
            )
          );
          setEditUserId(null);
        } else {
          throw new Error("Failed to update the user");
        }
      })
      .catch((error) => {
        console.error("There was an error:", error);
      });
  };

  const handleUserUpdate = (updatedUser) => {
  };

  return (
    <div className="sticky-header">
      <AdminHeader />
      <div className="search-create-container">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* <Link to="/admin/create-user" className="btn"><button>Create User</button></Link> */}
      </div>

      {!isCreateUserModalOpen && editUserId === null && (
        <div className="table-container">
          {" "}
          <div className="user-table">
            <table className="user-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Registration Date</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.user_id}>
                    <td>{user.user_id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.phone_number}</td>
                    <td>{user.registration_date}</td>
                    <td>{user.last_login}</td>
                    <td>
                      <button onClick={() => handleEdit(user.user_id)}>
                        Edit
                      </button>
                      {/* <button onClick={() => handleDelete(user.user_id)}>
                        Delete
                      </button> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editUserId !== null && (
        <Modal isOpen={true} onClose={handleCancelEdit}>
          <EditUser
            user={users.find((user) => user.user_id === editUserId)}
            onCancel={handleCancelEdit}
            onSave={handleSaveEdit}
            onUserUpdate={handleUserUpdate}
          />
        </Modal>
      )}
    </div>
  );
}

export default AdminUserList;
