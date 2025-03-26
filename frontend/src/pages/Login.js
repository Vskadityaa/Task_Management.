import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";

const Login = () => {
  const [loginInfo, setLoginInfo] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginInfo({ ...loginInfo, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!loginInfo.email || !loginInfo.password) {
      handleError("⚠️ Email and password are required");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginInfo),
      });

      const result = await response.json();
      console.log("API Response:", result);

      if (result.success && result.token) {
        // ✅ Store Token & Role in Local Storage
        localStorage.setItem("token", result.token);
        localStorage.setItem("loggedInUser", result.user.name);
        localStorage.setItem("role", result.user.role || "user"); // Default to "user" if role is missing

        handleSuccess("✅ Login Successful!");

        // ✅ Redirect Based on Role
        setTimeout(() => {
          navigate(result.user.role === "admin" ? "/admin-dashboard" : "/");
        }, 500);
      } else {
        handleError(result.message || "❌ Login failed.");
      }
    } catch (err) {
      handleError("🚨 An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = () => {
    setLoginInfo({
      email: "admin@example.com",
      password: "Admin@123",
    });
  };

  return (
    <div className="login-page">
      <div className="welcome-text">👋 Welcome Back!</div>
      <div className="container">
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              onChange={handleChange}
              type="email"
              name="email"
              placeholder="📧 Enter your email..."
              value={loginInfo.email}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              onChange={handleChange}
              type="password"
              name="password"
              placeholder="🔒 Enter your password..."
              value={loginInfo.password}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "⏳ Logging in..." : "🔑 Login"}
          </button>
          <button
            type="button"
            className="admin-login-button"
            onClick={handleAdminLogin}
          >
            👑 Admin Login
          </button>
          <span>
            Don't have an account? <Link to="/signup">Signup</Link>
          </span>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Login;
