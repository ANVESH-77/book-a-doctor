import React, { useEffect, useState } from "react";
import api from "../api/axios";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    const { data } = await api.get("/notifications");
    setNotifications(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markRead = async (id) => {
    await api.put(`/notifications/${id}/read`);
    fetchNotifications();
  };

  const markAllRead = async () => {
    await api.put("/notifications/read-all");
    fetchNotifications();
  };

  return (
    <div className="page-container">
      <div className="page-header-row">
        <h1>Notifications</h1>
        {notifications.some((n) => !n.isRead) && (
          <button className="btn-secondary-sm" onClick={markAllRead}>
            Mark all as read
          </button>
        )}
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <div className="notification-list">
          {notifications.map((n) => (
            <div
              className={`notification-item ${n.isRead ? "" : "unread"}`}
              key={n._id}
              onClick={() => !n.isRead && markRead(n._id)}
            >
              <p>{n.message}</p>
              <span className="notif-date">{new Date(n.createdAt).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
