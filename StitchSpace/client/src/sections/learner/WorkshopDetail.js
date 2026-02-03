import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

function WorkshopDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchWorkshopDetails();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchWorkshopDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/workshops/${id}`);
      setWorkshop(response.data);

      // Check if user is already enrolled
      if (user?.role === "learner") {
        const token = localStorage.getItem("token");
        const enrollmentRes = await axios.get(
          `/api/workshops/${id}/check-enrollment`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setEnrolled(enrollmentRes.data.enrolled);
      }
    } catch (error) {
      console.error("Error fetching workshop details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    if (user.role !== "learner") {
      alert("Only learners can enroll in workshops!");
      return;
    }

    try {
      setEnrolling(true);
      const token = localStorage.getItem("token");
      await axios.post(
        `/api/workshops/${id}/enroll`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEnrolled(true);
      alert("Successfully enrolled in workshop!");
      // Redirect to learning interface after 1 second
      setTimeout(() => navigate(`/learning/${id}`), 1000);
    } catch (error) {
      console.error("Error enrolling in workshop:", error);
      alert("Failed to enroll. Please try again.");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        Loading workshop details...
      </div>
    );
  }

  if (!workshop) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <p>Workshop not found.</p>
        <Link to="/workshops" className="btn btn-primary">
          Back to Workshops
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      {/* Header Section */}
      <div style={{ marginBottom: "30px" }}>
        <Link
          to="/workshops"
          style={{
            color: "var(--primary-color)",
            textDecoration: "none",
            marginBottom: "15px",
            display: "inline-block",
          }}
        >
          ← Back to Workshops
        </Link>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 350px",
          gap: "30px",
        }}
      >
        {/* MAIN CONTENT */}
        <div>
          {/* Workshop Hero */}
          <div
            style={{
              height: "300px",
              backgroundColor: "var(--primary-color)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "5em",
              marginBottom: "30px",
            }}
          >
            🎨
          </div>

          {/* Title and Basic Info */}
          <h1 style={{ margin: "0 0 20px 0" }}>{workshop.title}</h1>

          <div
            style={{
              display: "flex",
              gap: "20px",
              marginBottom: "30px",
              flexWrap: "wrap",
              fontSize: "1.05em",
            }}
          >
            <div>
              <strong>👨‍🏫 Instructor:</strong>
              <p style={{ margin: "5px 0 0 0" }}>
                <Link
                  to={`/artisan-profile/${workshop.artisan?._id}`}
                  style={{
                    color: "var(--primary-color)",
                    textDecoration: "none",
                  }}
                >
                  {workshop.artisan?.name || "Unknown Artisan"}
                </Link>
              </p>
            </div>
            <div>
              <strong>📚 Skill Level:</strong>
              <p style={{ margin: "5px 0 0 0" }}>{workshop.level}</p>
            </div>
            <div>
              <strong>⏱️ Duration:</strong>
              <p style={{ margin: "5px 0 0 0" }}>{workshop.duration}</p>
            </div>
            <div>
              <strong>👥 Max Participants:</strong>
              <p style={{ margin: "5px 0 0 0" }}>{workshop.maxParticipants}</p>
            </div>
          </div>

          {/* Workshop Description */}
          <div
            className="card"
            style={{ padding: "20px", marginBottom: "30px" }}
          >
            <h2>📖 Workshop Description</h2>
            <p style={{ lineHeight: "1.6", color: "#555" }}>
              {workshop.description}
            </p>
          </div>

          {/* Curriculum / Learning Outcomes */}
          {workshop.learningOutcomes &&
            workshop.learningOutcomes.length > 0 && (
              <div
                className="card"
                style={{ padding: "20px", marginBottom: "30px" }}
              >
                <h2>🎯 What You'll Learn</h2>
                <ul style={{ lineHeight: "1.8" }}>
                  {workshop.learningOutcomes.map((outcome, idx) => (
                    <li key={idx} style={{ marginBottom: "10px" }}>
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {/* Materials Needed */}
          {workshop.materials && workshop.materials.length > 0 && (
            <div
              className="card"
              style={{ padding: "20px", marginBottom: "30px" }}
            >
              <h2>🛠️ Materials & Supplies</h2>
              <ul style={{ lineHeight: "1.8" }}>
                {workshop.materials.map((material, idx) => (
                  <li key={idx} style={{ marginBottom: "10px" }}>
                    {material}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Artisan Profile Section */}
          {workshop.artisan && (
            <div
              className="card"
              style={{ padding: "20px", marginBottom: "30px" }}
            >
              <h2>👨‍🎨 About the Artisan</h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "100px 1fr",
                  gap: "20px",
                  alignItems: "start",
                }}
              >
                <div
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    backgroundColor: "var(--primary-color)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "2.5em",
                  }}
                >
                  👨‍🎨
                </div>
                <div>
                  <h3 style={{ margin: "0 0 10px 0" }}>
                    <Link
                      to={`/artisan-profile/${workshop.artisan._id}`}
                      style={{
                        color: "var(--primary-color)",
                        textDecoration: "none",
                      }}
                    >
                      {workshop.artisan.name}
                    </Link>
                  </h3>
                  <p style={{ color: "#666", marginBottom: "10px" }}>
                    Experienced textile artisan and educator
                  </p>
                  <Link
                    to={`/artisan-profile/${workshop.artisan._id}`}
                    className="btn btn-primary"
                    style={{ textDecoration: "none" }}
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SIDEBAR - Enrollment Card */}
        <div>
          <div
            className="card"
            style={{ padding: "20px", position: "sticky", top: "20px" }}
          >
            <div style={{ marginBottom: "20px" }}>
              <p
                style={{
                  fontSize: "1.3em",
                  fontWeight: "bold",
                  color: "var(--primary-color)",
                  margin: "0",
                }}
              >
                ${workshop.price}
              </p>
              <p
                style={{
                  color: "#999",
                  margin: "5px 0 0 0",
                  fontSize: "0.9em",
                }}
              >
                per workshop
              </p>
            </div>

            {/* Enroll Button */}
            {enrolled ? (
              <div style={{ marginBottom: "15px" }}>
                <button
                  className="btn btn-primary"
                  style={{
                    width: "100%",
                    padding: "12px",
                    marginBottom: "10px",
                  }}
                  onClick={() => navigate(`/learning/${workshop._id}`)}
                >
                  📚 Go to Learning
                </button>
                <p
                  style={{
                    color: "var(--primary-color)",
                    textAlign: "center",
                    fontSize: "0.9em",
                    margin: "10px 0 0 0",
                  }}
                >
                  ✅ You're enrolled!
                </p>
              </div>
            ) : (
              <button
                className="btn btn-primary"
                style={{ width: "100%", padding: "12px", marginBottom: "15px" }}
                onClick={handleEnroll}
                disabled={enrolling}
              >
                {enrolling ? "Enrolling..." : "🎓 Enroll Now"}
              </button>
            )}

            {/* Workshop Details */}
            <div style={{ borderTop: "1px solid #eee", paddingTop: "15px" }}>
              <p style={{ fontSize: "0.9em", marginBottom: "10px" }}>
                <strong>📝 Workshop Details:</strong>
              </p>
              <ul
                style={{
                  fontSize: "0.9em",
                  color: "#666",
                  margin: "0",
                  paddingLeft: "20px",
                }}
              >
                <li style={{ marginBottom: "8px" }}>
                  <strong>Start Date:</strong>{" "}
                  {workshop.startDate
                    ? new Date(workshop.startDate).toLocaleDateString()
                    : "TBA"}
                </li>
                <li style={{ marginBottom: "8px" }}>
                  <strong>Category:</strong> {workshop.category}
                </li>
                <li style={{ marginBottom: "8px" }}>
                  <strong>Participants:</strong>{" "}
                  {workshop.enrolled?.length || 0}/{workshop.maxParticipants}
                </li>
                <li>
                  <strong>Type:</strong>{" "}
                  {workshop.videoUrl ? "📹 Recorded" : "🔴 Live Session"}
                </li>
              </ul>
            </div>

            {/* Share Button */}
            <button
              className="btn"
              style={{ width: "100%", padding: "10px", marginTop: "15px" }}
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Workshop link copied!");
              }}
            >
              📤 Share Workshop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkshopDetail;
