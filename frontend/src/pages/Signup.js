import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";

function Signup() {
    const [signupInfo, setSignupInfo] = useState({
        name: "",
        email: "",
        password: "",
        role: "user", // ✅ Default role is "user"
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignupInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (loading) return;

        const { name, email, password, role } = signupInfo;

        if (!name || !email || !password) {
            return handleError("⚠️ Name, email, and password are required");
        }

        try {
            setLoading(true);
            const response = await fetch("http://localhost:5000/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(signupInfo), // ✅ Send role
            });

            const result = await response.json();
            console.log("📢 Signup Response:", result);

            if (result.success) {
                handleSuccess("✅ Signup successful! Redirecting...");
                setTimeout(() => navigate("/login"), 1500);
            } else {
                handleError(result.message || "Signup failed. Try again.");
            }
        } catch (err) {
            handleError("🚨 Network error. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h1>Signup</h1>
            <form onSubmit={handleSignup}>
                <div>
                    <label htmlFor="name">Name</label>
                    <input
                        onChange={handleChange}
                        type="text"
                        name="name"
                        autoFocus
                        placeholder="Enter your name..."
                        value={signupInfo.name}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        onChange={handleChange}
                        type="email"
                        name="email"
                        placeholder="Enter your email..."
                        value={signupInfo.email}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        onChange={handleChange}
                        type="password"
                        name="password"
                        placeholder="Enter your password..."
                        value={signupInfo.password}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="role">Select Role</label>
                    <select name="role" onChange={handleChange} value={signupInfo.role}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Signing up..." : "Signup"}
                </button>
                <span>Already have an account? <Link to="/login">Login</Link></span>
            </form>
            <ToastContainer />
        </div>
    );
}

export default Signup;
