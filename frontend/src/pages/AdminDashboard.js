import React, { useEffect, useState } from "react";
import api from "../api/axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState("overview");

  const fetchAll = async () => {
    const [statsRes, doctorsRes, usersRes] = await Promise.all([
      api.get("/admin/stats"),
      api.get("/doctors/admin/all"),
      api.get("/admin/users"),
    ]);
    setStats(statsRes.data);
    setDoctors(doctorsRes.data);
    setUsers(usersRes.data);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const approveDoctor = async (id) => {
    await api.put(`/doctors/${id}/approve`);
    fetchAll();
  };

  const deactivateUser = async (id) => {
    await api.put(`/admin/users/${id}/deactivate`);
    fetchAll();
  };

  return (
    <div className="page-container">
      <h1>Admin Dashboard</h1>
      <div className="tab-bar">
        <button className={tab === "overview" ? "tab active" : "tab"} onClick={() => setTab("overview")}>
          Overview
        </button>
        <button className={tab === "doctors" ? "tab active" : "tab"} onClick={() => setTab("doctors")}>
          Doctors
        </button>
        <button className={tab === "users" ? "tab active" : "tab"} onClick={() => setTab("users")}>
          Users
        </button>
      </div>

      {tab === "overview" && stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
          <div className="stat-card">
            <h3>{stats.totalPatients}</h3>
            <p>Patients</p>
          </div>
          <div className="stat-card">
            <h3>{stats.totalDoctors}</h3>
            <p>Doctors</p>
          </div>
          <div className="stat-card">
            <h3>{stats.totalAppointments}</h3>
            <p>Total Appointments</p>
          </div>
          <div className="stat-card">
            <h3>{stats.pendingAppointments}</h3>
            <p>Pending Appointments</p>
          </div>
        </div>
      )}

      {tab === "doctors" && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Specialization</th>
              <th>Approved</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((d) => (
              <tr key={d._id}>
                <td>{d.user?.name}</td>
                <td>{d.specialization}</td>
                <td>{d.isApproved ? "Yes" : "No"}</td>
                <td>
                  {!d.isApproved && (
                    <button className="btn-primary-sm" onClick={() => approveDoctor(d._id)}>
                      Approve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tab === "users" && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Active</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.isActive ? "Yes" : "No"}</td>
                <td>
                  {u.isActive && (
                    <button className="btn-danger-sm" onClick={() => deactivateUser(u._id)}>
                      Deactivate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;
