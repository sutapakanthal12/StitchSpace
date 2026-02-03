import React, { useState, useEffect } from "react";
import axios from "axios";

function SocialShare({ contentId, contentType = "workshop", title = "" }) {
  // contentType: 'workshop', 'product', 'challenge'
  const [likes, setLikes] = useState(0);
  const [shares, setShares] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserAndEngagement();
  }, [contentId, contentType]);

  const fetchUserAndEngagement = async () => {
    try {
      // Get current user
      const token = localStorage.getItem("token");
      if (token) {
        const userRes = await axios.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data);
      }

      // Get engagement stats
      const engagementRes = await axios.get(
        `/api/community/engagement/${contentType}/${contentId}`
      );
      setLikes(engagementRes.data?.likes || 0);
      setShares(engagementRes.data?.shares || 0);
      setIsLiked(engagementRes.data?.isLiked || false);
    } catch (error) {
      console.error("Error fetching engagement:", error);
    }
  };

  const handleLike = async () => {
    if (!user) {
      alert("Please log in to like");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `/api/community/engagement/${contentType}/${contentId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setLikes(response.data.likes);
      setIsLiked(response.data.isLiked);
    } catch (error) {
      console.error("Error liking:", error);
      alert("Failed to like");
    }
  };

  const handleShare = async (platform = "copy") => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await axios.post(
          `/api/community/engagement/${contentType}/${contentId}/share`,
          { platform },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      const baseUrl = window.location.origin;
      const shareUrl = `${baseUrl}/${contentType}/${contentId}`;
      const shareText = `Check out this amazing ${contentType}: "${title}" on StitchSpace! 🎨`;

      if (platform === "copy") {
        navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard!");
      } else if (platform === "facebook") {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            shareUrl
          )}`,
          "_blank",
          "width=600,height=400"
        );
      } else if (platform === "twitter") {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            shareText
          )}&url=${encodeURIComponent(shareUrl)}`,
          "_blank",
          "width=600,height=400"
        );
      } else if (platform === "pinterest") {
        window.open(
          `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
            shareUrl
          )}&description=${encodeURIComponent(shareText)}`,
          "_blank",
          "width=600,height=400"
        );
      }

      const newShares = shares + 1;
      setShares(newShares);
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        alignItems: "center",
        padding: "15px",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {/* Like Button */}
      <button
        onClick={handleLike}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 16px",
          borderRadius: "6px",
          border: isLiked ? `2px solid var(--primary-color)` : `1px solid #ddd`,
          backgroundColor: isLiked ? "rgba(var(--primary-rgb), 0.1)" : "white",
          cursor: "pointer",
          fontWeight: "bold",
          color: isLiked ? "var(--primary-color)" : "#333",
          transition: "all 0.2s ease",
          fontSize: "0.95em",
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = isLiked
            ? "rgba(var(--primary-rgb), 0.15)"
            : "#f0f0f0";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = isLiked
            ? "rgba(var(--primary-rgb), 0.1)"
            : "white";
        }}
      >
        <span style={{ fontSize: "1.3em" }}>👍</span>
        <span>{likes}</span>
      </button>

      {/* Share Dropdown */}
      <div style={{ position: "relative", display: "inline-block" }}>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 16px",
            borderRadius: "6px",
            border: "1px solid #ddd",
            backgroundColor: "white",
            cursor: "pointer",
            fontWeight: "bold",
            color: "#333",
            transition: "all 0.2s ease",
            fontSize: "0.95em",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#f0f0f0";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "white";
          }}
        >
          <span style={{ fontSize: "1.3em" }}>📤</span>
          <span>Share</span>
        </button>

        {/* Share Menu - Hover/Click */}
        <div
          className="share-menu"
          style={{
            position: "absolute",
            top: "100%",
            right: "0",
            backgroundColor: "white",
            border: "1px solid #ddd",
            borderRadius: "6px",
            marginTop: "4px",
            minWidth: "150px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            zIndex: "10",
            display: "none",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.display = "block";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.display = "none";
          }}
        >
          <button
            onClick={() => handleShare("copy")}
            style={{
              display: "block",
              width: "100%",
              padding: "12px 16px",
              textAlign: "left",
              border: "none",
              backgroundColor: "transparent",
              cursor: "pointer",
              fontSize: "0.9em",
              color: "#333",
              borderBottom: "1px solid #eee",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#f5f5f5";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
            }}
          >
            📋 Copy Link
          </button>
          <button
            onClick={() => handleShare("facebook")}
            style={{
              display: "block",
              width: "100%",
              padding: "12px 16px",
              textAlign: "left",
              border: "none",
              backgroundColor: "transparent",
              cursor: "pointer",
              fontSize: "0.9em",
              color: "#333",
              borderBottom: "1px solid #eee",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#f5f5f5";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
            }}
          >
            f Facebook
          </button>
          <button
            onClick={() => handleShare("twitter")}
            style={{
              display: "block",
              width: "100%",
              padding: "12px 16px",
              textAlign: "left",
              border: "none",
              backgroundColor: "transparent",
              cursor: "pointer",
              fontSize: "0.9em",
              color: "#333",
              borderBottom: "1px solid #eee",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#f5f5f5";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
            }}
          >
            𝕏 Twitter
          </button>
          <button
            onClick={() => handleShare("pinterest")}
            style={{
              display: "block",
              width: "100%",
              padding: "12px 16px",
              textAlign: "left",
              border: "none",
              backgroundColor: "transparent",
              cursor: "pointer",
              fontSize: "0.9em",
              color: "#333",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#f5f5f5";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
            }}
          >
            📌 Pinterest
          </button>
        </div>
      </div>

      {/* Shares Count */}
      <span
        style={{
          fontSize: "0.9em",
          color: "#999",
          padding: "10px 12px",
          backgroundColor: "#f5f5f5",
          borderRadius: "6px",
        }}
      >
        📊 {shares} shares
      </span>
    </div>
  );
}

export default SocialShare;
