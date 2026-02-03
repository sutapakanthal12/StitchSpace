import React from "react";
import { Link } from "react-router-dom";
import "../../pages/Home.css";

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "60px 20px",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "3.5em", marginBottom: "20px" }}>
            🧵 StitchSpace
          </h1>
          <p style={{ fontSize: "1.5em", color: "#666", marginBottom: "30px" }}>
            Where Hands Create, Minds Connect
          </p>
          <p
            style={{
              fontSize: "1.1em",
              color: "#999",
              maxWidth: "600px",
              margin: "0 auto 40px",
            }}
          >
            A platform connecting conscious buyers with skilled artisans and
            learners. Support traditional crafts, shop handmade, and learn
            textile skills.
          </p>
          <div
            style={{
              display: "flex",
              gap: "20px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              to="/marketplace"
              className="btn btn-primary"
              style={{ padding: "15px 40px", fontSize: "1.1em" }}
            >
              🛍️ Shop Now
            </Link>
            <Link
              to="/workshops"
              className="btn"
              style={{ padding: "15px 40px", fontSize: "1.1em" }}
            >
              📚 Learn Crafts
            </Link>
          </div>
        </div>
      </section>

      {/* Three Sections */}
      <section style={{ padding: "60px 20px", backgroundColor: "#f5f5f5" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2
            style={{
              textAlign: "center",
              marginBottom: "50px",
              fontSize: "2.5em",
            }}
          >
            How StitchSpace Works
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "40px",
            }}
          >
            {/* Buyer Card */}
            <div
              className="card"
              style={{ padding: "30px", textAlign: "center" }}
            >
              <div style={{ fontSize: "4em", marginBottom: "20px" }}>🛒</div>
              <h3 style={{ fontSize: "1.8em", marginBottom: "15px" }}>
                For Buyers
              </h3>
              <p style={{ marginBottom: "20px", color: "#666" }}>
                Discover handmade products from skilled artisans. Shop with
                purpose and support traditional crafts.
              </p>
              <ul
                style={{
                  textAlign: "left",
                  marginBottom: "20px",
                  color: "#999",
                }}
              >
                <li>✅ Browse curated handmade products</li>
                <li>✅ Support fair trade artisans</li>
                <li>✅ Shop eco-friendly items</li>
                <li>✅ Secure checkout</li>
                <li>✅ Track your orders</li>
              </ul>
              <Link to="/marketplace" className="btn btn-primary">
                Start Shopping
              </Link>
            </div>

            {/* Artisan Card */}
            <div
              className="card"
              style={{ padding: "30px", textAlign: "center" }}
            >
              <div style={{ fontSize: "4em", marginBottom: "20px" }}>🎨</div>
              <h3 style={{ fontSize: "1.8em", marginBottom: "15px" }}>
                For Artisans
              </h3>
              <p style={{ marginBottom: "20px", color: "#666" }}>
                Sell your handmade creations and teach others. Build your brand
                and earn from your skills.
              </p>
              <ul
                style={{
                  textAlign: "left",
                  marginBottom: "20px",
                  color: "#999",
                }}
              >
                <li>✅ Sell handmade products</li>
                <li>✅ Create & teach workshops</li>
                <li>✅ Build your public profile</li>
                <li>✅ Reach global buyers</li>
                <li>✅ Track sales & earnings</li>
              </ul>
              <a href="/auth" className="btn btn-primary">
                Join as Artisan
              </a>
            </div>

            {/* Learner Card */}
            <div
              className="card"
              style={{ padding: "30px", textAlign: "center" }}
            >
              <div style={{ fontSize: "4em", marginBottom: "20px" }}>📚</div>
              <h3 style={{ fontSize: "1.8em", marginBottom: "15px" }}>
                For Learners
              </h3>
              <p style={{ marginBottom: "20px", color: "#666" }}>
                Learn traditional textile skills from expert artisans. Master
                crafts and create beautiful pieces.
              </p>
              <ul
                style={{
                  textAlign: "left",
                  marginBottom: "20px",
                  color: "#999",
                }}
              >
                <li>✅ Learn from skilled artisans</li>
                <li>✅ Beginner to advanced courses</li>
                <li>✅ Video lessons & resources</li>
                <li>✅ Track your progress</li>
                <li>✅ Earn certificates (soon)</li>
              </ul>
              <Link to="/workshops" className="btn btn-primary">
                Browse Workshops
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Artisans */}
      <section style={{ padding: "60px 20px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{ marginBottom: "40px", fontSize: "2em" }}>
            Featured Artisans
          </h2>
          <p style={{ color: "#999", marginBottom: "30px" }}>
            Meet the talented creators behind our products
          </p>
          <p>Featured artisans section coming soon! 🎨</p>
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          padding: "60px 20px",
          backgroundColor: "var(--primary-color)",
          color: "white",
        }}
      >
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}
        >
          <h2 style={{ fontSize: "2.5em", marginBottom: "20px" }}>
            Ready to Join StitchSpace?
          </h2>
          <p style={{ fontSize: "1.2em", marginBottom: "30px" }}>
            Whether you want to shop, sell, or learn - we have a place for you!
          </p>
          <div
            style={{
              display: "flex",
              gap: "20px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              to="/auth"
              className="btn"
              style={{
                backgroundColor: "white",
                color: "var(--primary-color)",
              }}
            >
              Register Now
            </Link>
            <Link to="/auth" className="btn">
              Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
