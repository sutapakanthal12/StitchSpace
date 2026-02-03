import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Marketplace.css";

function Marketplace() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    fairTrade: false,
    ecoFriendly: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append("category", filters.category);
      if (filters.fairTrade) params.append("fairTrade", "true");
      if (filters.ecoFriendly) params.append("ecoFriendly", "true");

      const response = await axios.get(`/api/products?${params}`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading products...</div>;

  return (
    <div className="marketplace-container">
      <h1 className="section-title">Handmade Marketplace</h1>

      <div className="marketplace-filters">
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">All Categories</option>
          <option value="Textiles">Textiles</option>
          <option value="Clothing">Clothing</option>
          <option value="Accessories">Accessories</option>
          <option value="Home Decor">Home Decor</option>
          <option value="Art Pieces">Art Pieces</option>
        </select>

        <label>
          <input
            type="checkbox"
            checked={filters.fairTrade}
            onChange={(e) =>
              setFilters({ ...filters, fairTrade: e.target.checked })
            }
          />
          Fair Trade Only
        </label>

        <label>
          <input
            type="checkbox"
            checked={filters.ecoFriendly}
            onChange={(e) =>
              setFilters({ ...filters, ecoFriendly: e.target.checked })
            }
          />
          Eco-Friendly Only
        </label>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <Link
            key={product._id}
            to={`/products/${product._id}`}
            className="product-card card"
          >
            <div className="product-image">
              {product.images?.[0] ? (
                <img src={product.images[0]} alt={product.name} />
              ) : (
                <div className="placeholder">🎨</div>
              )}
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="artist">{product.artist?.name}</p>
              <div className="product-badges">
                {product.fairTradeCertified && (
                  <span className="badge badge-success">Fair Trade</span>
                )}
                {product.ecoFriendly && (
                  <span className="badge badge-success">Eco-Friendly</span>
                )}
              </div>
              <div className="product-footer">
                <span className="price">${product.price}</span>
                <span className="rating">
                  {product.averageRating.toFixed(1)} ⭐
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {products.length === 0 && (
        <div className="empty-state">
          <p>No products found matching your filters.</p>
        </div>
      )}
    </div>
  );
}

export default Marketplace;
