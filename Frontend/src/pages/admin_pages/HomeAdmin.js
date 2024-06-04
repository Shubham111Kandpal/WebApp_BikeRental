import React from "react";
import { Link } from "react-router-dom";
import "../css/HomeAdmin.css";
import AdminHeader from "../components/AdminHeader";
import RentalStats from "./RentalStats"; 

function Home() {
  return (
    <div className="home-container">
      <AdminHeader />
      <section className="hero-section">
        <div className="hero-overlay">
          <h1>Welcome to Admin System</h1>
          <p>This is a restricted site for the admins of SurreyBikes.com</p>
          <div className="features">
            <div className="feature">
              <Link to="/admin/update-bike" className="btn card">
                <span>Bike Management</span>
              </Link>
            </div>
            <div className="feature">
              <Link to="/admin/user-list" className="btn card">
                <span>User Management</span>
              </Link>
            </div>
            <div className="feature">
              <Link to="/admin/booking" className="btn card">
                <span>Booking Management</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <RentalStats />
      <footer className="footer"></footer>
    </div>
  );
}

export default Home;
