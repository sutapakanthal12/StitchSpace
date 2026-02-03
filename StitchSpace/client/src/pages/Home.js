import React from "react";
import { Link } from "react-router-dom";
import {
  FaGraduationCap,
  FaShoppingBag,
  FaUsers,
  FaLeaf,
} from "react-icons/fa";
import "./Home.css";

function Home() {
  const features = [
    {
      icon: <FaGraduationCap />,
      title: "Learning Hub",
      description:
        "Learn authentic textile techniques from world-class artisans through interactive workshops.",
    },
    {
      icon: <FaShoppingBag />,
      title: "Marketplace",
      description:
        "Discover and purchase unique, handmade creations directly from talented artisans.",
    },
    {
      icon: <FaUsers />,
      title: "Community",
      description:
        "Connect with fellow crafts enthusiasts, share your creations, and collaborate.",
    },
    {
      icon: <FaLeaf />,
      title: "Sustainability",
      description:
        "Support ethical artisans and eco-friendly creations with transparent supply chains.",
    },
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Where Hands Create, Minds Connect</h1>
          <p>
            StitchSpace bridges tradition and the digital age, connecting
            artisans, learners, and conscious buyers through the art of textile
            craftsmanship.
          </p>
          <div className="hero-buttons">
            <Link to="/workshops" className="btn btn-primary">
              Explore Workshops
            </Link>
            <Link to="/marketplace" className="btn btn-secondary">
              Shop Handmade
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="craft-illustration">🧵 ✨ 🎨</div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="section-title">Why StitchSpace?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-content">
          <h2>Ready to Join the Creative Community?</h2>
          <p>
            Whether you're an artisan looking to share your craft or a learner
            eager to create, StitchSpace welcomes you.
          </p>
          <Link to="/auth" className="btn btn-primary btn-large">
            Get Started
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stat-box">
          <h3>500+</h3>
          <p>Artisans</p>
        </div>
        <div className="stat-box">
          <h3>2000+</h3>
          <p>Learners</p>
        </div>
        <div className="stat-box">
          <h3>5000+</h3>
          <p>Handmade Products</p>
        </div>
        <div className="stat-box">
          <h3>100+</h3>
          <p>Active Workshops</p>
        </div>
      </section>
    </div>
  );
}

export default Home;
