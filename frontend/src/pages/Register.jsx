import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Register.scss";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("❌ Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        fullname: {
          firstname: formData.firstname,
          lastname: formData.lastname,
        },
        email: formData.email,
        password: formData.password,
      };

      const res = await api.post("/auth/register", payload);

      console.log("✅ Registered Successfully:", res.data);
      alert("Registration Successful! Please Login.");

      navigate("/login");
    } catch (err) {
      console.error("Registration Error:", err);

      setError(
        err.response?.data?.message || "❌ Registration Failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>
          CORTEX <span>AI</span>
        </h2>
        <p className="subtitle">Join the future of intelligence.</p>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group row">
            <div className="input-wrapper" style={{ flex: 1 }}>
              <label>First Name</label>
              <input
                type="text"
                name="firstname"
                placeholder="Ex: Aman"
                value={formData.firstname}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-wrapper" style={{ flex: 1 }}>
              <label>Last Name</label>
              <input
                type="text"
                name="lastname"
                placeholder="Ex: Gupta"
                value={formData.lastname}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-wrapper">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="aman@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-wrapper">
              <label>Password</label>
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

          <div className="form-group">
            <div className="input-wrapper">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
