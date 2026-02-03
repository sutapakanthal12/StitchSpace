import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function LearningInterface({ user }) {
  const { id } = useParams();
  const [workshop, setWorkshop] = useState(null);
  const [notes, setNotes] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("video");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLearningData();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchLearningData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/workshops/${id}`);
      setWorkshop(response.data);

      // Fetch user's notes and progress
      const token = localStorage.getItem("token");
      const progressRes = await axios.get(`/api/workshops/${id}/progress`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProgress(progressRes.data.progress || 0);
      setNotes(progressRes.data.notes || "");

      // Fetch comments/Q&A
      const commentsRes = await axios.get(`/api/workshops/${id}/comments`);
      setComments(commentsRes.data || []);
    } catch (error) {
      console.error("Error fetching learning data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/workshops/${id}/notes`,
        { notes },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Notes saved successfully!");
    } catch (error) {
      console.error("Error saving notes:", error);
    }
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `/api/workshops/${id}/comments`,
        { comment: newComment },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComments([...comments, response.data]);
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleUpdateProgress = async (newProgress) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/workshops/${id}/progress`,
        { progress: newProgress },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProgress(newProgress);
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        Loading learning interface...
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
    <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px" }}>
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <Link
          to={`/workshop/${workshop._id}`}
          style={{ color: "var(--primary-color)", textDecoration: "none" }}
        >
          ← Back to Workshop
        </Link>
        <h1 style={{ margin: "10px 0 5px 0" }}>📚 {workshop.title}</h1>
        <p style={{ color: "#666", margin: "0" }}>
          Learning Progress: <strong>{progress}%</strong>
        </p>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          marginBottom: "30px",
          backgroundColor: "#f5f5f5",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <span style={{ fontWeight: "bold" }}>Overall Progress</span>
          <span>{progress}%</span>
        </div>
        <div
          style={{
            width: "100%",
            height: "30px",
            backgroundColor: "#eee",
            borderRadius: "15px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              backgroundColor: "var(--primary-color)",
              transition: "width 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: "0.9em",
            }}
          >
            {progress > 10 && `${progress}%`}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gap: "30px",
        }}
      >
        {/* MAIN LEARNING AREA */}
        <div>
          {/* Tab Navigation */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "20px",
              borderBottom: "2px solid #eee",
            }}
          >
            <button
              className={activeTab === "video" ? "btn btn-primary" : "btn"}
              onClick={() => setActiveTab("video")}
              style={{
                borderBottom:
                  activeTab === "video"
                    ? "3px solid var(--primary-color)"
                    : "none",
              }}
            >
              🎥 Video Player
            </button>
            <button
              className={activeTab === "notes" ? "btn btn-primary" : "btn"}
              onClick={() => setActiveTab("notes")}
              style={{
                borderBottom:
                  activeTab === "notes"
                    ? "3px solid var(--primary-color)"
                    : "none",
              }}
            >
              📝 Notes
            </button>
            <button
              className={activeTab === "qa" ? "btn btn-primary" : "btn"}
              onClick={() => setActiveTab("qa")}
              style={{
                borderBottom:
                  activeTab === "qa"
                    ? "3px solid var(--primary-color)"
                    : "none",
              }}
            >
              💬 Q&A ({comments.length})
            </button>
          </div>

          {/* VIDEO PLAYER TAB - Per PDF Spec */}
          {activeTab === "video" && (
            <div className="card" style={{ padding: "20px" }}>
              <h2>🎥 Video Lessons</h2>

              {workshop.videoUrl ? (
                <div style={{ marginBottom: "30px" }}>
                  <iframe
                    width="100%"
                    height="500"
                    src={workshop.videoUrl}
                    title={workshop.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ borderRadius: "8px", marginBottom: "20px" }}
                  />
                  <p style={{ color: "#666", marginBottom: "20px" }}>
                    {workshop.description}
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    backgroundColor: "#f5f5f5",
                    padding: "40px",
                    textAlign: "center",
                    borderRadius: "8px",
                    marginBottom: "30px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "1.1em",
                      color: "#666",
                      marginBottom: "15px",
                    }}
                  >
                    🔴 Live Workshop Session
                  </p>
                  <p style={{ color: "#999", marginBottom: "20px" }}>
                    This is a live workshop. The video player will appear when
                    the session starts.
                  </p>
                  <p style={{ color: "#999" }}>
                    <strong>Start Date:</strong>{" "}
                    {workshop.startDate
                      ? new Date(workshop.startDate).toLocaleString()
                      : "TBA"}
                  </p>
                </div>
              )}

              {/* Lesson Description */}
              <div
                style={{
                  backgroundColor: "#f9f9f9",
                  padding: "15px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                }}
              >
                <h3 style={{ margin: "0 0 10px 0" }}>📖 Lesson Overview</h3>
                <p style={{ margin: "0", color: "#666" }}>
                  {workshop.description}
                </p>
              </div>

              {/* Update Progress */}
              <div style={{ marginTop: "20px" }}>
                <label
                  style={{
                    fontWeight: "bold",
                    display: "block",
                    marginBottom: "10px",
                  }}
                >
                  Mark Progress
                </label>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {[25, 50, 75, 100].map((p) => (
                    <button
                      key={p}
                      className={progress >= p ? "btn btn-primary" : "btn"}
                      onClick={() => handleUpdateProgress(p)}
                      style={{ padding: "8px 16px" }}
                    >
                      {p}%
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* NOTES TAB - Per PDF Spec */}
          {activeTab === "notes" && (
            <div className="card" style={{ padding: "20px" }}>
              <h2>📝 My Notes</h2>
              <p style={{ color: "#666", marginBottom: "15px" }}>
                Take notes while learning. Your notes are automatically saved to
                your profile.
              </p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write your notes here... 📓"
                style={{
                  width: "100%",
                  height: "400px",
                  padding: "15px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  fontSize: "1em",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                  marginBottom: "15px",
                }}
              />
              <button
                className="btn btn-primary"
                onClick={handleSaveNotes}
                style={{ padding: "10px 20px" }}
              >
                💾 Save Notes
              </button>
            </div>
          )}

          {/* Q&A / COMMENTS TAB - Per PDF Spec */}
          {activeTab === "qa" && (
            <div className="card" style={{ padding: "20px" }}>
              <h2>💬 Q&A & Discussion</h2>
              <p style={{ color: "#666", marginBottom: "20px" }}>
                Ask questions and discuss with other learners and the artisan
                instructor
              </p>

              {/* Post New Comment */}
              <div
                style={{
                  backgroundColor: "#f9f9f9",
                  padding: "15px",
                  borderRadius: "8px",
                  marginBottom: "30px",
                }}
              >
                <label
                  style={{
                    fontWeight: "bold",
                    display: "block",
                    marginBottom: "10px",
                  }}
                >
                  Ask a Question or Share
                </label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Type your question or comment..."
                  style={{
                    width: "100%",
                    height: "100px",
                    padding: "10px",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                    boxSizing: "border-box",
                    marginBottom: "10px",
                    fontFamily: "inherit",
                  }}
                />
                <button
                  className="btn btn-primary"
                  onClick={handlePostComment}
                  style={{ padding: "8px 16px" }}
                >
                  📤 Post Comment
                </button>
              </div>

              {/* Comments List */}
              <div>
                <h3>Comments ({comments.length})</h3>
                {comments.length === 0 ? (
                  <p style={{ color: "#999" }}>
                    No comments yet. Be the first to ask a question! 🚀
                  </p>
                ) : (
                  <div style={{ display: "grid", gap: "15px" }}>
                    {comments.map((comment, idx) => (
                      <div
                        key={idx}
                        style={{
                          borderLeft: "3px solid var(--primary-color)",
                          paddingLeft: "15px",
                          borderBottom: "1px solid #eee",
                          paddingBottom: "15px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "5px",
                          }}
                        >
                          <strong>{comment.userName || "Anonymous"}</strong>
                          <span style={{ color: "#999", fontSize: "0.9em" }}>
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p style={{ margin: "5px 0", color: "#666" }}>
                          {comment.comment}
                        </p>
                        {comment.isArtisan && (
                          <span
                            style={{
                              backgroundColor: "var(--primary-color)",
                              color: "white",
                              padding: "2px 8px",
                              borderRadius: "4px",
                              fontSize: "0.8em",
                            }}
                          >
                            👨‍🏫 Instructor
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <div>
          {/* Workshop Info Card */}
          <div
            className="card"
            style={{
              padding: "20px",
              marginBottom: "20px",
              position: "sticky",
              top: "20px",
            }}
          >
            <h3 style={{ margin: "0 0 15px 0" }}>📚 Workshop Info</h3>

            <div style={{ marginBottom: "15px" }}>
              <p
                style={{
                  fontSize: "0.9em",
                  color: "#666",
                  margin: "0 0 5px 0",
                }}
              >
                <strong>👨‍🏫 Instructor</strong>
              </p>
              <p style={{ margin: "0 0 10px 0" }}>
                <Link
                  to={`/artisan-profile/${workshop.artisan?._id}`}
                  style={{
                    color: "var(--primary-color)",
                    textDecoration: "none",
                  }}
                >
                  {workshop.artisan?.name || "Unknown"}
                </Link>
              </p>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <p
                style={{
                  fontSize: "0.9em",
                  color: "#666",
                  margin: "0 0 5px 0",
                }}
              >
                <strong>📚 Level</strong>
              </p>
              <p style={{ margin: "0 0 10px 0" }}>{workshop.level}</p>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <p
                style={{
                  fontSize: "0.9em",
                  color: "#666",
                  margin: "0 0 5px 0",
                }}
              >
                <strong>⏱️ Duration</strong>
              </p>
              <p style={{ margin: "0 0 10px 0" }}>{workshop.duration}</p>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <p
                style={{
                  fontSize: "0.9em",
                  color: "#666",
                  margin: "0 0 5px 0",
                }}
              >
                <strong>🎯 Learning Outcomes</strong>
              </p>
              {workshop.learningOutcomes &&
              workshop.learningOutcomes.length > 0 ? (
                <ul
                  style={{
                    margin: "0",
                    paddingLeft: "20px",
                    fontSize: "0.9em",
                  }}
                >
                  {workshop.learningOutcomes.slice(0, 3).map((outcome, idx) => (
                    <li key={idx}>{outcome}</li>
                  ))}
                </ul>
              ) : (
                <p style={{ margin: "0", color: "#999", fontSize: "0.9em" }}>
                  None listed
                </p>
              )}
            </div>

            {/* Download Resources */}
            <button
              className="btn"
              style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            >
              📥 Download Materials
            </button>

            <button className="btn" style={{ width: "100%", padding: "10px" }}>
              🔖 Bookmark Workshop
            </button>
          </div>

          {/* Completion Tips */}
          <div
            className="card"
            style={{
              padding: "20px",
              backgroundColor: "#fffef0",
              borderLeft: "4px solid #FFD700",
            }}
          >
            <h3 style={{ margin: "0 0 10px 0" }}>💡 Tips for Success</h3>
            <ul
              style={{
                margin: "0",
                paddingLeft: "20px",
                fontSize: "0.9em",
                color: "#666",
              }}
            >
              <li>📝 Take detailed notes</li>
              <li>❓ Ask questions in Q&A</li>
              <li>🔄 Review materials regularly</li>
              <li>💪 Practice the techniques</li>
              <li>⏰ Set a learning schedule</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LearningInterface;
