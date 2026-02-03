import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function LearnerDashboard({ user }) {
  const [activeTab, setActiveTab] = useState("enrolled");
  const [enrolledWorkshops, setEnrolledWorkshops] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [certificates, setCertificates] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === "learner") {
      fetchLearnerData();
    }
  }, [user]);

  const fetchLearnerData = async () => {
    try {
      setLoading(true);
      // Fetch enrolled workshops
      const workshopsRes = await axios.get("/api/workshops/enrolled", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setEnrolledWorkshops(workshopsRes.data);

      // Calculate progress for each workshop (stub for now)
      const progressData = {};
      workshopsRes.data.forEach((workshop) => {
        progressData[workshop._id] = Math.floor(Math.random() * 100); // Stub: random progress
      });
      setProgress(progressData);
    } catch (error) {
      console.error("Error fetching learner data:", error);
    } finally {
      setLoading(false);
    }
  };

  const completionRate =
    enrolledWorkshops.length > 0
      ? Math.round(
          Object.values(progress).reduce((a, b) => a + b, 0) /
            enrolledWorkshops.length
        )
      : 0;

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h1>📚 Learner Dashboard - Your Learning Journey</h1>

      {/* OVERVIEW TAB - Metrics */}
      {activeTab === "enrolled" && (
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "20px",
              marginBottom: "40px",
            }}
          >
            {/* Total Enrolled */}
            <div
              className="card"
              style={{
                padding: "25px",
                textAlign: "center",
                backgroundColor: "#f5f5f5",
              }}
            >
              <h2
                style={{ color: "var(--primary-color)", margin: "0 0 10px 0" }}
              >
                🎓 {enrolledWorkshops.length}
              </h2>
              <p style={{ margin: 0, color: "#666", fontSize: "0.95em" }}>
                Enrolled Workshops
              </p>
            </div>

            {/* In Progress */}
            <div
              className="card"
              style={{
                padding: "25px",
                textAlign: "center",
                backgroundColor: "#f5f5f5",
              }}
            >
              <h2
                style={{ color: "var(--primary-color)", margin: "0 0 10px 0" }}
              >
                🚀{" "}
                {
                  enrolledWorkshops.filter(
                    (w) =>
                      (progress[w._id] || 0) > 0 && (progress[w._id] || 0) < 100
                  ).length
                }
              </h2>
              <p style={{ margin: 0, color: "#666", fontSize: "0.95em" }}>
                In Progress
              </p>
            </div>

            {/* Completed */}
            <div
              className="card"
              style={{
                padding: "25px",
                textAlign: "center",
                backgroundColor: "#f5f5f5",
              }}
            >
              <h2
                style={{ color: "var(--primary-color)", margin: "0 0 10px 0" }}
              >
                ✅{" "}
                {
                  enrolledWorkshops.filter(
                    (w) => (progress[w._id] || 0) === 100
                  ).length
                }
              </h2>
              <p style={{ margin: 0, color: "#666", fontSize: "0.95em" }}>
                Completed
              </p>
            </div>

            {/* Overall Progress */}
            <div
              className="card"
              style={{
                padding: "25px",
                textAlign: "center",
                backgroundColor: "#f5f5f5",
              }}
            >
              <h2
                style={{ color: "var(--primary-color)", margin: "0 0 10px 0" }}
              >
                📊 {completionRate}%
              </h2>
              <p style={{ margin: 0, color: "#666", fontSize: "0.95em" }}>
                Overall Progress
              </p>
            </div>
          </div>

          {/* Enrolled Workshops List */}
          <div>
            <h2>🎓 Your Enrolled Workshops</h2>
            {loading ? (
              <p>Loading your workshops...</p>
            ) : enrolledWorkshops.length === 0 ? (
              <div
                className="card"
                style={{ padding: "30px", textAlign: "center" }}
              >
                <p
                  style={{
                    fontSize: "1.1em",
                    color: "#666",
                    marginBottom: "20px",
                  }}
                >
                  You haven't enrolled in any workshops yet. 📚
                </p>
                <p style={{ color: "#999", marginBottom: "20px" }}>
                  Explore our workshops and start learning traditional textile
                  skills!
                </p>
                <Link
                  to="/workshops"
                  className="btn btn-primary"
                  style={{ textDecoration: "none" }}
                >
                  Browse Workshops
                </Link>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "20px" }}>
                {enrolledWorkshops.map((workshop) => (
                  <div
                    key={workshop._id}
                    className="card"
                    style={{ padding: "20px" }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr auto",
                        gap: "20px",
                        alignItems: "start",
                      }}
                    >
                      <div>
                        <h3 style={{ margin: "0 0 10px 0" }}>
                          <Link
                            to={`/workshop/${workshop._id}`}
                            style={{
                              color: "var(--primary-color)",
                              textDecoration: "none",
                            }}
                          >
                            {workshop.title}
                          </Link>
                        </h3>
                        <p style={{ margin: "0 0 10px 0", color: "#666" }}>
                          {workshop.description}
                        </p>

                        <div
                          style={{
                            display: "flex",
                            gap: "15px",
                            flexWrap: "wrap",
                            marginBottom: "15px",
                            fontSize: "0.95em",
                          }}
                        >
                          <span>
                            👨‍🏫 {workshop.artisan?.name || "Unknown Artisan"}
                          </span>
                          <span>📚 Level: {workshop.level}</span>
                          <span>⏱️ Duration: {workshop.duration}</span>
                        </div>

                        {/* Progress Bar */}
                        <div style={{ marginBottom: "10px" }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: "5px",
                            }}
                          >
                            <span
                              style={{ fontSize: "0.9em", fontWeight: "bold" }}
                            >
                              Progress
                            </span>
                            <span style={{ fontSize: "0.9em", color: "#666" }}>
                              {progress[workshop._id] || 0}%
                            </span>
                          </div>
                          <div
                            style={{
                              width: "100%",
                              height: "20px",
                              backgroundColor: "#eee",
                              borderRadius: "10px",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `${progress[workshop._id] || 0}%`,
                                height: "100%",
                                backgroundColor: "var(--primary-color)",
                                transition: "width 0.3s ease",
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                          minWidth: "150px",
                        }}
                      >
                        {(progress[workshop._id] || 0) === 100 && (
                          <>
                            <div
                              style={{
                                textAlign: "center",
                                color: "var(--primary-color)",
                                fontWeight: "bold",
                              }}
                            >
                              ✅ Completed
                            </div>
                            <Link
                              to={`/certificate/${workshop._id}`}
                              className="btn btn-primary"
                              style={{
                                textDecoration: "none",
                                textAlign: "center",
                                padding: "8px 16px",
                              }}
                            >
                              📜 View Certificate
                            </Link>
                          </>
                        )}
                        {(progress[workshop._id] || 0) > 0 &&
                          (progress[workshop._id] || 0) < 100 && (
                            <Link
                              to={`/learning/${workshop._id}`}
                              className="btn btn-primary"
                              style={{
                                textDecoration: "none",
                                textAlign: "center",
                                padding: "8px 16px",
                              }}
                            >
                              Continue Learning
                            </Link>
                          )}
                        {(progress[workshop._id] || 0) === 0 && (
                          <Link
                            to={`/learning/${workshop._id}`}
                            className="btn btn-primary"
                            style={{
                              textDecoration: "none",
                              textAlign: "center",
                              padding: "8px 16px",
                            }}
                          >
                            Start Workshop
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* CERTIFICATES TAB - Future Scope */}
      {activeTab === "certificates" && (
        <div className="card" style={{ padding: "30px", textAlign: "center" }}>
          <h2>📜 Your Certificates</h2>
          <p style={{ color: "#999", marginBottom: "20px" }}>
            Complete workshops to earn certificates! 🎓
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "20px",
            }}
          >
            {enrolledWorkshops
              .filter((w) => (progress[w._id] || 0) === 100)
              .map((workshop) => (
                <div
                  key={workshop._id}
                  style={{
                    border: "2px solid #FFD700",
                    borderRadius: "8px",
                    padding: "20px",
                    textAlign: "center",
                    backgroundColor: "#fffef0",
                  }}
                >
                  <h3 style={{ margin: "0 0 10px 0" }}>{workshop.title}</h3>
                  <p style={{ color: "#666", marginBottom: "15px" }}>
                    Certificate of Completion
                  </p>
                  <button className="btn btn-primary" style={{ width: "100%" }}>
                    📥 Download Certificate
                  </button>
                </div>
              ))}
          </div>
          {enrolledWorkshops.filter((w) => (progress[w._id] || 0) === 100)
            .length === 0 && (
            <p style={{ color: "#999" }}>
              No certificates yet. Complete a workshop to earn one! ✨
            </p>
          )}
        </div>
      )}

      {/* Navigation Tabs */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        <button
          className={activeTab === "enrolled" ? "btn btn-primary" : "btn"}
          onClick={() => setActiveTab("enrolled")}
        >
          🎓 My Workshops ({enrolledWorkshops.length})
        </button>
        <button
          className={activeTab === "certificates" ? "btn btn-primary" : "btn"}
          onClick={() => setActiveTab("certificates")}
        >
          📜 Certificates (
          {
            enrolledWorkshops.filter((w) => (progress[w._id] || 0) === 100)
              .length
          }
          )
        </button>
      </div>
    </div>
  );
}

export default LearnerDashboard;
