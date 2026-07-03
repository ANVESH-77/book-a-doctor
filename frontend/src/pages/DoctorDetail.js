import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const DoctorDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [form, setForm] = useState({ date: "", timeSlot: "", reason: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/doctors/${id}`).then((res) => setDoctor(res.data));
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleBook = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      await api.post("/appointments", { doctorId: id, ...form });
      setMessage("Appointment requested successfully! Check your dashboard for status.");
      setForm({ date: "", timeSlot: "", reason: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    }
  };

  if (!doctor) return <p className="page-container">Loading doctor profile...</p>;

  return (
    <div className="page-container doctor-detail">
      <div className="doctor-profile-card">
        <div className="doctor-avatar large">👨‍⚕️</div>
        <h2>{doctor.user?.name}</h2>
        <p className="specialization">{doctor.specialization}</p>
        <p>{doctor.qualifications}</p>
        <p>{doctor.experienceYears} years of experience</p>
        <p>{doctor.bio}</p>
        <p className="fee">Consultation Fee: ${doctor.consultationFee}</p>
        <p>📍 {doctor.clinicAddress}</p>
        {doctor.availability?.length > 0 && (
          <div className="availability">
            <h4>Availability</h4>
            <ul>
              {doctor.availability.map((slot, i) => (
                <li key={i}>
                  {slot.day}: {slot.startTime} - {slot.endTime}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="booking-card">
        <h3>Book an Appointment</h3>
        {message && <div className="alert-success">{message}</div>}
        {error && <div className="alert-error">{error}</div>}
        <form onSubmit={handleBook}>
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
          <label>Time Slot</label>
          <input
            type="text"
            name="timeSlot"
            placeholder="e.g. 10:00 - 10:30"
            value={form.timeSlot}
            onChange={handleChange}
            required
          />
          <label>Reason for Visit</label>
          <textarea
            name="reason"
            value={form.reason}
            onChange={handleChange}
            rows={3}
          />
          <button className="btn-primary" type="submit">
            {user ? "Book Appointment" : "Login to Book"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoctorDetail;
