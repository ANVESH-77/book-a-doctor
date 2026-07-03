import React, { useEffect, useState } from "react";
import api from "../api/axios";

const statusColors = {
  pending: "badge-pending",
  confirmed: "badge-confirmed",
  completed: "badge-completed",
  cancelled: "badge-cancelled",
};

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState(null);

  const fetchAppointments = async () => {
    setLoading(true);
    const { data } = await api.get("/appointments/my");
    setAppointments(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    await api.delete(`/appointments/${id}`);
    fetchAppointments();
  };

  const handleUpload = async (id, file) => {
    if (!file) return;
    setUploadingId(id);
    const formData = new FormData();
    formData.append("document", file);
    try {
      await api.post(`/appointments/${id}/documents`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchAppointments();
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <div className="page-container">
      <h1>My Appointments</h1>
      {loading ? (
        <p>Loading...</p>
      ) : appointments.length === 0 ? (
        <p>You have no appointments yet. Browse doctors to book one!</p>
      ) : (
        <div className="appointment-list">
          {appointments.map((a) => (
            <div className="appointment-card" key={a._id}>
              <div className="appointment-header">
                <h3>Dr. {a.doctor?.user?.name}</h3>
                <span className={`badge ${statusColors[a.status]}`}>{a.status}</span>
              </div>
              <p>{a.doctor?.specialization}</p>
              <p>
                📅 {new Date(a.date).toDateString()} — {a.timeSlot}
              </p>
              {a.reason && <p>Reason: {a.reason}</p>}

              <div className="documents-section">
                <h4>Documents</h4>
                {a.documents?.length > 0 ? (
                  <ul>
                    {a.documents.map((doc, i) => (
                      <li key={i}>{doc.fileName}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="muted">No documents uploaded</p>
                )}
                {a.status !== "cancelled" && (
                  <label className="upload-label">
                    {uploadingId === a._id ? "Uploading..." : "+ Upload Document"}
                    <input
                      type="file"
                      hidden
                      onChange={(e) => handleUpload(a._id, e.target.files[0])}
                    />
                  </label>
                )}
              </div>

              {["pending", "confirmed"].includes(a.status) && (
                <button className="btn-danger-sm" onClick={() => handleCancel(a._id)}>
                  Cancel Appointment
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
