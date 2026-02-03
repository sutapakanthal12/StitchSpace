import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUser, FaSearch } from "react-icons/fa";
import "./Navigation.css";

function Navigation({ user, onLogout }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?search=${searchQuery}`);
      setSearchQuery("");
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    setDropdownOpen(false);
    onLogout();
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🧵</span>
          StitchSpace
        </Link>

        <div className="navbar-menu">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/workshops" className="nav-link">
            Workshops
          </Link>
          <Link to="/marketplace" className="nav-link">
            Marketplace
          </Link>
          <Link to="/community" className="nav-link">
            Community
          </Link>
        </div>

        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search crafts, artisans..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">
            <FaSearch />
          </button>
        </form>

        <div className="navbar-right">
          <Link to="/cart" className="nav-icon">
            <FaShoppingCart title="Cart" />
          </Link>

          {user ? (
            <div className="user-menu">
              <button className="user-btn" onClick={toggleDropdown}>
                <FaUser /> {user.name}
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu dropdown-open">
                  <Link to="/dashboard" onClick={closeDropdown}>
                    Dashboard
                  </Link>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth" className="btn-primary">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
