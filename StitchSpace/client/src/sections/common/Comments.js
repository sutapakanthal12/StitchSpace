import React, { useState, useEffect } from "react";
import axios from "axios";

function Comments({ contentId, contentType = "workshop" }) {
  // contentType can be 'workshop', 'product', 'challenge'
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    fetchUserAndComments();
  }, [contentId, contentType]);

  const fetchUserAndComments = async () => {
    try {
      // Get current user
      const token = localStorage.getItem("token");
      if (token) {
        const userRes = await axios.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data);
      }

      // Get comments
      const commentsRes = await axios.get(
        `/api/community/comments/${contentType}/${contentId}`
      );
      setComments(commentsRes.data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleAddComment = async () => {
    if (!user) {
      alert("Please log in to comment");
      return;
    }

    if (!newComment.trim()) {
      alert("Please write a comment");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `/api/community/comments/${contentType}/${contentId}`,
        {
          text: newComment,
          contentType,
          contentId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setComments([response.data, ...comments]);
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("Failed to post comment");
    } finally {
      setLoading(false);
    }
  };

  const handleAddReply = async (commentId) => {
    if (!user) {
      alert("Please log in to reply");
      return;
    }

    if (!replyText.trim()) {
      alert("Please write a reply");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `/api/community/comments/${commentId}/reply`,
        { text: replyText },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedComments = comments.map((comment) =>
        comment._id === commentId
          ? { ...comment, replies: [...(comment.replies || []), response.data] }
          : comment
      );
      setComments(updatedComments);
      setReplyingTo(null);
      setReplyText("");
    } catch (error) {
      console.error("Error posting reply:", error);
      alert("Failed to post reply");
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!user) {
      alert("Please log in to like");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `/api/community/comments/${commentId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedComments = comments.map((comment) =>
        comment._id === commentId ? response.data : comment
      );
      setComments(updatedComments);
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "20px 0" }}>
      <h3
        style={{
          borderBottom: "2px solid var(--primary-color)",
          paddingBottom: "10px",
        }}
      >
        💬 Comments & Discussion
      </h3>

      {/* Add Comment Section */}
      {user ? (
        <div
          style={{
            backgroundColor: "#f9f9f9",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <p style={{ margin: "0 0 10px 0", fontWeight: "bold" }}>
            👤 {user.name}
          </p>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts, tips, or questions..."
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "4px",
              border: "1px solid #ddd",
              height: "100px",
              boxSizing: "border-box",
              fontFamily: "inherit",
              marginBottom: "10px",
            }}
          />
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              className="btn btn-primary"
              onClick={handleAddComment}
              disabled={loading}
              style={{ padding: "8px 20px" }}
            >
              {loading ? "Posting..." : "📤 Post Comment"}
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: "#f5f5f5",
            padding: "15px",
            borderRadius: "4px",
            marginBottom: "20px",
          }}
        >
          <p style={{ margin: "0", color: "#666" }}>
            Please log in to post comments. 👤
          </p>
        </div>
      )}

      {/* Comments List */}
      {comments.length === 0 ? (
        <p style={{ color: "#999", textAlign: "center", padding: "20px" }}>
          No comments yet. Be the first! 💭
        </p>
      ) : (
        <div style={{ display: "grid", gap: "15px" }}>
          {comments.map((comment) => (
            <div
              key={comment._id}
              style={{
                backgroundColor: "#f9f9f9",
                padding: "15px",
                borderRadius: "6px",
                borderLeft: "3px solid var(--primary-color)",
              }}
            >
              {/* Main Comment */}
              <div style={{ marginBottom: "10px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <strong>{comment.author?.name || "Anonymous"}</strong>
                  {comment.author?.role === "artisan" && (
                    <span
                      style={{
                        marginLeft: "8px",
                        backgroundColor: "var(--primary-color)",
                        color: "white",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        fontSize: "0.75em",
                        fontWeight: "bold",
                      }}
                    >
                      👨‍🎨 Artisan
                    </span>
                  )}
                  <span
                    style={{
                      marginLeft: "auto",
                      color: "#999",
                      fontSize: "0.85em",
                    }}
                  >
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p
                  style={{ margin: "8px 0", color: "#333", lineHeight: "1.5" }}
                >
                  {comment.text}
                </p>

                {/* Like and Reply Buttons */}
                <div
                  style={{ display: "flex", gap: "15px", fontSize: "0.9em" }}
                >
                  <button
                    className="btn"
                    onClick={() => handleLikeComment(comment._id)}
                    style={{
                      padding: "4px 8px",
                      cursor: "pointer",
                      backgroundColor: "transparent",
                      border: "none",
                      color: comment.likes?.includes(user?._id)
                        ? "var(--primary-color)"
                        : "#999",
                      fontWeight: "bold",
                    }}
                  >
                    👍 {comment.likes?.length || 0}
                  </button>
                  <button
                    className="btn"
                    onClick={() =>
                      setReplyingTo(
                        replyingTo === comment._id ? null : comment._id
                      )
                    }
                    style={{
                      padding: "4px 8px",
                      cursor: "pointer",
                      backgroundColor: "transparent",
                      border: "none",
                      color: "#666",
                    }}
                  >
                    💬 Reply
                  </button>
                </div>
              </div>

              {/* Reply Form */}
              {replyingTo === comment._id && user && (
                <div
                  style={{
                    marginTop: "10px",
                    paddingTop: "10px",
                    borderTop: "1px solid #ddd",
                  }}
                >
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                      height: "70px",
                      boxSizing: "border-box",
                      marginBottom: "8px",
                    }}
                  />
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleAddReply(comment._id)}
                      style={{ padding: "6px 15px", fontSize: "0.9em" }}
                    >
                      Reply
                    </button>
                    <button
                      className="btn"
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyText("");
                      }}
                      style={{ padding: "6px 15px", fontSize: "0.9em" }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div
                  style={{
                    marginTop: "15px",
                    paddingLeft: "15px",
                    borderLeft: "2px solid #ddd",
                  }}
                >
                  {comment.replies.map((reply) => (
                    <div
                      key={reply._id}
                      style={{
                        backgroundColor: "white",
                        padding: "10px",
                        borderRadius: "4px",
                        marginBottom: "8px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <strong style={{ fontSize: "0.9em" }}>
                          {reply.author?.name || "Anonymous"}
                        </strong>
                        {reply.author?.role === "artisan" && (
                          <span
                            style={{
                              marginLeft: "8px",
                              backgroundColor: "var(--primary-color)",
                              color: "white",
                              padding: "2px 6px",
                              borderRadius: "10px",
                              fontSize: "0.7em",
                              fontWeight: "bold",
                            }}
                          >
                            👨‍🎨
                          </span>
                        )}
                        <span
                          style={{
                            marginLeft: "auto",
                            color: "#999",
                            fontSize: "0.8em",
                          }}
                        >
                          {new Date(reply.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p
                        style={{
                          margin: "5px 0",
                          color: "#333",
                          fontSize: "0.9em",
                          lineHeight: "1.4",
                        }}
                      >
                        {reply.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Comments;
