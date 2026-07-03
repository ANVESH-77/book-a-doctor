import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/doctors", {
        params: { search, specialization },
      });
      setDoctors(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDoctors();
  };

  return (
    <div className="page-container">
      <h1>Find a Doctor</h1>
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by name or specialization"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="text"
          placeholder="Specialization (e.g. Cardiologist)"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
        />
        <button className="btn-primary" type="submit">
          Search
        </button>
      </form>

      {loading ? (
        <p>Loading doctors...</p>
      ) : doctors.length === 0 ? (
        <p>No doctors found.</p>
      ) : (
        <div className="doctor-grid">
          {doctors.map((doc) => (
            <div className="doctor-card" key={doc._id}>
              <div className="doctor-avatar">👨‍⚕️</div>
              <h3>{doc.user?.name}</h3>
              <p className="specialization">{doc.specialization}</p>
              <p>{doc.experienceYears} yrs experience</p>
              <p className="fee">Fee: ${doc.consultationFee}</p>
              <Link className="btn-secondary-sm" to={`/doctors/${doc._id}`}>
                View Profile
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorList;
