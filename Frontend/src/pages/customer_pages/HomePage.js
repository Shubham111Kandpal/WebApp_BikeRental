import React from "react";
import { Link } from "react-router-dom";
import "../css/HomePage.css";
import Header from "../components/Header";

function HomePage() {
  return (
    <div className="home-container">
      <Header />
      <section className="hero-section">
        <div className="hero-overlay">
          <h1>Welcome to CycleConnect.com</h1>
          <p>
            Your adventure starts here. Find the perfect bike to explore the
            city.
          </p>
          <div className="cards-container">
            <Link to="/customer/bike-select" className="card btn btn-primary">
              <div className="card-content">
                <h2>Book Now</h2>
              </div>
            </Link>
            <Link to="/customer/bookings" className="card btn btn-secondary">
              <div className="card-content">
                <h2>Bookings</h2>
              </div>
            </Link>
          </div>
        </div>
      </section>
      <footer className="footer"></footer>
    </div>
  );
}

export default HomePage;
