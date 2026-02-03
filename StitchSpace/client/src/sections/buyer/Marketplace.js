import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Marketplace() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    craftType: "All",
    priceMin: 0,
    priceMax: 10000,
    sustainable: false,
    fairTrade: false,
    search: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

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

  const applyFilters = () => {
    let filtered = [...products];

    // Craft type filter (Embroidery, Weaving, Dyeing, etc.)
    if (filters.craftType !== "All") {
      filtered = filtered.filter((p) => p.category === filters.craftType);
    }

    // Price filter
    filtered = filtered.filter(
      (p) => p.price >= filters.priceMin && p.price <= filters.priceMax
    );

    // Eco-friendly filter (Sustainable)
    if (filters.sustainable) {
      filtered = filtered.filter((p) => p.ecoFriendly);
    }

    // Fair trade filter
    if (filters.fairTrade) {
      filtered = filtered.filter((p) => p.fairTradeCertified);
    }

    // Search filter
    if (filters.search) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("✅ Added to cart!");
  };

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
        {/* Filters Sidebar - Per PDF Spec */}
        <div
          className="card"
          style={{
            padding: "20px",
            height: "fit-content",
            backgroundColor: "#fafafa",
          }}
        >
          <h3 style={{ marginTop: 0 }}>🔍 Filters</h3>

          {/* Search Box */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                fontWeight: "bold",
                display: "block",
                marginBottom: "8px",
                fontSize: "0.9em",
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
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ddd",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Craft Type Filter - Per PDF */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                fontWeight: "bold",
                display: "block",
                marginBottom: "8px",
                fontSize: "0.9em",
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
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ddd",
                boxSizing: "border-box",
              }}
            >
              <option value="All">All Crafts</option>
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

          {/* Price Filter - Per PDF */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                fontWeight: "bold",
                display: "block",
                marginBottom: "8px",
                fontSize: "0.9em",
              }}
            >
              Price Range
            </label>
            <div style={{ marginBottom: "10px" }}>
              <input
                type="range"
                min="0"
                max="10000"
                value={filters.priceMax}
                onChange={(e) =>
                  setFilters({ ...filters, priceMax: parseInt(e.target.value) })
                }
                style={{ width: "100%" }}
              />
              <p
                style={{
                  color: "#666",
                  fontSize: "0.9em",
                  margin: "8px 0 0 0",
                }}
              >
                ${filters.priceMin} - ${filters.priceMax}
              </p>
            </div>
          </div>

          {/* Sustainable / Eco-Friendly Filter - Per PDF */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                fontSize: "0.95em",
              }}
            >
              <input
                type="checkbox"
                checked={filters.sustainable}
                onChange={(e) =>
                  setFilters({ ...filters, sustainable: e.target.checked })
                }
                style={{ marginRight: "10px", width: "18px", height: "18px" }}
              />
              <span>🌱 Sustainable / Eco-Friendly</span>
            </label>
          </div>

          {/* Fair Trade Filter - Per PDF */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                fontSize: "0.95em",
              }}
            >
              <input
                type="checkbox"
                checked={filters.fairTrade}
                onChange={(e) =>
                  setFilters({ ...filters, fairTrade: e.target.checked })
                }
                style={{ marginRight: "10px", width: "18px", height: "18px" }}
              />
              <span>🏅 Fair Trade Certified</span>
            </label>
          </div>

          <button
            className="btn"
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
            style={{ width: "100%", marginTop: "10px" }}
          >
            Reset Filters
          </button>
        </div>

        {/* Products Grid */}
        <div>
          {filteredProducts.length === 0 ? (
            <p style={{ textAlign: "center", color: "#999", padding: "40px" }}>
              No products found. Try adjusting your filters!
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: "20px",
              }}
            >
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="card"
                  style={{
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Product Image */}
                  <img
                    src={
                      product.images?.[0] ||
                      "https://via.placeholder.com/240x200"
                    }
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />

                  {/* Product Info */}
                  <div
                    style={{
                      padding: "15px",
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <h3 style={{ margin: "0 0 8px 0", fontSize: "1.1em" }}>
                      {product.name}
                    </h3>

                    {/* Artisan Name - Per PDF */}
                    <p
                      style={{
                        margin: "0 0 10px 0",
                        color: "#999",
                        fontSize: "0.9em",
                      }}
                    >
                      by{" "}
                      <strong>
                        {product.artist?.name || "Unknown Artisan"}
                      </strong>
                    </p>

                    {/* Badges - Sustainability - Per PDF */}
                    <div
                      style={{
                        marginBottom: "10px",
                        display: "flex",
                        gap: "8px",
                        flexWrap: "wrap",
                      }}
                    >
                      {product.ecoFriendly && (
                        <span
                          style={{
                            backgroundColor: "#E8F5E9",
                            color: "#2E7D32",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "0.75em",
                            fontWeight: "bold",
                          }}
                        >
                          🌱 Eco-Friendly
                        </span>
                      )}
                      {product.fairTradeCertified && (
                        <span
                          style={{
                            backgroundColor: "#F3E5F5",
                            color: "#6A1B9A",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "0.75em",
                            fontWeight: "bold",
                          }}
                        >
                          🏅 Fair Trade
                        </span>
                      )}
                    </div>

                    {/* Price */}
                    <p
                      style={{
                        margin: "auto 0 15px 0",
                        fontSize: "1.4em",
                        fontWeight: "bold",
                        color: "var(--primary-color)",
                      }}
                    >
                      ${product.price}
                    </p>

                    {/* Buttons - Buy Now & Request Custom - Per PDF */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "8px",
                      }}
                    >
                      <Link
                        to={`/product/${product._id}`}
                        className="btn btn-primary"
                        style={{
                          textAlign: "center",
                          padding: "10px",
                          textDecoration: "none",
                          fontSize: "0.95em",
                        }}
                      >
                        Buy Now
                      </Link>
                      <button
                        className="btn"
                        onClick={() => addToCart(product)}
                        style={{ padding: "10px", fontSize: "0.95em" }}
                        title="Request custom order"
                      >
                        ✉️ Custom
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

export default Marketplace;
