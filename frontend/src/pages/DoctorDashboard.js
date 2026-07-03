import React, { useEffect, useState } from "react";
import api from "../api/axios";

const statusColors = {
  pending: "badge-pending",
  confirmed: "badge-confirmed",
  completed: "badge-completed",
  cancelled: "badge-cancelled",
};

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    setLoading(true);
    const { data } = await api.get("/appointments/doctor");
    setAppointments(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/appointments/${id}/status`, { status });
    fetchAppointments();
  };

  return (
    <div className="page-container">
      <h1>My Patient Appointments</h1>
      {loading ? (
        <p>Loading...</p>
      ) : appointments.length === 0 ? (
        <p>No appointments yet.</p>
      ) : (
        <div className="appointment-list">
          {appointments.map((a) => (
            <div className="appointment-card" key={a._id}>
              <div className="appointment-header">
                <h3>{a.patient?.name}</h3>
                <span className={`badge ${statusColors[a.status]}`}>{a.status}</span>
              </div>
              <p>📧 {a.patient?.email}</p>
              {a.patient?.phone && <p>📞 {a.patient.phone}</p>}
              <p>
                📅 {new Date(a.date).toDateString()} — {a.timeSlot}
              </p>
              {a.reason && <p>Reason: {a.reason}</p>}

              {a.documents?.length > 0 && (
                <div className="documents-section">
                  <h4>Patient Documents</h4>
                  <ul>
                    {a.documents.map((doc, i) => (
                      <li key={i}>
                        <a
                          href={`${process.env.REACT_APP_API_URL?.replace("/api", "") || "http://localhost:5000"}${doc.filePath}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {doc.fileName}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="action-row">
                {a.status === "pending" && (
                  <>
                    <button className="btn-primary-sm" onClick={() => updateStatus(a._id, "confirmed")}>
                      Confirm
                    </button>
                    <button className="btn-danger-sm" onClick={() => updateStatus(a._id, "cancelled")}>
                      Decline
                    </button>
                  </>
                )}
                {a.status === "confirmed" && (
                  <button className="btn-primary-sm" onClick={() => updateStatus(a._id, "completed")}>
                    Mark Completed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
