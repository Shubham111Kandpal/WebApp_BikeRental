import React, { useState, useEffect } from "react";
import ConfirmationModal from "./ConfirmationModal";
import "../css/BikeSelectionPage.css";
import Header from "../components/Header";

function BikeSelectionPage() {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [bikes, setBikes] = useState([]);
  const [filteredBikes, setFilteredBikes] = useState([]);
  const [selectedBike, setSelectedBike] = useState(null);

  const locations = [
    "AP Plaza",
    "Central Distribution Centre",
    "IFH Lab",
    "Stag Hill Reception",
    "Duke of Kent",
    "Student Union",
  ];

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const response = await fetch("http://localhost:8002/bikes/available");
        const data = await response.json();
        setBikes(data);
      } catch (error) {
        console.error("Error fetching bikes:", error);
      }
    };
    fetchBikes();
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      const filtered = bikes.filter(
        (bike) => bike.current_location === selectedLocation
      );
      setFilteredBikes(filtered);
    }
  }, [selectedLocation, bikes]);

  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  const handleBikeSelect = (bike) => {
    setSelectedBike(bike);
  };

  const handleCloseModal = () => {
    setSelectedBike(null);
  };

  return (
    <div>
      <Header />
      <h1>Select Your Bike Location</h1>
      <select onChange={handleLocationChange} value={selectedLocation}>
        <option value="">Choose a Location</option>
        {locations.map((current_location, index) => (
          <option key={index} value={current_location}>
            {current_location}
          </option>
        ))}
      </select>
      <div className="bike-cards-container">
        {filteredBikes.map((bike) => (
          <div
            key={bike.bike_id}
            className={`bike-card ${
              bike.model.includes("Electric") ? "electric-bike" : "city-bike"
            }`}
          >
            <img
              src={`/${bike.model.replace(/\s+/g, "_").toLowerCase()}.jpeg`}
              alt={bike.model}
            />
            <div className="bike-details">
              <h3>{bike.model}</h3>
              <p>
                <strong>ID: </strong>
                {bike.bike_id}
              </p>
              <p>
                <strong>Status: </strong>
                {bike.bike_status}
              </p>
              <p>
                <strong>Location: </strong>
                {bike.current_location}
              </p>
              <p>
                <strong>Condition: </strong>
                {bike.bike_condition}
              </p>
              <p>
                <strong>Price: </strong>￡{bike.price_per_hour}  per hour
              </p>
            </div>
            <button
              className="book-now-btn"
              onClick={() => handleBikeSelect(bike)}
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
      {selectedBike && (
        <ConfirmationModal bike={selectedBike} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default BikeSelectionPage;
