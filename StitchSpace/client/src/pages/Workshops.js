import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Workshops.css";

function Workshops() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ category: "", level: "" });

  useEffect(() => {
    fetchWorkshops();
  }, [filter]);

  const fetchWorkshops = async () => {
    try {
      const params = new URLSearchParams();
      if (filter.category) params.append("category", filter.category);
      if (filter.level) params.append("level", filter.level);

      const response = await axios.get(`/api/workshops?${params}`);
      setWorkshops(response.data);
    } catch (error) {
      console.error("Error fetching workshops:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading workshops...</div>;

  return (
    <div className="workshops-container">
      <h1 className="section-title">Learning Hub</h1>

      <div className="filters">
        <select
          value={filter.category}
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
        >
          <option value="">All Categories</option>
          <option value="Weaving">Weaving</option>
          <option value="Embroidery">Embroidery</option>
          <option value="Dyeing">Dyeing</option>
          <option value="Knitting">Knitting</option>
          <option value="Stitching">Stitching</option>
        </select>

        <select
          value={filter.level}
          onChange={(e) => setFilter({ ...filter, level: e.target.value })}
        >
          <option value="">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      <div className="workshops-grid">
        {workshops.map((workshop) => (
          <Link
            key={workshop._id}
            to={`/workshops/${workshop._id}`}
            className="workshop-card card"
          >
            <div className="workshop-image">
              {workshop.images?.[0] ? (
                <img src={workshop.images[0]} alt={workshop.title} />
              ) : (
                <div className="placeholder">📚</div>
              )}
            </div>
            <div className="workshop-content">
              <h3>{workshop.title}</h3>
              <p className="artisan">by {workshop.artisan?.name}</p>
              <p className="description">
                {workshop.description.substring(0, 100)}...
              </p>

              <div className="workshop-meta">
                <span className="badge badge-info">{workshop.level}</span>
                <span className="badge badge-info">{workshop.category}</span>
              </div>

              <div className="workshop-footer">
                <span className="price">${workshop.price}</span>
                <span className="participants">
                  {workshop.currentParticipants}/{workshop.maxParticipants}{" "}
                  enrolled
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {workshops.length === 0 && (
        <div className="empty-state">
          <p>No workshops found. Try adjusting your filters!</p>
        </div>
      )}
    </div>
  );
}

export default Workshops;
