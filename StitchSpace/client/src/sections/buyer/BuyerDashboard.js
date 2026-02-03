import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function BuyerDashboard({ user, setUser }) {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [wishlist, setWishlist] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [savedArtisans, setSavedArtisans] = useState([]);
  const [profile, setProfile] = useState(user);
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    if (user?.role === "buyer") {
      fetchBuyerData();
    }
  }, [user]);

  const fetchBuyerData = async () => {
    try {
      const token = localStorage.getItem("token");

      // Fetch orders
      const ordersRes = await axios.get("/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(ordersRes.data || []);

      // Fetch user profile
      const userRes = await axios.get("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(userRes.data);
      setAddresses(userRes.data.addresses || []);
    } catch (error) {
      console.error("Error fetching buyer data:", error);
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h1>👤 My Buyer Dashboard</h1>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        <button
          className={activeTab === "orders" ? "btn btn-primary" : "btn"}
          onClick={() => setActiveTab("orders")}
        >
          📦 My Orders ({orders.length})
        </button>
        <button
          className={activeTab === "wishlist" ? "btn btn-primary" : "btn"}
          onClick={() => setActiveTab("wishlist")}
        >
          ❤️ Wishlist ({wishlist.length})
        </button>
        <button
          className={activeTab === "artisans" ? "btn btn-primary" : "btn"}
          onClick={() => setActiveTab("artisans")}
        >
          🎨 Saved Artisans ({savedArtisans.length})
        </button>
        <button
          className={activeTab === "addresses" ? "btn btn-primary" : "btn"}
          onClick={() => setActiveTab("addresses")}
        >
          📍 Addresses ({addresses.length})
        </button>
        <button
          className={activeTab === "profile" ? "btn btn-primary" : "btn"}
          onClick={() => setActiveTab("profile")}
        >
          👤 Profile
        </button>
      </div>

      {/* My Orders Tab */}
      {activeTab === "orders" && (
        <div>
          <h2>My Orders</h2>
          {orders.length === 0 ? (
            <p>
              No orders yet. <Link to="/marketplace">Start shopping!</Link> 🛍️
            </p>
          ) : (
            <div style={{ display: "grid", gap: "15px" }}>
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="card"
                  style={{ padding: "20px" }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      gap: "20px",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <h3>Order #{order._id.slice(-6)}</h3>
                      <p>
                        <strong>Items:</strong> {order.items?.length || 0}
                      </p>
                      <p>
                        <strong>Total:</strong> ${order.totalAmount}
                      </p>
                      <p style={{ color: "#999" }}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span
                        className="btn"
                        style={{
                          backgroundColor:
                            order.status === "Delivered"
                              ? "#4CAF50"
                              : "#FF9800",
                          color: "white",
                          padding: "8px 16px",
                          borderRadius: "4px",
                        }}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Wishlist Tab */}
      {activeTab === "wishlist" && (
        <div>
          <h2>My Wishlist</h2>
          <p>Wishlist feature coming soon! ❤️</p>
        </div>
      )}

      {/* Saved Artisans Tab */}
      {activeTab === "artisans" && (
        <div>
          <h2>Saved Artisans</h2>
          <p>Follow your favorite artisans here! 🎨</p>
        </div>
      )}

      {/* Addresses Tab */}
      {activeTab === "addresses" && (
        <div>
          <h2>Saved Addresses</h2>
          {addresses.length === 0 ? (
            <p>
              No saved addresses yet. Add your first address during checkout! 📍
            </p>
          ) : (
            <div style={{ display: "grid", gap: "15px" }}>
              {addresses.map((addr, idx) => (
                <div key={idx} className="card" style={{ padding: "20px" }}>
                  <h3>{addr.fullName}</h3>
                  <p>{addr.address}</p>
                  <p>
                    {addr.city}, {addr.state} {addr.zipCode}
                  </p>
                  <p>{addr.country}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="card" style={{ padding: "30px", maxWidth: "600px" }}>
          <h2>My Profile</h2>
          <div style={{ marginBottom: "20px" }}>
            <label>
              <strong>Name:</strong>
            </label>
            <p>{profile?.name}</p>
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label>
              <strong>Email:</strong>
            </label>
            <p>{profile?.email}</p>
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label>
              <strong>Location:</strong>
            </label>
            <p>{profile?.location || "Not set"}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default BuyerDashboard;
