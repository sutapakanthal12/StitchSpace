import React, { useState, useEffect } from "react";
import axios from "axios";

function BuyerOrders({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || user.role !== "buyer") {
      return;
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data || []);
      setError("");
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(error.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // ============ STATUS BADGE COLORS ============
  const getStatusColor = (status) => {
    const colors = {
      Placed: "#ffc107",
      Confirmed: "#2196f3",
      Shipped: "#9c27b0",
      Delivered: "#4caf50",
      Cancelled: "#f44336",
      Pending: "#ff9800",
      Paid: "#4caf50",
      Failed: "#f44336",
    };
    return colors[status] || "#999";
  };

  if (!user || user.role !== "buyer") {
    return (
      <div style={{ textAlign: "center", padding: "50px", color: "red" }}>
        <h2>❌ Access Denied</h2>
        <p>Only buyers can view orders.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <p style={{ fontSize: "1.2em" }}>⏳ Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "50px", color: "red" }}>
        <h2>❌ Error</h2>
        <p>{error}</p>
        <button
          onClick={fetchOrders}
          style={{
            padding: "10px 20px",
            backgroundColor: "var(--primary-color)",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>📦 No Orders Yet</h2>
        <p style={{ color: "#666", marginBottom: "20px" }}>
          You haven't placed any orders yet. Start shopping!
        </p>
        <a
          href="/marketplace?view=buy"
          style={{
            display: "inline-block",
            padding: "12px 24px",
            backgroundColor: "var(--primary-color)",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
            fontWeight: "bold",
          }}
        >
          🛍️ Go to Marketplace
        </a>
      </div>
    );
  }

  // ============ RENDER ORDERS ============
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h1>📦 My Orders</h1>
      <p style={{ color: "#666", marginBottom: "30px" }}>
        Total Orders: <strong>{orders.length}</strong>
      </p>

      <div style={{ display: "grid", gap: "20px" }}>
        {orders.map((order) => (
          <div
            key={order._id}
            className="card"
            style={{
              padding: "25px",
              borderLeft: `4px solid ${getStatusColor(order.orderStatus)}`,
            }}
          >
            {/* ORDER HEADER */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
                marginBottom: "20px",
                paddingBottom: "15px",
                borderBottom: "1px solid #eee",
              }}
            >
              <div>
                <h2 style={{ margin: "0 0 8px 0" }}>{order.orderId || order._id}</h2>
                <p style={{ margin: "0", color: "#666", fontSize: "0.9em" }}>
                  Placed on{" "}
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Unknown"}
                </p>
              </div>

              <div style={{ textAlign: "right" }}>
                <p
                  style={{
                    display: "inline-block",
                    padding: "6px 12px",
                    backgroundColor: getStatusColor(order.orderStatus),
                    color: "white",
                    borderRadius: "4px",
                    margin: "0 0 8px 0",
                    fontWeight: "bold",
                    fontSize: "0.9em",
                  }}
                >
                  {order.orderStatus}
                </p>
                <p
                  style={{
                    display: "inline-block",
                    padding: "6px 12px",
                    backgroundColor: getStatusColor(order.paymentStatus),
                    color: "white",
                    borderRadius: "4px",
                    margin: "0 0 0 8px",
                    fontWeight: "bold",
                    fontSize: "0.9em",
                  }}
                >
                  {order.paymentStatus}
                </p>
              </div>
            </div>

            {/* PRODUCTS */}
            <div style={{ marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px solid #eee" }}>
              <h3 style={{ margin: "0 0 15px 0" }}>📦 Products</h3>
              <div style={{ display: "grid", gap: "12px" }}>
                {order.products && order.products.length > 0 ? (
                  order.products.map((product, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "60px 1fr auto",
                        gap: "15px",
                        alignItems: "start",
                        padding: "12px",
                        backgroundColor: "#f9f9f9",
                        borderRadius: "4px",
                      }}
                    >
                      {/* Product Image */}
                      <div>
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.productName}
                            style={{
                              width: "60px",
                              height: "60px",
                              borderRadius: "4px",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "60px",
                              height: "60px",
                              borderRadius: "4px",
                              backgroundColor: "#e8e8e8",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "1.5em",
                            }}
                          >
                            🎨
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div>
                        <p style={{ margin: "0 0 4px 0", fontWeight: "bold" }}>
                          {product.productName}
                        </p>
                        <p style={{ margin: "0", color: "#666", fontSize: "0.9em" }}>
                          Quantity: {product.quantity}
                        </p>
                      </div>

                      {/* Price */}
                      <div style={{ textAlign: "right" }}>
                        <p style={{ margin: "0", fontSize: "1.1em", fontWeight: "bold", color: "var(--primary-color)" }}>
                          ₹{product.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: "#666" }}>No products in this order</p>
                )}
              </div>
            </div>

            {/* DELIVERY ADDRESS */}
            <div style={{ marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px solid #eee" }}>
              <h3 style={{ margin: "0 0 15px 0" }}>📍 Delivery Address</h3>
              <div
                style={{
                  padding: "15px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "4px",
                  lineHeight: "1.6",
                }}
              >
                <p style={{ margin: "0 0 4px 0", fontWeight: "bold" }}>
                  {order.deliveryAddress?.fullName || "N/A"}
                </p>
                <p style={{ margin: "0 0 4px 0", color: "#666" }}>
                  {order.deliveryAddress?.address || "N/A"}
                </p>
                <p style={{ margin: "0 0 4px 0", color: "#666" }}>
                  {order.deliveryAddress?.city}, {order.deliveryAddress?.state}{" "}
                  {order.deliveryAddress?.pincode}
                </p>
                <p style={{ margin: "0", color: "#666" }}>
                  📱 {order.deliveryAddress?.phoneNumber || "N/A"}
                </p>
              </div>
            </div>

            {/* PAYMENT DETAILS */}
            <div style={{ marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px solid #eee" }}>
              <h3 style={{ margin: "0 0 15px 0" }}>💳 Payment Details</h3>
              <div
                style={{
                  padding: "15px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "4px",
                }}
              >
                <p style={{ margin: "0 0 8px 0" }}>
                  <strong>Method:</strong> {order.paymentMethod || "N/A"}
                </p>
                <p style={{ margin: "0 0 8px 0" }}>
                  <strong>Status:</strong>
                  <span
                    style={{
                      marginLeft: "8px",
                      padding: "4px 8px",
                      backgroundColor: getStatusColor(order.paymentStatus),
                      color: "white",
                      borderRadius: "4px",
                      fontSize: "0.9em",
                    }}
                  >
                    {order.paymentStatus}
                  </span>
                </p>
              </div>
            </div>

            {/* TOTAL AMOUNT */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ margin: "0" }}>Total Amount</h2>
              <p style={{ margin: "0", fontSize: "1.8em", fontWeight: "bold", color: "var(--primary-color)" }}>
                ₹{order.totalAmount?.toLocaleString() || "0"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BuyerOrders;
