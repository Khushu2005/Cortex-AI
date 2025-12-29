import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowLeft, Key } from "lucide-react";
import api from "../services/api";
import "./ForgotPassword.scss";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState("email");
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) return alert("Email to daal bhai!");

    setLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", { email });
      alert(res.data.message);
      setStep("otp");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (!otp) return alert("OTP kon dalega?");
    setStep("reset");
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/reset-password-otp", {
        email: email,
        otp: otp,
        newPassword: newPassword,
      });

      alert(res.data.message);
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  const slideAnimation = {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 20, opacity: 0 },
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <AnimatePresence mode="wait">
          {step === "email" && (
            <motion.div key="step1" {...slideAnimation}>
              <div className="icon-header">
                <Mail size={28} />
              </div>
              <h2>Find Account</h2>
              <p className="desc">
                Enter your email to receive a verification code.
              </p>

              <form onSubmit={handleEmailSubmit}>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button className="action-btn" disabled={loading}>
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>
              </form>
            </motion.div>
          )}

          {step === "otp" && (
            <motion.div key="step2" {...slideAnimation}>
              <div className="icon-header">
                <Key size={28} />
              </div>
              <h2>Enter OTP</h2>
              <p className="desc">
                We sent a code to <b>{email}</b>
              </p>

              <form onSubmit={handleOtpSubmit}>
                <div className="form-group">
                  <label>Verification Code</label>
                  <input
                    type="number"
                    placeholder="1234"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    style={{
                      letterSpacing: "4px",
                      textAlign: "center",
                      fontSize: "1.2rem",
                    }}
                  />
                </div>
                <button className="action-btn">Verify & Proceed</button>
                <div style={{ marginTop: "15px", textAlign: "center" }}>
                  <span
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--text-secondary)",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                    onClick={() => setStep("email")}
                  >
                    Wrong email? Change it
                  </span>
                </div>
              </form>
            </motion.div>
          )}

          {step === "reset" && (
            <motion.div key="step3" {...slideAnimation}>
              <div className="icon-header">
                <Lock size={28} />
              </div>
              <h2>Reset Password</h2>
              <p className="desc">Create a strong password.</p>

              <form onSubmit={handleResetPassword}>
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <button className="action-btn" disabled={loading}>
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <Link to="/login" className="back-link">
          <ArrowLeft
            size={14}
            style={{ display: "inline", marginRight: "5px" }}
          />
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
