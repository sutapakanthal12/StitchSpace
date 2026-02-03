import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Workshops() {
  const [workshops, setWorkshops] = useState([]);
  const [filteredWorkshops, setFilteredWorkshops] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    skillLevel: "All",
    craftType: "All",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkshops();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [workshops, filters]);

  const fetchWorkshops = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/workshops");
      setWorkshops(response.data);
    } catch (error) {
      console.error("Error fetching workshops:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = workshops;

    // Search filter
    if (filters.search) {
      result = result.filter(
        (w) =>
          w.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          w.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Skill level filter
    if (filters.skillLevel !== "All") {
      result = result.filter((w) => w.level === filters.skillLevel);
    }

    // Craft type filter
    if (filters.craftType !== "All") {
      result = result.filter((w) => w.category === filters.craftType);
    }

    setFilteredWorkshops(result);
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      skillLevel: "All",
      craftType: "All",
    });
  };

  const craftTypes = [
    "Embroidery",
    "Weaving",
    "Dyeing",
    "Textiles",
    "Clothing",
    "Accessories",
    "Home Decor",
    "Art Pieces",
  ];

  const skillLevels = ["Beginner", "Intermediate", "Advanced"];

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        Loading workshops...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px" }}>
      <h1>🎓 Explore Workshops</h1>
      <p style={{ color: "#666", marginBottom: "30px" }}>
        Learn traditional textile skills from experienced artisans
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: "30px",
        }}
      >
        {/* FILTER SIDEBAR - Per PDF Spec */}
        <div style={{ position: "sticky", top: "20px", height: "fit-content" }}>
          <div className="card" style={{ padding: "20px" }}>
            <h3 style={{ marginTop: "0" }}>🔍 Filters</h3>

            {/* Search */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Search Workshops
              </label>
              <input
                type="text"
                placeholder="Workshop name..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Skill Level - Per PDF */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: "10px",
                }}
              >
                Skill Level
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "8px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="skillLevel"
                  value="All"
                  checked={filters.skillLevel === "All"}
                  onChange={(e) =>
                    handleFilterChange("skillLevel", e.target.value)
                  }
                  style={{ marginRight: "8px" }}
                />
                <span>All Levels</span>
              </label>
              {skillLevels.map((level) => (
                <label
                  key={level}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "8px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    name="skillLevel"
                    value={level}
                    checked={filters.skillLevel === level}
                    onChange={(e) =>
                      handleFilterChange("skillLevel", e.target.value)
                    }
                    style={{ marginRight: "8px" }}
                  />
                  <span>{level}</span>
                </label>
              ))}
            </div>

            {/* Craft Type - Per PDF */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: "10px",
                }}
              >
                Craft Type
              </label>
              <select
                value={filters.craftType}
                onChange={(e) =>
                  handleFilterChange("craftType", e.target.value)
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
                {craftTypes.map((craft) => (
                  <option key={craft} value={craft}>
                    {craft}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Button */}
            <button
              className="btn"
              onClick={resetFilters}
              style={{ width: "100%", padding: "10px" }}
            >
              ↺ Reset Filters
            </button>
          </div>
        </div>

        {/* WORKSHOPS GRID */}
        <div>
          <div style={{ marginBottom: "20px", color: "#666" }}>
            Showing {filteredWorkshops.length} of {workshops.length} workshops
          </div>

          {filteredWorkshops.length === 0 ? (
            <div
              className="card"
              style={{ padding: "40px", textAlign: "center" }}
            >
              <p
                style={{
                  fontSize: "1.1em",
                  color: "#666",
                  marginBottom: "20px",
                }}
              >
                No workshops found matching your filters. 📚
              </p>
              <button className="btn btn-primary" onClick={resetFilters}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "20px",
              }}
            >
              {filteredWorkshops.map((workshop) => (
                <div
                  key={workshop._id}
                  className="card"
                  style={{
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Workshop Image/Header */}
                  <div
                    style={{
                      height: "180px",
                      backgroundColor: "var(--primary-color)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "3em",
                    }}
                  >
                    🎨
                  </div>

                  <div
                    style={{
                      padding: "15px",
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* Title */}
                    <h3 style={{ margin: "0 0 10px 0" }}>
                      <Link
                        to={`/workshop/${workshop._id}`}
                        style={{
                          color: "var(--primary-color)",
                          textDecoration: "none",
                        }}
                      >
                        {workshop.title}
                      </Link>
                    </h3>

                    {/* Artisan Name - Per PDF */}
                    <p
                      style={{
                        margin: "0 0 10px 0",
                        fontSize: "0.95em",
                        color: "#666",
                      }}
                    >
                      👨‍🏫{" "}
                      <strong>
                        {workshop.artisan?.name || "Unknown Artisan"}
                      </strong>
                    </p>

                    {/* Skill Level - Per PDF */}
                    <p
                      style={{
                        margin: "0 0 5px 0",
                        fontSize: "0.9em",
                        color: "#666",
                      }}
                    >
                      📚 Level: <strong>{workshop.level}</strong>
                    </p>

                    {/* Duration - Per PDF */}
                    <p
                      style={{
                        margin: "0 0 10px 0",
                        fontSize: "0.9em",
                        color: "#666",
                      }}
                    >
                      ⏱️ Duration: <strong>{workshop.duration}</strong>
                    </p>

                    {/* Description */}
                    <p
                      style={{
                        margin: "0 0 15px 0",
                        fontSize: "0.9em",
                        color: "#666",
                        flex: 1,
                      }}
                    >
                      {workshop.description.substring(0, 80)}...
                    </p>

                    {/* Price and Buttons */}
                    <div style={{ marginTop: "auto" }}>
                      <p
                        style={{
                          fontSize: "1.3em",
                          fontWeight: "bold",
                          color: "var(--primary-color)",
                          margin: "0 0 10px 0",
                        }}
                      >
                        ${workshop.price}
                      </p>
                      <Link
                        to={`/workshop/${workshop._id}`}
                        className="btn btn-primary"
                        style={{
                          width: "100%",
                          textDecoration: "none",
                          textAlign: "center",
                          display: "block",
                        }}
                      >
                        View Details
                      </Link>
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

export default Workshops;
