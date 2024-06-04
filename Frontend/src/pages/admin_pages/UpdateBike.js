import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import AddBike from "./AddBike"; 
import "../css/UpdateBike.css"; 
import AdminHeader from "../components/AdminHeader";

function UpdateBike() {
  const [bikes, setBikes] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedBike, setSelectedBike] = useState(null);
  const [searchId, setSearchId] = useState("");

  useEffect(() => {
    fetchBikes();
  }, []);

  const fetchBikes = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8002/bikes/");
      setBikes(response.data);
    } catch (error) {
      console.error("Error fetching bikes:", error);
      alert("Failed to fetch bikes");
    }
  };

  const openModal = (bike = null) => {
    setSelectedBike(bike);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedBike(null);
    fetchBikes(); 
  };

  const handleDeleteBike = async (bikeId) => {
    if (window.confirm("Are you sure you want to delete this bike?")) {
      try {
        await axios.delete(`http://127.0.0.1:8002/bikes/${bikeId}`);
        fetchBikes();
      } catch (error) {
        console.error("Error deleting bike:", error);
        alert("Failed to delete bike");
      }
    }
  };

  return (
    <div>
      <AdminHeader />
      <div className="update-bikes-page">
        <h1>Bikes Details</h1>
        <div className="search-container">
          <input
            type="number"
            placeholder="Search by Bike ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="search-input"
          />
          <div className="add-bike-button-container">
            <button onClick={() => openModal()}>Add New Bike</button>
          </div>
        </div>
        <div className="table-wrapper">
          <table className="user-table">
            <thead>
              <tr>
                <th>Bike ID</th>
                <th>Model</th>
                <th>Status</th>
                <th>Location</th>
                <th>Condition</th>
                <th>Price per Hour</th>
                <th>Last Maintenance Date</th>
                <th>Maintenance History</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bikes
                .filter(
                  (bike) =>
                    bike.bike_id.toString().includes(searchId) || searchId === ""
                )
                .map((bike) => (
                  <tr key={bike.bike_id}>
                    <td>{bike.bike_id}</td>
                    <td>{bike.model}</td>
                    <td>{bike.bike_status}</td>
                    <td>{bike.current_location}</td>
                    <td>{bike.bike_condition}</td>
                    <td>{bike.price_per_hour}</td>
                    <td>{bike.last_maintenance_date}</td>
                    <td>{bike.maintenance_history}</td>
                    <td>
                      <button onClick={() => openModal(bike)}>Update</button>
                      {/*}  <button onClick={() => handleDeleteBike(bike.id)}>
                        Delete
                </button>*/}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        <AddBike bike={selectedBike} closeModal={closeModal} />
      </Modal>
    </div>
  );
}

export default UpdateBike;
