import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Community({ user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState({ content: "", type: "story" });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("/api/community");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostSubmit = async () => {
    if (!user) {
      alert("Please login to post");
      return;
    }

    try {
      await axios.post("/api/community", newPost, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setNewPost({ content: "", type: "story" });
      fetchPosts();
    } catch (error) {
      alert("Error creating post");
    }
  };

  if (loading) return <div className="loading">Loading community...</div>;

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <h1 className="section-title">Community</h1>

      {user && (
        <div className="card" style={{ padding: "20px", marginBottom: "30px" }}>
          <h3>Share Your Story</h3>
          <textarea
            placeholder="What's on your mind?"
            value={newPost.content}
            onChange={(e) =>
              setNewPost({ ...newPost, content: e.target.value })
            }
            style={{
              width: "100%",
              minHeight: "100px",
              padding: "10px",
              marginBottom: "10px",
            }}
          />
          <select
            value={newPost.type}
            onChange={(e) => setNewPost({ ...newPost, type: e.target.value })}
            style={{
              padding: "8px",
              marginRight: "10px",
              marginBottom: "10px",
            }}
          >
            <option value="story">Story</option>
            <option value="challenge">Challenge</option>
            <option value="question">Question</option>
            <option value="artwork">Artwork</option>
          </select>
          <button className="btn btn-primary" onClick={handlePostSubmit}>
            Post
          </button>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {posts.map((post) => (
          <div key={post._id} className="card" style={{ padding: "20px" }}>
            <h3>{post.title}</h3>
            <p style={{ color: "var(--primary-color)" }}>{post.author?.name}</p>
            <p>{post.content}</p>
            <div
              style={{
                display: "flex",
                gap: "20px",
                marginTop: "10px",
                color: "#999",
              }}
            >
              <span>❤️ {post.likes?.length || 0}</span>
              <span>💬 {post.comments?.length || 0}</span>
              <span>👁️ {post.viewCount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Community;
