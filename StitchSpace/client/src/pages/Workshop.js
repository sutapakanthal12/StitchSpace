import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Workshop.css";

function Workshop({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetchWorkshop();
  }, [id]);

  const fetchWorkshop = async () => {
    try {
      const response = await axios.get(`/api/workshops/${id}`);
      setWorkshop(response.data);
      if (user) {
        setEnrolled(response.data.enrolled.includes(user.id));
      }
    } catch (error) {
      console.error("Error fetching workshop:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    try {
      await axios.post(
        `/api/workshops/${id}/enroll`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setEnrolled(true);
      fetchWorkshop();
    } catch (error) {
      alert(error.response?.data?.message || "Error enrolling in workshop");
    }
  };

  const handleReview = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    try {
      await axios.post(
        `/api/workshops/${id}/review`,
        { rating, comment },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setComment("");
      setRating(5);
      fetchWorkshop();
    } catch (error) {
      alert("Error adding review");
    }
  };

  if (loading) return <div className="loading">Loading workshop...</div>;
  if (!workshop) return <div className="loading">Workshop not found</div>;

  return (
    <div className="workshop-detail">
      <div className="workshop-hero">
        <h1>{workshop.title}</h1>
        <p>
          by <strong>{workshop.artisan?.name}</strong>
        </p>
      </div>

      <div className="workshop-grid">
        <div className="workshop-main">
          <div className="workshop-description">
            <h2>About This Workshop</h2>
            <p>{workshop.description}</p>
          </div>

          <div className="workshop-section">
            <h2>Learning Outcomes</h2>
            <ul>
              {workshop.learningOutcomes?.map((outcome, i) => (
                <li key={i}>{outcome}</li>
              ))}
            </ul>
          </div>

          <div className="workshop-section">
            <h2>Materials Needed</h2>
            <ul>
              {workshop.materials?.map((material, i) => (
                <li key={i}>{material}</li>
              ))}
            </ul>
          </div>

          <div className="workshop-section">
            <h2>Reviews ({workshop.reviews?.length || 0})</h2>

            {user && (
              <div className="review-form">
                <h3>Leave a Review</h3>
                <div className="form-group">
                  <label>Rating:</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(parseInt(e.target.value))}
                  >
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Fair</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Very Good</option>
                    <option value="5">5 - Excellent</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Comment:</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience..."
                  />
                </div>
                <button className="btn btn-primary" onClick={handleReview}>
                  Submit Review
                </button>
              </div>
            )}

            <div className="reviews-list">
              {workshop.reviews?.map((review, i) => (
                <div key={i} className="review">
                  <div className="review-rating">
                    {"⭐".repeat(review.rating)}
                  </div>
                  <p>{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="workshop-sidebar">
          <div className="workshop-card card">
            <div className="price-section">
              <span className="price">${workshop.price}</span>
              <span className="level">{workshop.level}</span>
            </div>

            <div className="workshop-info">
              <p>
                <strong>Duration:</strong> {workshop.duration}
              </p>
              <p>
                <strong>Category:</strong> {workshop.category}
              </p>
              <p>
                <strong>Enrolled:</strong> {workshop.currentParticipants}/
                {workshop.maxParticipants}
              </p>
              {workshop.isSustainable && (
                <p className="badge-success">🌱 Sustainable</p>
              )}
            </div>

            <button
              className={`btn ${enrolled ? "btn-secondary" : "btn-primary"}`}
              onClick={handleEnroll}
            >
              {enrolled ? "Already Enrolled ✓" : "Enroll Now"}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Workshop;
