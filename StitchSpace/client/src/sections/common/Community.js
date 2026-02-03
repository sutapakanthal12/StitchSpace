import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Community({ user }) {
  const [activeTab, setActiveTab] = useState("challenges");
  const [challenges, setChallenges] = useState([]);
  const [forums, setForums] = useState([]);
  const [participations, setParticipations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newChallengeForm, setNewChallengeForm] = useState({
    title: "",
    description: "",
    deadline: "",
    rules: "",
    prize: "",
  });
  const [newForumPost, setNewForumPost] = useState({
    title: "",
    content: "",
    category: "General Discussion",
  });

  useEffect(() => {
    fetchCommunityData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchCommunityData = async () => {
    try {
      setLoading(true);
      const [challengesRes, forumsRes] = await Promise.all([
        axios.get("/api/community/challenges"),
        axios.get("/api/community/forums"),
      ]);
      setChallenges(challengesRes.data);
      setForums(forumsRes.data);

      // Fetch user's participations if logged in
      if (user?.role === "artisan") {
        const partRes = await axios.get("/api/community/my-challenges", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setParticipations(partRes.data);
      }
    } catch (error) {
      console.error("Error fetching community data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChallenge = async () => {
    if (!user || user.role !== "artisan") {
      alert("Only artisans can create challenges!");
      return;
    }

    if (!newChallengeForm.title || !newChallengeForm.description) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "/api/community/challenges",
        newChallengeForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setChallenges([response.data, ...challenges]);
      setNewChallengeForm({
        title: "",
        description: "",
        deadline: "",
        rules: "",
        prize: "",
      });
      alert("Challenge created successfully!");
    } catch (error) {
      console.error("Error creating challenge:", error);
      alert("Failed to create challenge");
    }
  };

  const handleCreateForumPost = async () => {
    if (!user) {
      alert("Please log in to post");
      return;
    }

    if (!newForumPost.title || !newForumPost.content) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("/api/community/forums", newForumPost, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForums([response.data, ...forums]);
      setNewForumPost({
        title: "",
        content: "",
        category: "General Discussion",
      });
      alert("Forum post created successfully!");
    } catch (error) {
      console.error("Error creating forum post:", error);
      alert("Failed to create forum post");
    }
  };

  const handleJoinChallenge = async (challengeId) => {
    if (!user) {
      alert("Please log in to participate");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `/api/community/challenges/${challengeId}/join`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Successfully joined the challenge!");
      fetchCommunityData();
    } catch (error) {
      console.error("Error joining challenge:", error);
      alert("Failed to join challenge");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        Loading community...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h1>🌟 StitchSpace Community</h1>
      <p style={{ color: "#666", marginBottom: "30px" }}>
        Connect with artisans and learners, participate in challenges, and share
        your creations
      </p>

      {/* Tab Navigation */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        <button
          className={activeTab === "challenges" ? "btn btn-primary" : "btn"}
          onClick={() => setActiveTab("challenges")}
        >
          🏆 Challenges ({challenges.length})
        </button>
        <button
          className={activeTab === "forums" ? "btn btn-primary" : "btn"}
          onClick={() => setActiveTab("forums")}
        >
          💬 Discussion Forum ({forums.length})
        </button>
        <button
          className={
            activeTab === "myParticipations" ? "btn btn-primary" : "btn"
          }
          onClick={() => setActiveTab("myParticipations")}
        >
          🎨 My Participations ({participations.length})
        </button>
      </div>

      {/* CRAFT CHALLENGES TAB */}
      {activeTab === "challenges" && (
        <div>
          {/* Create Challenge - Artisans Only */}
          {user?.role === "artisan" && (
            <div
              className="card"
              style={{
                padding: "30px",
                marginBottom: "30px",
                backgroundColor: "#f9f9f9",
              }}
            >
              <h2>🏆 Create New Challenge</h2>
              <p style={{ color: "#666", marginBottom: "20px" }}>
                Inspire the community with a creative challenge!
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "15px",
                  marginBottom: "15px",
                }}
              >
                {/* Title */}
                <div>
                  <label
                    style={{
                      fontWeight: "bold",
                      display: "block",
                      marginBottom: "5px",
                    }}
                  >
                    Challenge Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Winter Color Palette Challenge"
                    value={newChallengeForm.title}
                    onChange={(e) =>
                      setNewChallengeForm({
                        ...newChallengeForm,
                        title: e.target.value,
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                {/* Deadline */}
                <div>
                  <label
                    style={{
                      fontWeight: "bold",
                      display: "block",
                      marginBottom: "5px",
                    }}
                  >
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={newChallengeForm.deadline}
                    onChange={(e) =>
                      setNewChallengeForm({
                        ...newChallengeForm,
                        deadline: e.target.value,
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    fontWeight: "bold",
                    display: "block",
                    marginBottom: "5px",
                  }}
                >
                  Description *
                </label>
                <textarea
                  placeholder="Describe the challenge, what participants should create..."
                  value={newChallengeForm.description}
                  onChange={(e) =>
                    setNewChallengeForm({
                      ...newChallengeForm,
                      description: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                    height: "100px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Rules */}
              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    fontWeight: "bold",
                    display: "block",
                    marginBottom: "5px",
                  }}
                >
                  Rules & Requirements
                </label>
                <textarea
                  placeholder="List any rules or specific requirements (e.g., must use sustainable materials)..."
                  value={newChallengeForm.rules}
                  onChange={(e) =>
                    setNewChallengeForm({
                      ...newChallengeForm,
                      rules: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                    height: "80px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Prize */}
              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    fontWeight: "bold",
                    display: "block",
                    marginBottom: "5px",
                  }}
                >
                  Prize / Recognition
                </label>
                <input
                  type="text"
                  placeholder="e.g., Featured on homepage, $500 prize, Certificate"
                  value={newChallengeForm.prize}
                  onChange={(e) =>
                    setNewChallengeForm({
                      ...newChallengeForm,
                      prize: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <button
                className="btn btn-primary"
                onClick={handleCreateChallenge}
                style={{ padding: "12px 30px", fontSize: "1em" }}
              >
                🚀 Launch Challenge
              </button>
            </div>
          )}

          {/* Challenges List */}
          <h2>🏆 Active Challenges</h2>
          {challenges.length === 0 ? (
            <p style={{ color: "#999" }}>
              No challenges yet. Check back soon! 🎨
            </p>
          ) : (
            <div style={{ display: "grid", gap: "20px" }}>
              {challenges.map((challenge) => (
                <div
                  key={challenge._id}
                  className="card"
                  style={{ padding: "20px" }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      gap: "20px",
                    }}
                  >
                    <div>
                      <h3 style={{ margin: "0 0 10px 0" }}>
                        🏆 {challenge.title}
                      </h3>
                      <p style={{ margin: "0 0 10px 0", color: "#666" }}>
                        {challenge.description}
                      </p>

                      <div
                        style={{
                          display: "flex",
                          gap: "15px",
                          marginBottom: "15px",
                          flexWrap: "wrap",
                          fontSize: "0.95em",
                        }}
                      >
                        <span>
                          👨‍🎨 By {challenge.creator?.name || "Unknown"}
                        </span>
                        <span>
                          ⏰ Deadline:{" "}
                          {new Date(challenge.deadline).toLocaleDateString()}
                        </span>
                        <span>
                          👥 {challenge.participants?.length || 0} participants
                        </span>
                      </div>

                      {challenge.rules && (
                        <div
                          style={{
                            backgroundColor: "#f5f5f5",
                            padding: "10px",
                            borderRadius: "4px",
                            marginBottom: "10px",
                          }}
                        >
                          <strong>📋 Rules:</strong> {challenge.rules}
                        </div>
                      )}

                      {challenge.prize && (
                        <div
                          style={{
                            backgroundColor: "#fff8e1",
                            padding: "10px",
                            borderRadius: "4px",
                          }}
                        >
                          <strong>🎁 Prize:</strong> {challenge.prize}
                        </div>
                      )}
                    </div>

                    <div style={{ minWidth: "150px", textAlign: "center" }}>
                      {participations.some((p) => p._id === challenge._id) ? (
                        <div
                          style={{
                            color: "var(--primary-color)",
                            fontWeight: "bold",
                          }}
                        >
                          ✅ You're Participating
                        </div>
                      ) : (
                        <button
                          className="btn btn-primary"
                          onClick={() => handleJoinChallenge(challenge._id)}
                          style={{ width: "100%", padding: "10px" }}
                        >
                          🎨 Join Challenge
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* DISCUSSION FORUM TAB */}
      {activeTab === "forums" && (
        <div>
          {/* Create Forum Post */}
          {user && (
            <div
              className="card"
              style={{
                padding: "30px",
                marginBottom: "30px",
                backgroundColor: "#f9f9f9",
              }}
            >
              <h2>💬 Start a Discussion</h2>

              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    fontWeight: "bold",
                    display: "block",
                    marginBottom: "5px",
                  }}
                >
                  Category
                </label>
                <select
                  value={newForumPost.category}
                  onChange={(e) =>
                    setNewForumPost({
                      ...newForumPost,
                      category: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                    boxSizing: "border-box",
                  }}
                >
                  <option>General Discussion</option>
                  <option>Techniques & Tips</option>
                  <option>Materials & Suppliers</option>
                  <option>Business & Selling</option>
                  <option>Sustainability</option>
                  <option>Feedback & Reviews</option>
                </select>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    fontWeight: "bold",
                    display: "block",
                    marginBottom: "5px",
                  }}
                >
                  Topic Title *
                </label>
                <input
                  type="text"
                  placeholder="What would you like to discuss?"
                  value={newForumPost.title}
                  onChange={(e) =>
                    setNewForumPost({ ...newForumPost, title: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    fontWeight: "bold",
                    display: "block",
                    marginBottom: "5px",
                  }}
                >
                  Message *
                </label>
                <textarea
                  placeholder="Share your thoughts, questions, or experiences..."
                  value={newForumPost.content}
                  onChange={(e) =>
                    setNewForumPost({
                      ...newForumPost,
                      content: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                    height: "120px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <button
                className="btn btn-primary"
                onClick={handleCreateForumPost}
                style={{ padding: "10px 20px" }}
              >
                📤 Post Discussion
              </button>
            </div>
          )}

          {!user && (
            <div
              className="card"
              style={{
                padding: "20px",
                backgroundColor: "#f5f5f5",
                marginBottom: "30px",
              }}
            >
              <p style={{ color: "#666", marginBottom: "10px" }}>
                Please{" "}
                <Link to="/auth" style={{ color: "var(--primary-color)" }}>
                  log in
                </Link>{" "}
                to participate in discussions
              </p>
            </div>
          )}

          {/* Forum Posts List */}
          <h2>💬 Recent Discussions</h2>
          {forums.length === 0 ? (
            <p style={{ color: "#999" }}>
              No discussions yet. Be the first to start one! 💭
            </p>
          ) : (
            <div style={{ display: "grid", gap: "15px" }}>
              {forums.map((post) => (
                <div
                  key={post._id}
                  className="card"
                  style={{
                    padding: "20px",
                    borderLeft: "4px solid var(--primary-color)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                      marginBottom: "10px",
                    }}
                  >
                    <div>
                      <h3 style={{ margin: "0 0 5px 0" }}>{post.title}</h3>
                      <p
                        style={{
                          margin: "0",
                          color: "#666",
                          fontSize: "0.9em",
                        }}
                      >
                        by <strong>{post.author?.name || "Anonymous"}</strong> •{" "}
                        {post.category} •{" "}
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      style={{
                        backgroundColor: "var(--primary-color)",
                        color: "white",
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "0.85em",
                        fontWeight: "bold",
                      }}
                    >
                      {post.replies?.length || 0} replies
                    </span>
                  </div>

                  <p
                    style={{
                      margin: "15px 0",
                      color: "#555",
                      lineHeight: "1.6",
                    }}
                  >
                    {post.content.substring(0, 200)}
                    {post.content.length > 200 ? "..." : ""}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      gap: "15px",
                      alignItems: "center",
                    }}
                  >
                    <button
                      className="btn"
                      style={{ padding: "6px 12px", fontSize: "0.9em" }}
                    >
                      👍 Like ({post.likes || 0})
                    </button>
                    <button
                      className="btn"
                      style={{ padding: "6px 12px", fontSize: "0.9em" }}
                    >
                      💬 Reply
                    </button>
                    <button
                      className="btn"
                      style={{ padding: "6px 12px", fontSize: "0.9em" }}
                    >
                      📤 Share
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MY PARTICIPATIONS TAB */}
      {activeTab === "myParticipations" && (
        <div>
          {user?.role === "artisan" ? (
            participations.length === 0 ? (
              <div
                className="card"
                style={{ padding: "40px", textAlign: "center" }}
              >
                <p
                  style={{
                    fontSize: "1.1em",
                    color: "#666",
                    marginBottom: "20px",
                  }}
                >
                  You haven't joined any challenges yet. 🎨
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => setActiveTab("challenges")}
                >
                  Browse Challenges
                </button>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "20px" }}>
                {participations.map((challenge) => (
                  <div
                    key={challenge._id}
                    className="card"
                    style={{ padding: "20px" }}
                  >
                    <h3 style={{ margin: "0 0 10px 0" }}>
                      🎨 {challenge.title}
                    </h3>
                    <p style={{ margin: "0 0 15px 0", color: "#666" }}>
                      ⏰ Deadline:{" "}
                      {new Date(challenge.deadline).toLocaleDateString()}
                    </p>
                    <p style={{ color: "#666", marginBottom: "15px" }}>
                      {challenge.description}
                    </p>

                    <button
                      className="btn btn-primary"
                      style={{ padding: "10px 20px" }}
                    >
                      📤 Submit Your Creation
                    </button>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div
              className="card"
              style={{ padding: "40px", textAlign: "center" }}
            >
              <p style={{ fontSize: "1.1em", color: "#666" }}>
                Only artisans can participate in challenges. 🎨
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Community;
