import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-hero">
      <div className="hero-content">
        <h1>Find the right doctor. Book with confidence.</h1>
        <p>
          Book a Doctor connects patients with trusted healthcare providers.
          Browse doctors, schedule appointments, upload medical documents,
          and stay updated — all in one place.
        </p>
        <div className="hero-actions">
          <Link to="/doctors" className="btn-primary">
            Browse Doctors
          </Link>
          <Link to="/register" className="btn-secondary">
            Get Started
          </Link>
        </div>
      </div>
      <div className="hero-features">
        <div className="feature-card">
          <h3>👨‍⚕️ Browse Doctors</h3>
          <p>Search by specialization and find the right provider for you.</p>
        </div>
        <div className="feature-card">
          <h3>📅 Schedule Appointments</h3>
          <p>Book appointments in a few clicks based on doctor availability.</p>
        </div>
        <div className="feature-card">
          <h3>📄 Secure Document Uploads</h3>
          <p>Share medical records and reports securely with your doctor.</p>
        </div>
        <div className="feature-card">
          <h3>🔔 Real-time Notifications</h3>
          <p>Get updates on appointment status and reminders instantly.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
