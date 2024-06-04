import React from 'react';
import '../css/BikeCard.css'; 

function ModalBike({ bikes = [], closeModal }) {
    return (
      <div className="modal-backdrop">
        <div className="modal-content">
          <h2>Bike Selection</h2>
          <div className="bike-cards">
            {bikes.map(bike => (  
              <div key={bike.id} className="bike-card">
                <img src={`/images/${bike.model.toLowerCase().replace(' ', '_')}.jpeg`} alt={bike.model} className="bike-image" />
                <div className="bike-details">
                  <h3>Model: {bike.model}</h3>
                  <p>ID: {bike.bike_id}</p>
                  <p>Status: {bike.bike_status}</p>
                  <p>Location: {bike.current_location}</p>
                  <p>Condition: {bike.bike_condition}</p>
                  <p>Price: ${bike.price_per_hour}</p>
                  <p>Last Maintenance: {bike.lastMaintenance}</p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={closeModal}>Close</button>
        </div>
      </div>
    );
  }
  

export default ModalBike;
