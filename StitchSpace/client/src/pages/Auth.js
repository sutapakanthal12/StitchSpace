import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Auth({ setUser }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "learner",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const response = await axios.post(endpoint, formData);

      localStorage.setItem("token", response.data.token);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;
      setUser(response.data.user);

      // Redirect to role-specific marketplace view
      const user = response.data.user;
      if (user.role === "learner") {
        navigate("/marketplace?view=learn");
      } else if (user.role === "buyer") {
        navigate("/marketplace?view=buy");
      } else if (user.role === "artisan") {
        navigate("/marketplace?view=manage");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Error");
    }
  };

  return (
    <div
      style={{ maxWidth: "400px", margin: "60px auto", textAlign: "center" }}
    >
      <h1>{isLogin ? "Login" : "Register"}</h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        {!isLogin && (
          <div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            />
          </div>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        />

        {!isLogin && (
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
          >
            <option value="learner">Learner</option>
            <option value="buyer">Buyer</option>
            <option value="artisan">Artisan</option>
          </select>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: "100%", padding: "12px" }}
        >
          {isLogin ? "Login" : "Register"}
        </button>
      </form>

      <p style={{ marginTop: "20px" }}>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          style={{
            background: "none",
            border: "none",
            color: "var(--primary-color)",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          {isLogin ? "Register" : "Login"}
        </button>
      </p>
    </div>
  );
}

export default Auth;
