import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const dashboardPath = {
  patient: "/dashboard",
  doctor: "/doctor-dashboard",
  admin: "/admin-dashboard",
};

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "patient",
    specialization: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await register(form);
      navigate(dashboardPath[user.role] || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Create Your Account</h2>
        {error && <div className="alert-error">{error}</div>}
        <label>Full Name</label>
        <input type="text" name="name" value={form.name} onChange={handleChange} required />
        <label>Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} required />
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          minLength={6}
          required
        />
        <label>Phone</label>
        <input type="text" name="phone" value={form.phone} onChange={handleChange} />
        <label>I am a</label>
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
        </select>
        {form.role === "doctor" && (
          <>
            <label>Specialization</label>
            <input
              type="text"
              name="specialization"
              value={form.specialization}
              onChange={handleChange}
              placeholder="e.g. Cardiologist"
            />
          </>
        )}
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Sign Up"}
        </button>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
