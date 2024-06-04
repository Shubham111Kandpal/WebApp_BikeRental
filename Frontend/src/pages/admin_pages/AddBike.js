import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/AddBike.css';
import AdminHeader from '../components/AdminHeader';

function AddBike({ bike, closeModal }) {
  const navigate = useNavigate();
  // Dropdown options
  const models = ['Select model','City Bike', 'Electric Bike', 'Mountain Bike', 'Hybrid Bike'];
  const statuses = ['Select status','Available', 'Booked', 'Maintenance', 'Out of Service'];
  const locations = ['Select Location','AP Plaza', 'Central Distribution Centre', 'IFH Lab', 'Stag Hill Reception', 'Duke of Kent'];
  const conditions = ['Select Condition','New', 'Good', 'Fair', 'Poor'];
 
  // State for form fields
  const [form, setForm] = useState({
    model: '',
    bike_status: '',
    current_location: '',
    bike_condition: '',
    price_per_hour: '',
    last_maintenance_date: '',
    maintenance_history: ''
  });
 
  useEffect(() => {
    if (bike) {
      setForm({
        model: bike.model || 'Select model',
        bike_status: bike.bike_status || 'Select status',
        current_location: bike.current_location || 'Select location',
        bike_condition: bike.bike_condition || 'Select condition',
        price_per_hour: bike.price_per_hour,
        last_maintenance_date: bike.last_maintenance_date,
        maintenance_history: bike.maintenance_history
      });
    }
  }, [bike]);
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.model === 'Select model' || form.status === 'Select status' || form.location === 'Select location' || form.condition === 'Select condition') {
      alert('Please select all required fields.');
      return;
    }
    const url = bike && bike.bike_id ? `http://localhost:8002/bikes/${bike.bike_id}` : 'http://localhost:8002/bikes/';
    const method = bike && bike.bike_id ? 'PUT' : 'POST';
 
    try {
      const response = await axios({
        method: method,
        url: url,
        data: form,
        headers: { 'Content-Type': 'application/json' },
      });
 
      if (response.status === 200 || response.status === 201) {
        closeModal();
        navigate('/admin/bikes');
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    }
  };
 
  return (
    <div className="add-bike-container">
      <AdminHeader />
      <h1>{bike && bike.bike_id ? 'Update Bike' : 'Add New Bike'}</h1>
      {bike && bike.bike_id && (
        <div className="form-group">
          <label htmlFor="bikeId">Bike ID:</label>
          <input type="text" id="bikeId" value={bike.bike_id} readOnly className="input-field" />
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="model">Model:</label>
          <select id="model" name="model" value={form.model} onChange={handleChange} required className="input-field">
            {models.map(model => <option key={model} value={model}>{model}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="status">Status:</label>
          <select id="status" name="status" value={form.status} onChange={handleChange} required className="input-field">
            {statuses.map(status => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="location">Location:</label>
          <select id="location" name="location" value={form.location} onChange={handleChange} required className="input-field">
            {locations.map(location => <option key={location} value={location}>{location}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="condition">Condition:</label>
          <select id="condition" name="condition" value={form.condition} onChange={handleChange} required className="input-field">
            {conditions.map(condition => <option key={condition} value={condition}>{condition}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="price_per_hour">Price Per Hour:</label>
          <input type="number" id="price_per_hour" name="price_per_hour" value={form.price_per_hour} onChange={handleChange} required className="input-field" />
        </div>
        <div className="form-group">
          <label htmlFor="last_maintenance_date">Last Maintenance Date:</label>
          <input type="date" id="last_maintenance_date" name="last_maintenance_date" value={form.last_maintenance_date} onChange={handleChange} required className="input-field" />
        </div>
        <div className="form-group">
          <label htmlFor="maintenance_history">Maintenance History:</label>
          <textarea id="maintenance_history" name="maintenance_history" value={form.maintenance_history} onChange={handleChange} required className="input-field" />
        </div>
        <button type="submit" className="submit-button">Save Bike</button>
        <button type="button" onClick={closeModal} className="cancel-button">Cancel</button>
      </form>
    </div>
  );
}
 
export default AddBike;