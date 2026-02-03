import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function Product({ user }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!product) return <div className="loading">Product not found</div>;

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart!");
  };

  return (
    <div className="product-detail">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div>
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              style={{ width: "100%", borderRadius: "8px" }}
            />
          ) : (
            <div
              style={{
                background: "var(--accent-color)",
                height: "400px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "6rem",
                borderRadius: "8px",
              }}
            >
              🎨
            </div>
          )}
        </div>
        <div>
          <h1>{product.name}</h1>
          <p>
            by <strong>{product.artist?.name}</strong>
          </p>
          <h2
            style={{
              color: "var(--primary-color)",
              fontSize: "2rem",
              margin: "20px 0",
            }}
          >
            ${product.price}
          </h2>
          <p>{product.description}</p>
          {product.artisanStory && (
            <div>
              <h3>Artisan's Story</h3>
              <p>{product.artisanStory}</p>
            </div>
          )}
          <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
            {product.fairTradeCertified && (
              <span className="badge badge-success">Fair Trade Certified</span>
            )}
            {product.ecoFriendly && (
              <span className="badge badge-success">Eco-Friendly</span>
            )}
          </div>
          <button
            className="btn btn-primary"
            onClick={addToCart}
            style={{ marginTop: "20px", width: "100%" }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default Product;
