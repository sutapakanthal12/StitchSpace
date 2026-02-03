import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ArtisanProfile() {
  const { id } = useParams();
  const [artisan, setArtisan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArtisan();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchArtisan = async () => {
    try {
      const response = await axios.get(`/api/users/${id}`);
      setArtisan(response.data);
    } catch (error) {
      console.error("Error fetching artisan:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!artisan) return <div className="loading">Artisan not found</div>;

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <div
        className="card"
        style={{ padding: "40px", textAlign: "center", marginBottom: "40px" }}
      >
        <div style={{ fontSize: "5rem", marginBottom: "20px" }}>👤</div>
        <h1>{artisan.name}</h1>
        <p
          style={{
            color: "var(--primary-color)",
            fontSize: "1.2rem",
            marginBottom: "10px",
          }}
        >
          {artisan.role}
        </p>
        {artisan.bio && <p>{artisan.bio}</p>}
        {artisan.location && <p>📍 {artisan.location}</p>}
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}
      >
        <div>
          <h2>Workshops ({artisan.workshops?.length || 0})</h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            {artisan.workshops?.map((workshop) => (
              <div
                key={workshop._id}
                className="card"
                style={{ padding: "15px" }}
              >
                <h4>{workshop.title}</h4>
                <p>${workshop.price}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2>Products ({artisan.products?.length || 0})</h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            {artisan.products?.map((product) => (
              <div
                key={product._id}
                className="card"
                style={{ padding: "15px" }}
              >
                <h4>{product.name}</h4>
                <p>${product.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArtisanProfile;
