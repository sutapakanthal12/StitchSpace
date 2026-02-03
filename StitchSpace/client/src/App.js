import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";

// Common Pages
import Home from "./sections/common/Home";
import Marketplace from "./sections/common/Marketplace";

// Buyer Pages
import BuyerDashboard from "./sections/buyer/BuyerDashboard";
import BuyerOrders from "./sections/buyer/BuyerOrders";

// Artisan Pages
import ArtisanDashboard from "./sections/artisan/ArtisanDashboard";

// Learner Pages
import LearnerDashboard from "./sections/learner/LearnerDashboard";
import Workshops from "./sections/learner/Workshops";
import WorkshopDetail from "./sections/learner/WorkshopDetail";
import LearningInterface from "./sections/learner/LearningInterface";

// Community Pages
import Community from "./sections/common/Community";

// Shared Pages
import Product from "./pages/Product";
import ArtisanProfile from "./pages/ArtisanProfile";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import CheckoutProduct from "./pages/CheckoutProduct";
import Auth from "./pages/Auth";
import PrivateRoute from "./components/PrivateRoute";

function AppContent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get("/api/auth/me");
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/");
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="App">
      <Navigation user={user} onLogout={handleLogout} />
      <main className="main-content">
        <Routes>
          {/* Common & Marketplace Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth setUser={setUser} />} />
          <Route path="/marketplace" element={<Marketplace user={user} />} />
          <Route path="/product/:id" element={<Product user={user} />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/checkout"
            element={
              <PrivateRoute user={user}>
                <Checkout user={user} />
              </PrivateRoute>
            }
          />
          <Route
            path="/checkout/:productId"
            element={
              <PrivateRoute user={user}>
                <CheckoutProduct user={user} />
              </PrivateRoute>
            }
          />

          {/* Artisan Routes */}
          <Route path="/artisan-profile/:id" element={<ArtisanProfile />} />

          {/* Learner Routes - Per PDF Spec */}
          <Route path="/workshops" element={<Workshops />} />
          <Route
            path="/workshop/:id"
            element={<WorkshopDetail user={user} />}
          />
          <Route
            path="/learning/:id"
            element={
              <PrivateRoute user={user}>
                <LearningInterface user={user} />
              </PrivateRoute>
            }
          />

          {/* Community Routes */}
          <Route path="/community" element={<Community user={user} />} />

          {/* Buyer Routes */}
          <Route
            path="/buyer/orders"
            element={
              <PrivateRoute user={user}>
                <BuyerOrders user={user} />
              </PrivateRoute>
            }
          />

          {/* Dashboard - Role-based */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute user={user}>
                {user?.role === "buyer" && <BuyerDashboard user={user} />}
                {user?.role === "artisan" && <ArtisanDashboard user={user} />}
                {user?.role === "learner" && <LearnerDashboard user={user} />}
                {user?.role === "admin" && (
                  <div>Admin Dashboard (Coming Soon)</div>
                )}
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
