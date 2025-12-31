import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Login.scss";

const Login = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return alert("Please fill in all fields");
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/login", formData);

      console.log("✅ Logged In:", res.data);
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      navigate("/chat");
    } catch (error) {
      console.error("Login Error:", error);

      alert(
        error.response?.data?.message ||
          "Login Failed! Check email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>
          CORTEX <span>AI</span>
        </h2>
        <p className="subtitle">Log in to continue.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-wrapper">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Ex: aman@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-wrapper">
              <div className="label-row">
                <label>Password</label>
                <Link to="/forgot-password" className="forgot-link">
                  Forgot Password?
                </Link>
              </div>

              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Accessing System..." : "Access System"}
          </button>
        </form>

        <div className="auth-footer">
          New to the network? <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
