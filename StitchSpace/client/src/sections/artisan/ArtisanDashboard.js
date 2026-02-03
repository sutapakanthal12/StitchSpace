import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function ArtisanDashboard({ user }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [products, setProducts] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [sales, setSales] = useState({ totalRevenue: 0, totalSales: 0, activeProducts: 0 });
  
  // Product Form - Per PDF Spec
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    quantity: 10,
    images: [],
    category: "Embroidery", // Craft category
    materials: [],
    ecoFriendly: false,
    fairTradeCertified: false,
    artisanStory: "",
  });

  // Workshop Form - Per PDF Spec
  const [workshopForm, setWorkshopForm] = useState({
    title: "",
    description: "",
    category: "Embroidery",
    price: "",
    level: "Beginner",
    duration: "", // e.g., "4 weeks"
    startDate: "",
    endDate: "",
    maxParticipants: 30,
    materials: [],
    videoUrl: "",
    learningOutcomes: [],
  });

  useEffect(() => {
    if (user?.role === "artisan") {
      fetchArtisanData();
    }
  }, [user]);

  const fetchArtisanData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data.products || []);
      setWorkshops(response.data.workshops || []);

      // Calculate sales metrics - Total sales 💰
      const totalRevenue = response.data.products?.reduce(
        (sum, p) => sum + (p.price * p.sold || 0),
        0
      ) || 0;
      const totalSales = response.data.products?.reduce((sum, p) => sum + (p.sold || 0), 0) || 0;

      // Calculate average rating from reviews
      let allReviews = [];
      let totalRating = 0;
      response.data.products?.forEach((p) => {
        if (p.reviews) {
          allReviews = [...allReviews, ...p.reviews];
          totalRating += p.reviews.reduce((sum, r) => sum + r.rating, 0);
        }
      });
      setReviews(allReviews);
      setAverageRating(
        allReviews.length > 0 ? (totalRating / allReviews.length).toFixed(1) : 0
      );

      setSales({
        totalRevenue: totalRevenue.toFixed(2),
        totalSales,
        activeProducts: response.data.products?.length || 0,
      });
    } catch (error) {
      console.error("Error fetching artisan data:", error);
    }
  };

  // Add Product - Per PDF Spec
  const handleProductCreate = async () => {
    if (!productForm.name || !productForm.price || !productForm.description) {
      alert("❌ Please fill in all required fields");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/products", productForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Product created successfully!");
      setProductForm({
        name: "",
        description: "",
        price: "",
        quantity: 10,
        images: [],
        category: "Embroidery",
        materials: [],
        ecoFriendly: false,
        fairTradeCertified: false,
        artisanStory: "",
      });
      fetchArtisanData();
    } catch (error) {
      alert("❌ Error creating product: " + error.message);
    }
  };

  // Create Workshop - Per PDF Spec
  const handleWorkshopCreate = async () => {
    if (!workshopForm.title || !workshopForm.price || !workshopForm.description) {
      alert("❌ Please fill in all required fields");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/workshops", workshopForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Workshop created successfully!");
      setWorkshopForm({
        title: "",
        description: "",
        category: "Embroidery",
        price: "",
        level: "Beginner",
        duration: "",
        startDate: "",
        endDate: "",
        maxParticipants: 30,
        materials: [],
        videoUrl: "",
        learningOutcomes: [],
      });
      fetchArtisanData();
    } catch (error) {
      alert("❌ Error creating workshop: " + error.message);
    }
  };

  // Delete Product
  const deleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`/api/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchArtisanData();
        alert("✅ Product deleted!");
      } catch (error) {
        alert("❌ Error deleting product");
      }
    }
  };

  // Delete Workshop
  const deleteWorkshop = async (workshopId) => {
    if (window.confirm("Are you sure you want to delete this workshop?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`/api/workshops/${workshopId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchArtisanData();
        alert("✅ Workshop deleted!");
      } catch (error) {
        alert("❌ Error deleting workshop");
      }
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h1>🎨 Artisan Dashboard - Creators & Teachers</h1>

      {/* OVERVIEW TAB - Per PDF Spec */}
      {activeTab === "overview" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "40px" }}>
            {/* Total sales 💰 */}
            <div className="card" style={{ padding: "25px", textAlign: "center", backgroundColor: "#f5f5f5" }}>
              <h2 style={{ color: "var(--primary-color)", margin: "0 0 10px 0" }}>💰 ${sales.totalRevenue}</h2>
              <p style={{ margin: 0, color: "#666", fontSize: "0.95em" }}>Total Sales Revenue</p>
            </div>

            {/* Total sales count */}
            <div className="card" style={{ padding: "25px", textAlign: "center", backgroundColor: "#f5f5f5" }}>
              <h2 style={{ color: "var(--primary-color)", margin: "0 0 10px 0" }}>{sales.totalSales}</h2>
              <p style={{ margin: 0, color: "#666", fontSize: "0.95em" }}>Total Items Sold</p>
            </div>

            {/* Active products */}
            <div className="card" style={{ padding: "25px", textAlign: "center", backgroundColor: "#f5f5f5" }}>
              <h2 style={{ color: "var(--primary-color)", margin: "0 0 10px 0" }}>{sales.activeProducts}</h2>
              <p style={{ margin: 0, color: "#666", fontSize: "0.95em" }}>Active Products</p>
            </div>

            {/* Upcoming workshops */}
            <div className="card" style={{ padding: "25px", textAlign: "center", backgroundColor: "#f5f5f5" }}>
              <h2 style={{ color: "var(--primary-color)", margin: "0 0 10px 0" }}>{workshops.length}</h2>
              <p style={{ margin: 0, color: "#666", fontSize: "0.95em" }}>Upcoming Workshops</p>
            </div>

            {/* Reviews & ratings ⭐ */}
            <div className="card" style={{ padding: "25px", textAlign: "center", backgroundColor: "#f5f5f5" }}>
              <h2 style={{ color: "var(--primary-color)", margin: "0 0 10px 0" }}>⭐ {averageRating}</h2>
              <p style={{ margin: 0, color: "#666", fontSize: "0.95em" }}>Average Rating ({reviews.length} reviews)</p>
            </div>
          </div>

          {/* Recent Reviews Section */}
          <div className="card" style={{ padding: "20px" }}>
            <h3>Recent Customer Reviews</h3>
            {reviews.length === 0 ? (
              <p style={{ color: "#999" }}>No reviews yet. Keep creating amazing products! 🌟</p>
            ) : (
              <div style={{ display: "grid", gap: "15px" }}>
                {reviews.slice(0, 5).map((review, idx) => (
                  <div key={idx} style={{ borderBottom: "1px solid #eee", paddingBottom: "15px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <strong>{review.userId?.name || "Anonymous"}</strong>
                      <span style={{ color: "#FF9800" }}>{'⭐'.repeat(review.rating)}</span>
                    </div>
                    <p style={{ color: "#666", margin: "0" }}>{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "30px", flexWrap: "wrap" }}>
        <button
          className={activeTab === "overview" ? "btn btn-primary" : "btn"}
          onClick={() => setActiveTab("overview")}
        >
          📊 Overview
        </button>
        <button
          className={activeTab === "products" ? "btn btn-primary" : "btn"}
          onClick={() => setActiveTab("products")}
        >
          📦 Manage Products ({products.length})
        </button>
        <button
          className={activeTab === "addProduct" ? "btn btn-primary" : "btn"}
          onClick={() => setActiveTab("addProduct")}
        >
          ➕ Add Product
        </button>
        <button
          className={activeTab === "workshops" ? "btn btn-primary" : "btn"}
          onClick={() => setActiveTab("workshops")}
        >
          🎓 Manage Workshops ({workshops.length})
        </button>
        <button
          className={activeTab === "createWorkshop" ? "btn btn-primary" : "btn"}
          onClick={() => setActiveTab("createWorkshop")}
        >
          ➕ Create Workshop
        </button>
        <button
          className={activeTab === "profile" ? "btn btn-primary" : "btn"}
          onClick={() => setActiveTab("profile")}
        >
          👤 My Profile
        </button>
      </div>

      {/* ADD PRODUCT TAB - Per PDF Spec */}
      {activeTab === "addProduct" && (
        <div className="card" style={{ padding: "30px", maxWidth: "700px" }}>
          <h2>➕ Create New Product</h2>
          <p style={{ color: "#999", marginBottom: "20px" }}>Add a new handmade product to your portfolio</p>

          {/* Product name */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>Product Name *</label>
            <input
              type="text"
              placeholder="e.g., Hand-woven Embroidery Scarf"
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ddd", boxSizing: "border-box" }}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>Description *</label>
            <textarea
              placeholder="Tell the story of your product..."
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ddd", height: "120px", boxSizing: "border-box" }}
            />
          </div>

          {/* Price */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>Price ($) *</label>
            <input
              type="number"
              placeholder="0.00"
              value={productForm.price}
              onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) })}
              style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ddd", boxSizing: "border-box" }}
            />
          </div>

          {/* Craft Category */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>Craft Category *</label>
            <select
              value={productForm.category}
              onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
              style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ddd", boxSizing: "border-box" }}
            >
              <option value="Embroidery">Embroidery</option>
              <option value="Weaving">Weaving</option>
              <option value="Dyeing">Dyeing</option>
              <option value="Textiles">Textiles</option>
              <option value="Clothing">Clothing</option>
              <option value="Accessories">Accessories</option>
              <option value="Home Decor">Home Decor</option>
              <option value="Art Pieces">Art Pieces</option>
            </select>
          </div>

          {/* Stock Quantity */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>Stock Quantity</label>
            <input
              type="number"
              value={productForm.quantity}
              onChange={(e) => setProductForm({ ...productForm, quantity: parseInt(e.target.value) })}
              style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ddd", boxSizing: "border-box" }}
            />
          </div>

          {/* Sustainability Checkboxes - Per PDF Spec */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "10px" }}>Sustainability</label>
            <label style={{ display: "flex", alignItems: "center", marginBottom: "10px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={productForm.ecoFriendly}
                onChange={(e) => setProductForm({ ...productForm, ecoFriendly: e.target.checked })}
                style={{ marginRight: "10px", width: "18px", height: "18px" }}
              />
              <span>🌱 Eco-Friendly / Sustainable</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={productForm.fairTradeCertified}
                onChange={(e) => setProductForm({ ...productForm, fairTradeCertified: e.target.checked })}
                style={{ marginRight: "10px", width: "18px", height: "18px" }}
              />
              <span>🏅 Fair Trade Certified</span>
            </label>
          </div>

          {/* Artisan Story */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>Your Story (Optional)</label>
            <textarea
              placeholder="Share the inspiration behind this product..."
              value={productForm.artisanStory}
              onChange={(e) => setProductForm({ ...productForm, artisanStory: e.target.value })}
              style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ddd", height: "100px", boxSizing: "border-box" }}
            />
          </div>

          <button
            className="btn btn-primary"
            onClick={handleProductCreate}
            style={{ width: "100%", padding: "12px", fontSize: "1em" }}
          >
            ✅ Create Product
          </button>
        </div>
      )}

      {/* MANAGE PRODUCTS TAB - Per PDF Spec */}
      {activeTab === "products" && (
        <div>
          <h2>📦 Manage Products</h2>
          {products.length === 0 ? (
            <p>No products yet. <button className="btn btn-primary" onClick={() => setActiveTab("addProduct")}>Create your first product!</button> 🎨</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
              {products.map((product) => (
                <div key={product._id} className="card" style={{ overflow: "hidden" }}>
                  <img
                    src={product.images?.[0] || "https://via.placeholder.com/280x200"}
                    alt={product.name}
                    style={{ width: "100%", height: "180px", objectFit: "cover" }}
                  />
                  <div style={{ padding: "15px" }}>
                    <h3 style={{ margin: "0 0 8px 0" }}>{product.name}</h3>
                    <p style={{ margin: "0 0 10px 0", fontSize: "1.2em", fontWeight: "bold", color: "var(--primary-color)" }}>
                      ${product.price}
                    </p>
                    {/* Stock status */}
                    <div style={{ marginBottom: "10px", padding: "8px", backgroundColor: "#f5f5f5", borderRadius: "4px" }}>
                      <p style={{ margin: "0 0 5px 0", fontSize: "0.9em", color: "#666" }}>
                        📦 Stock: <strong>{product.quantity}</strong>
                      </p>
                      <p style={{ margin: "0", fontSize: "0.9em", color: "#666" }}>
                        ✅ Sold: <strong>{product.sold || 0}</strong>
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button className="btn" style={{ flex: 1, padding: "8px" }}>Edit</button>
                      <button
                        className="btn"
                        style={{ flex: 1, padding: "8px", color: "red" }}
                        onClick={() => deleteProduct(product._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CREATE WORKSHOP TAB - Per PDF Spec */}
      {activeTab === "createWorkshop" && (
        <div className="card" style={{ padding: "30px", maxWidth: "700px" }}>
          <h2>➕ Create New Workshop</h2>
          <p style={{ color: "#999", marginBottom: "20px" }}>Teach your craft and earn from workshops</p>

          {/* Workshop title */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>Workshop Title *</label>
            <input
              type="text"
              placeholder="e.g., Beginner Embroidery Basics"
              value={workshopForm.title}
              onChange={(e) => setWorkshopForm({ ...workshopForm, title: e.target.value })}
              style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ddd", boxSizing: "border-box" }}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>Description *</label>
            <textarea
              placeholder="What will students learn?"
              value={workshopForm.description}
              onChange={(e) => setWorkshopForm({ ...workshopForm, description: e.target.value })}
              style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ddd", height: "100px", boxSizing: "border-box" }}
            />
          </div>

          {/* Skill level - Per PDF */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>Skill Level *</label>
            <select
              value={workshopForm.level}
              onChange={(e) => setWorkshopForm({ ...workshopForm, level: e.target.value })}
              style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ddd", boxSizing: "border-box" }}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Duration - Per PDF */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>Duration</label>
            <input
              type="text"
              placeholder="e.g., 4 weeks, 8 hours, etc."
              value={workshopForm.duration}
              onChange={(e) => setWorkshopForm({ ...workshopForm, duration: e.target.value })}
              style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ddd", boxSizing: "border-box" }}
            />
          </div>

          {/* Start Date */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>Start Date *</label>
            <input
              type="date"
              value={workshopForm.startDate}
              onChange={(e) => setWorkshopForm({ ...workshopForm, startDate: e.target.value })}
              style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ddd", boxSizing: "border-box" }}
            />
          </div>

          {/* Price */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>Price ($) *</label>
            <input
              type="number"
              placeholder="0.00"
              value={workshopForm.price}
              onChange={(e) => setWorkshopForm({ ...workshopForm, price: parseFloat(e.target.value) })}
              style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ddd", boxSizing: "border-box" }}
            />
          </div>

          {/* Workshop Type - Live / Recorded - Per PDF */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "10px" }}>Workshop Type</label>
            <label style={{ display: "flex", alignItems: "center", marginBottom: "10px", cursor: "pointer" }}>
              <input
                type="radio"
                name="workshopType"
                value="live"
                style={{ marginRight: "10px" }}
              />
              <span>🔴 Live Session</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
              <input
                type="radio"
                name="workshopType"
                value="recorded"
                style={{ marginRight: "10px" }}
              />
              <span>📹 Recorded Video (Upload video later)</span>
            </label>
          </div>

          <button
            className="btn btn-primary"
            onClick={handleWorkshopCreate}
            style={{ width: "100%", padding: "12px", fontSize: "1em" }}
          >
            ✅ Create Workshop
          </button>
        </div>
      )}

      {/* MANAGE WORKSHOPS TAB */}
      {activeTab === "workshops" && (
        <div>
          <h2>🎓 Manage Workshops</h2>
          {workshops.length === 0 ? (
            <p>No workshops yet. <button className="btn btn-primary" onClick={() => setActiveTab("createWorkshop")}>Create your first workshop!</button> 📚</p>
          ) : (
            <div style={{ display: "grid", gap: "20px" }}>
              {workshops.map((workshop) => (
                <div key={workshop._id} className="card" style={{ padding: "20px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "20px", alignItems: "start" }}>
                    <div>
                      <h3 style={{ margin: "0 0 10px 0" }}>{workshop.title}</h3>
                      <p style={{ margin: "0 0 8px 0", color: "#666" }}>{workshop.description}</p>
                      <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", marginTop: "10px", fontSize: "0.9em" }}>
                        <span>📚 Level: {workshop.level}</span>
                        <span>⏱️ Duration: {workshop.duration}</span>
                        <span>👥 Max: {workshop.maxParticipants}</span>
                        <span style={{ fontWeight: "bold", color: "var(--primary-color)" }}>💰 ${workshop.price}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <button className="btn" style={{ padding: "8px 16px" }}>Edit</button>
                      <button
                        className="btn"
                        style={{ padding: "8px 16px", color: "red" }}
                        onClick={() => deleteWorkshop(workshop._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ARTISAN PROFILE TAB */}
      {activeTab === "profile" && (
        <div className="card" style={{ padding: "30px", maxWidth: "700px" }}>
          <h2>👤 Artisan Profile (Public)</h2>
          <p style={{ color: "#999", marginBottom: "20px" }}>This is how buyers will see your profile</p>
          
          <div style={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
            <h3 style={{ margin: "0 0 10px 0" }}>{user?.name}</h3>
            <p style={{ margin: "0 0 15px 0", color: "#666" }}>View your public profile <Link to={`/artisan-profile/${user?._id}`} style={{ color: "var(--primary-color)" }}>here →</Link></p>
            
            <div style={{ marginBottom: "15px" }}>
              <strong>Total Products:</strong> {products.length}
            </div>
            <div style={{ marginBottom: "15px" }}>
              <strong>Total Workshops:</strong> {workshops.length}
            </div>
            <div style={{ marginBottom: "15px" }}>
              <strong>Average Rating:</strong> ⭐ {averageRating}
            </div>
          </div>

          <p style={{ color: "#999", fontSize: "0.9em" }}>Edit your bio and profile photo in your account settings (Coming soon)</p>
        </div>
      )}
    </div>
  );
}

export default ArtisanDashboard;
