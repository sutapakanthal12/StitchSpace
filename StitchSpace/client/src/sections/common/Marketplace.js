import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

function Marketplace({ user }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const view = searchParams.get("view") || "buy"; // Default to buy

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [userProducts, setUserProducts] = useState([]); // For artisan view
  const [filters, setFilters] = useState({
    craftType: "All",
    priceMin: 0,
    priceMax: 10000,
    sustainable: false,
    fairTrade: false,
    search: "",
  });
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "Embroidery",
    materials: "",
    ecoFriendly: false,
    fairTradeCertified: false,
    image: null,
    imagePreview: null,
  });

  useEffect(() => {
    // Redirect based on user role if they don't have the right view
    if (user) {
      if (user.role === "learner" && view !== "learn") {
        navigate("/marketplace?view=learn");
      } else if (user.role === "buyer" && view !== "buy") {
        navigate("/marketplace?view=buy");
      } else if (user.role === "artisan" && view !== "manage") {
        navigate("/marketplace?view=manage");
      }
    }
  }, [user, view, navigate]);

  useEffect(() => {
    if (view === "manage" && user?.role === "artisan") {
      fetchArtisanProducts();
    } else {
      fetchProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, user]);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, filters]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/products");
      setProducts(response.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchArtisanProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/products/my-products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserProducts(response.data || []);
    } catch (error) {
      console.error("Error fetching artisan products:", error);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    if (filters.craftType !== "All") {
      filtered = filtered.filter((p) => p.category === filters.craftType);
    }

    filtered = filtered.filter(
      (p) => p.price >= filters.priceMin && p.price <= filters.priceMax
    );

    if (filters.sustainable) {
      filtered = filtered.filter((p) => p.ecoFriendly);
    }

    if (filters.fairTrade) {
      filtered = filtered.filter((p) => p.fairTradeCertified);
    }

    if (filters.search) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item) => item._id === product._id);
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("✅ Added to cart!");
  };

  const addToWishlist = (product) => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    if (!wishlist.find((item) => item._id === product._id)) {
      wishlist.push(product);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      alert("❤️ Added to wishlist!");
    } else {
      alert("Already in wishlist");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file");
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({
          ...newProduct,
          image: file,
          imagePreview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.description || !newProduct.price) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      // Prepare product data
      const productData = {
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        category: newProduct.category,
        materials: newProduct.materials,
        ecoFriendly: newProduct.ecoFriendly,
        fairTradeCertified: newProduct.fairTradeCertified,
        images: newProduct.imagePreview ? [newProduct.imagePreview] : [],
      };

      const response = await axios.post("/api/products", productData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setUserProducts([response.data, ...userProducts]);
      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "Embroidery",
        materials: "",
        ecoFriendly: false,
        fairTradeCertified: false,
        image: null,
        imagePreview: null,
      });
      setShowAddProductForm(false);
      alert("✅ Product created successfully!");
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`/api/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserProducts(userProducts.filter((p) => p._id !== productId));
        alert("✅ Product deleted!");
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product");
      }
    }
  };

  // ============ LEARNER VIEW (EDUCATIONAL) ============
  if (view === "learn") {
    return (
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px" }}>
        <h1>🎨 Explore Crafts & Learn</h1>
        <p style={{ color: "#666", marginBottom: "30px" }}>
          Discover handmade creations and learn the techniques behind them
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "280px 1fr",
            gap: "30px",
          }}
        >
          {/* Filters Sidebar */}
          <div
            className="card"
            style={{
              padding: "20px",
              height: "fit-content",
              backgroundColor: "#fafafa",
            }}
          >
            <h3 style={{ marginTop: 0 }}>🔍 Filters</h3>

            {/* Search */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Search
              </label>
              <input
                type="text"
                placeholder="Search crafts..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Craft Type */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Craft Type
              </label>
              <select
                value={filters.craftType}
                onChange={(e) =>
                  setFilters({ ...filters, craftType: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                  boxSizing: "border-box",
                }}
              >
                <option>All</option>
                <option>Embroidery</option>
                <option>Weaving</option>
                <option>Dyeing</option>
                <option>Textiles</option>
                <option>Clothing</option>
                <option>Accessories</option>
                <option>Home Decor</option>
                <option>Art Pieces</option>
              </select>
            </div>

            {/* Sustainable Filter */}
            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={filters.sustainable}
                  onChange={(e) =>
                    setFilters({ ...filters, sustainable: e.target.checked })
                  }
                  style={{ marginRight: "8px" }}
                />
                <span>🌱 Eco-Friendly</span>
              </label>
            </div>

            {/* Reset Button */}
            <button
              onClick={() =>
                setFilters({
                  craftType: "All",
                  search: "",
                  sustainable: false,
                  fairTrade: false,
                  priceMin: 0,
                  priceMax: 10000,
                })
              }
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#f0f0f0",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              🔄 Reset Filters
            </button>
          </div>

          {/* Products Grid - LEARNER VIEW */}
          <div>
            <p style={{ color: "#666", marginBottom: "20px" }}>
              Found {filteredProducts.length} crafts
            </p>

            {filteredProducts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <p style={{ color: "#999" }}>
                  No crafts found with those filters
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "20px",
                }}
              >
                {filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="card"
                    style={{ padding: "0", overflow: "hidden" }}
                  >
                    {/* Product Image */}
                    <div
                      style={{
                        width: "100%",
                        height: "200px",
                        backgroundColor: "#e8e8e8",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#999",
                        fontSize: "3em",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <span>🎨</span>
                      )}
                    </div>

                    <div style={{ padding: "15px" }}>
                      <h3 style={{ margin: "0 0 8px 0", fontSize: "1.1em" }}>
                        {product.name}
                      </h3>

                      <p
                        style={{
                          margin: "5px 0",
                          color: "#666",
                          fontSize: "0.9em",
                        }}
                      >
                        👨‍🎨 By {product.artisan?.name || "Unknown Artisan"}
                      </p>

                      <p
                        style={{
                          margin: "8px 0",
                          color: "#555",
                          fontSize: "0.95em",
                          lineHeight: "1.4",
                        }}
                      >
                        {product.description?.substring(0, 80)}...
                      </p>

                      {/* Sustainability Badges */}
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          marginBottom: "12px",
                          flexWrap: "wrap",
                        }}
                      >
                        {product.ecoFriendly && (
                          <span
                            style={{
                              backgroundColor: "#e8f5e9",
                              color: "#2e7d32",
                              padding: "4px 8px",
                              borderRadius: "12px",
                              fontSize: "0.8em",
                              fontWeight: "bold",
                            }}
                          >
                            🌱 Eco-Friendly
                          </span>
                        )}
                        {product.fairTradeCertified && (
                          <span
                            style={{
                              backgroundColor: "#fff3e0",
                              color: "#e65100",
                              padding: "4px 8px",
                              borderRadius: "12px",
                              fontSize: "0.8em",
                              fontWeight: "bold",
                            }}
                          >
                            🏅 Fair Trade
                          </span>
                        )}
                      </div>

                      {/* LEARNER-SPECIFIC BUTTONS */}
                      <div style={{ display: "flex", gap: "8px" }}>
                        <Link
                          to={`/workshop/${product._id}`}
                          style={{
                            flex: 1,
                            padding: "10px",
                            backgroundColor: "var(--primary-color)",
                            color: "white",
                            textAlign: "center",
                            borderRadius: "4px",
                            textDecoration: "none",
                            fontWeight: "bold",
                            fontSize: "0.9em",
                          }}
                        >
                          🎓 Learn This
                        </Link>
                        <button
                          onClick={() => addToWishlist(product)}
                          style={{
                            padding: "10px 12px",
                            backgroundColor: "#fff0f5",
                            border: "1px solid #ffb6c1",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "1.2em",
                          }}
                        >
                          ❤️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ============ BUYER VIEW (PURCHASING) ============
  if (view === "buy") {
    return (
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px" }}>
        <h1>🛍️ Marketplace - Handmade Products</h1>
        <p style={{ color: "#999", marginBottom: "30px" }}>
          Browse {filteredProducts.length} handcrafted items from talented
          artisans
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "280px 1fr",
            gap: "30px",
          }}
        >
          {/* Filters Sidebar */}
          <div
            className="card"
            style={{
              padding: "20px",
              height: "fit-content",
              backgroundColor: "#fafafa",
              position: "sticky",
              top: "20px",
            }}
          >
            <h3 style={{ marginTop: 0 }}>🔍 Filters</h3>

            {/* Search */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Search
              </label>
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Craft Type */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Craft Type
              </label>
              <select
                value={filters.craftType}
                onChange={(e) =>
                  setFilters({ ...filters, craftType: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                  boxSizing: "border-box",
                }}
              >
                <option>All</option>
                <option>Embroidery</option>
                <option>Weaving</option>
                <option>Dyeing</option>
                <option>Textiles</option>
                <option>Clothing</option>
                <option>Accessories</option>
                <option>Home Decor</option>
                <option>Art Pieces</option>
              </select>
            </div>

            {/* Price Range */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Price Range: ₹{filters.priceMin} - ₹{filters.priceMax}
              </label>
              <input
                type="range"
                min="0"
                max="10000"
                value={filters.priceMax}
                onChange={(e) =>
                  setFilters({ ...filters, priceMax: Number(e.target.value) })
                }
                style={{ width: "100%" }}
              />
            </div>

            {/* Filters */}
            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={filters.sustainable}
                  onChange={(e) =>
                    setFilters({ ...filters, sustainable: e.target.checked })
                  }
                  style={{ marginRight: "8px" }}
                />
                <span>🌱 Eco-Friendly</span>
              </label>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={filters.fairTrade}
                  onChange={(e) =>
                    setFilters({ ...filters, fairTrade: e.target.checked })
                  }
                  style={{ marginRight: "8px" }}
                />
                <span>🏅 Fair Trade</span>
              </label>
            </div>

            {/* Reset Button */}
            <button
              onClick={() =>
                setFilters({
                  craftType: "All",
                  priceMin: 0,
                  priceMax: 10000,
                  sustainable: false,
                  fairTrade: false,
                  search: "",
                })
              }
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#f0f0f0",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              🔄 Reset Filters
            </button>
          </div>

          {/* Products Grid - BUYER VIEW */}
          <div>
            <p style={{ color: "#666", marginBottom: "20px" }}>
              Found {filteredProducts.length} products
            </p>

            {filteredProducts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <p style={{ color: "#999" }}>No products found</p>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "20px",
                }}
              >
                {filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="card"
                    style={{ padding: "0", overflow: "hidden" }}
                  >
                    {/* Product Image */}
                    <div
                      style={{
                        width: "100%",
                        height: "200px",
                        backgroundColor: "#e8e8e8",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#999",
                        fontSize: "3em",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <span>🎨</span>
                      )}
                    </div>

                    <div style={{ padding: "15px" }}>
                      <h3 style={{ margin: "0 0 8px 0", fontSize: "1.1em" }}>
                        {product.name}
                      </h3>

                      <p
                        style={{
                          margin: "5px 0",
                          color: "#666",
                          fontSize: "0.9em",
                        }}
                      >
                        👨‍🎨 By {product.artisan?.name || "Unknown"}
                      </p>

                      <p
                        style={{
                          margin: "8px 0",
                          color: "#555",
                          fontSize: "0.95em",
                          lineHeight: "1.4",
                        }}
                      >
                        {product.description?.substring(0, 80)}...
                      </p>

                      {/* Sustainability Badges */}
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          marginBottom: "12px",
                          flexWrap: "wrap",
                        }}
                      >
                        {product.ecoFriendly && (
                          <span
                            style={{
                              backgroundColor: "#e8f5e9",
                              color: "#2e7d32",
                              padding: "4px 8px",
                              borderRadius: "12px",
                              fontSize: "0.8em",
                              fontWeight: "bold",
                            }}
                          >
                            🌱 Eco-Friendly
                          </span>
                        )}
                        {product.fairTradeCertified && (
                          <span
                            style={{
                              backgroundColor: "#fff3e0",
                              color: "#e65100",
                              padding: "4px 8px",
                              borderRadius: "12px",
                              fontSize: "0.8em",
                              fontWeight: "bold",
                            }}
                          >
                            🏅 Fair Trade
                          </span>
                        )}
                      </div>

                      {/* PRICE - PROMINENT IN BUYER VIEW */}
                      <p
                        style={{
                          fontSize: "1.3em",
                          fontWeight: "bold",
                          color: "var(--primary-color)",
                          margin: "10px 0",
                        }}
                      >
                        ₹{product.price}
                      </p>

                      {/* BUYER-SPECIFIC BUTTONS */}
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => navigate(`/checkout/${product._id}`)}
                          style={{
                            flex: 1,
                            padding: "10px",
                            backgroundColor: "var(--primary-color)",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontWeight: "bold",
                          }}
                        >
                          🛒 Buy Now
                        </button>
                        <button
                          onClick={() => addToWishlist(product)}
                          style={{
                            padding: "10px 12px",
                            backgroundColor: "#fff0f5",
                            border: "1px solid #ffb6c1",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "1.2em",
                          }}
                        >
                          ❤️
                        </button>
                      </div>

                      {/* CUSTOM ORDER OPTION */}
                      <button
                        style={{
                          width: "100%",
                          marginTop: "8px",
                          padding: "8px",
                          backgroundColor: "transparent",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          cursor: "pointer",
                          color: "#666",
                        }}
                      >
                        ✉️ Custom Order
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ============ ARTISAN VIEW (MANAGEMENT) ============
  if (view === "manage") {
    return (
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <h1>📦 Manage Your Products</h1>
          <button
            onClick={() => setShowAddProductForm(!showAddProductForm)}
            style={{
              padding: "12px 24px",
              backgroundColor: "var(--primary-color)",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "1em",
            }}
          >
            {showAddProductForm ? "✖️ Cancel" : "➕ Add Product"}
          </button>
        </div>

        {/* Add Product Form */}
        {showAddProductForm && (
          <div
            className="card"
            style={{
              padding: "30px",
              marginBottom: "30px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <h2>🎨 Create New Product</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
                marginBottom: "15px",
              }}
            >
              <div>
                <label
                  style={{
                    fontWeight: "bold",
                    display: "block",
                    marginBottom: "5px",
                  }}
                >
                  Product Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Hand-embroidered Cushion"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
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

              <div>
                <label
                  style={{
                    fontWeight: "bold",
                    display: "block",
                    marginBottom: "5px",
                  }}
                >
                  Price (₹) *
                </label>
                <input
                  type="number"
                  placeholder="1999"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
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

            {/* Image Upload */}
            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: "5px",
                }}
              >
                📸 Product Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                  boxSizing: "border-box",
                  cursor: "pointer",
                }}
              />
              <p
                style={{ fontSize: "0.85em", color: "#666", marginTop: "5px" }}
              >
                Max 5MB. Supported: JPG, PNG, GIF
              </p>

              {/* Image Preview */}
              {newProduct.imagePreview && (
                <div style={{ marginTop: "15px" }}>
                  <p style={{ fontWeight: "bold", marginBottom: "8px" }}>
                    Preview:
                  </p>
                  <img
                    src={newProduct.imagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: "200px",
                      maxHeight: "200px",
                      borderRadius: "4px",
                      border: "2px solid var(--primary-color)",
                    }}
                  />
                  <button
                    onClick={() =>
                      setNewProduct({
                        ...newProduct,
                        image: null,
                        imagePreview: null,
                      })
                    }
                    style={{
                      marginTop: "10px",
                      padding: "8px 15px",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "0.9em",
                    }}
                  >
                    ✕ Remove Image
                  </button>
                </div>
              )}
            </div>

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
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                  boxSizing: "border-box",
                }}
              >
                <option>Embroidery</option>
                <option>Weaving</option>
                <option>Dyeing</option>
                <option>Textiles</option>
                <option>Clothing</option>
                <option>Accessories</option>
                <option>Home Decor</option>
                <option>Art Pieces</option>
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
                Description *
              </label>
              <textarea
                placeholder="Describe your product..."
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
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

            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: "5px",
                }}
              >
                Materials
              </label>
              <input
                type="text"
                placeholder="e.g., Silk thread, cotton fabric"
                value={newProduct.materials}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, materials: e.target.value })
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

            <div style={{ display: "flex", gap: "20px", marginBottom: "15px" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={newProduct.ecoFriendly}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      ecoFriendly: e.target.checked,
                    })
                  }
                  style={{ marginRight: "8px" }}
                />
                <span>🌱 Eco-Friendly</span>
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={newProduct.fairTradeCertified}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      fairTradeCertified: e.target.checked,
                    })
                  }
                  style={{ marginRight: "8px" }}
                />
                <span>🏅 Fair Trade Certified</span>
              </label>
            </div>

            <button
              onClick={handleAddProduct}
              style={{
                padding: "12px 30px",
                backgroundColor: "var(--primary-color)",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "1em",
              }}
            >
              🚀 Create Product
            </button>
          </div>
        )}

        {/* Products List */}
        <h2>Your Products</h2>
        {userProducts.length === 0 ? (
          <div
            className="card"
            style={{ padding: "40px", textAlign: "center" }}
          >
            <p style={{ color: "#999", fontSize: "1.1em" }}>
              No products yet. Create your first one! 🎨
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {userProducts.map((product) => (
              <div
                key={product._id}
                className="card"
                style={{ padding: "0", overflow: "hidden" }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "200px",
                    backgroundColor: "#e8e8e8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#999",
                    fontSize: "3em",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <span>🎨</span>
                  )}
                </div>

                <div style={{ padding: "15px" }}>
                  <h3 style={{ margin: "0 0 8px 0", fontSize: "1.1em" }}>
                    {product.name}
                  </h3>

                  <p
                    style={{
                      margin: "5px 0",
                      color: "#666",
                      fontSize: "0.9em",
                    }}
                  >
                    {product.category}
                  </p>

                  <p
                    style={{
                      fontSize: "1.2em",
                      fontWeight: "bold",
                      color: "var(--primary-color)",
                      margin: "10px 0",
                    }}
                  >
                    ₹{product.price}
                  </p>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <Link
                      to={`/product/${product._id}`}
                      style={{
                        flex: 1,
                        padding: "10px",
                        backgroundColor: "#007bff",
                        color: "white",
                        textAlign: "center",
                        borderRadius: "4px",
                        textDecoration: "none",
                        fontSize: "0.9em",
                      }}
                    >
                      ✏️ Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      style={{
                        flex: 1,
                        padding: "10px",
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "0.9em",
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default Marketplace;
