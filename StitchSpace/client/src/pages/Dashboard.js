import React, { useState, useEffect } from "react";
import axios from "axios";

function Dashboard({ user, setUser }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [workshops, setWorkshops] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [uploadForm, setUploadForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "Textiles",
    quantity: 1,
  });
  const [uploadedImage, setUploadedImage] = useState(null);

  useEffect(() => {
    if (user?.role === "artisan") {
      fetchArtisanData();
    } else {
      fetchLearnerData();
    }
  }, [user]);

  const fetchArtisanData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWorkshops(response.data.workshops || []);
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Error fetching artisan data:", error);
    }
  };

  const fetchLearnerData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/api/upload/single", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadedImage(response.data.path);
      alert("Image uploaded successfully!");
    } catch (error) {
      alert("Error uploading image: " + error.message);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!uploadedImage) {
      alert("Please upload an image first");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/products",
        {
          ...uploadForm,
          images: [uploadedImage],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Product uploaded successfully!");
      setUploadForm({
        name: "",
        description: "",
        price: "",
        category: "Textiles",
        quantity: 1,
      });
      setUploadedImage(null);
      fetchArtisanData();
    } catch (error) {
      alert(
        "Error uploading product: " + error.response?.data?.message ||
          error.message
      );
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <h1 className="section-title">Dashboard</h1>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "30px",
          borderBottom: "2px solid #eee",
          paddingBottom: "10px",
        }}
      >
        {user?.role === "artisan" ? (
          <>
            <button
              onClick={() => setActiveTab("overview")}
              className={
                activeTab === "overview"
                  ? "btn btn-primary"
                  : "btn btn-secondary"
              }
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("workshops")}
              className={
                activeTab === "workshops"
                  ? "btn btn-primary"
                  : "btn btn-secondary"
              }
            >
              My Workshops
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={
                activeTab === "products"
                  ? "btn btn-primary"
                  : "btn btn-secondary"
              }
            >
              My Products
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setActiveTab("overview")}
              className={
                activeTab === "overview"
                  ? "btn btn-primary"
                  : "btn btn-secondary"
              }
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={
                activeTab === "orders" ? "btn btn-primary" : "btn btn-secondary"
              }
            >
              My Orders
            </button>
          </>
        )}
        <button
          onClick={() => setActiveTab("profile")}
          className={
            activeTab === "profile" ? "btn btn-primary" : "btn btn-secondary"
          }
        >
          Profile
        </button>
      </div>

      {activeTab === "overview" && (
        <div className="card" style={{ padding: "30px" }}>
          <h2>Welcome, {user?.name}!</h2>
          <p>Role: {user?.role}</p>
          <p>Email: {user?.email}</p>
        </div>
      )}

      {activeTab === "workshops" && user?.role === "artisan" && (
        <div style={{ display: "grid", gap: "15px" }}>
          {workshops.map((workshop) => (
            <div
              key={workshop._id}
              className="card"
              style={{ padding: "20px" }}
            >
              <h3>{workshop.title}</h3>
              <p>
                {workshop.currentParticipants}/{workshop.maxParticipants}{" "}
                participants
              </p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "products" && user?.role === "artisan" && (
        <div>
          <div
            className="card"
            style={{ padding: "30px", marginBottom: "30px" }}
          >
            <h2>Upload New Product</h2>
            <form
              onSubmit={handleProductSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              <input
                type="text"
                placeholder="Product Name"
                value={uploadForm.name}
                onChange={(e) =>
                  setUploadForm({ ...uploadForm, name: e.target.value })
                }
                required
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
              <textarea
                placeholder="Product Description"
                value={uploadForm.description}
                onChange={(e) =>
                  setUploadForm({ ...uploadForm, description: e.target.value })
                }
                required
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  minHeight: "100px",
                }}
              />
              <input
                type="number"
                placeholder="Price"
                value={uploadForm.price}
                onChange={(e) =>
                  setUploadForm({ ...uploadForm, price: e.target.value })
                }
                required
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
              <select
                value={uploadForm.category}
                onChange={(e) =>
                  setUploadForm({ ...uploadForm, category: e.target.value })
                }
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              >
                <option value="Textiles">Textiles</option>
                <option value="Clothing">Clothing</option>
                <option value="Accessories">Accessories</option>
                <option value="Home Decor">Home Decor</option>
                <option value="Art Pieces">Art Pieces</option>
              </select>
              <input
                type="number"
                placeholder="Quantity"
                value={uploadForm.quantity}
                onChange={(e) =>
                  setUploadForm({ ...uploadForm, quantity: e.target.value })
                }
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
              {uploadedImage && (
                <div style={{ color: "green", fontSize: "0.9rem" }}>
                  ✓ Image uploaded: {uploadedImage}
                </div>
              )}
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: "100%", padding: "12px" }}
              >
                Upload Product
              </button>
            </form>
          </div>

          <h3>Your Products</h3>
          <div style={{ display: "grid", gap: "15px" }}>
            {products.length === 0 ? (
              <p>No products yet. Upload your first product above!</p>
            ) : (
              products.map((product) => (
                <div
                  key={product._id}
                  className="card"
                  style={{ padding: "20px" }}
                >
                  <h3>{product.name}</h3>
                  <p>Price: ${product.price}</p>
                  <p>Category: {product.category}</p>
                  <p>
                    Stock: {product.quantity} - Sold: {product.sold || 0}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === "orders" && user?.role !== "artisan" && (
        <div style={{ display: "grid", gap: "15px" }}>
          {orders.map((order) => (
            <div key={order._id} className="card" style={{ padding: "20px" }}>
              <h3>Order #{order._id.slice(-8)}</h3>
              <p>
                Total: ${order.totalAmount} - Status: {order.status}
              </p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "profile" && (
        <div className="card" style={{ padding: "30px", maxWidth: "600px" }}>
          <h2>Update Profile</h2>
          <form
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            <input
              type="text"
              placeholder="Full Name"
              defaultValue={user?.name}
              style={{
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            />
            <textarea
              placeholder="Bio"
              style={{
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                minHeight: "100px",
              }}
            />
            <input
              type="text"
              placeholder="Location"
              style={{
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", padding: "12px" }}
            >
              Save Changes
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
