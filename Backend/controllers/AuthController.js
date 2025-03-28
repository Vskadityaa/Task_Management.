import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Ensure correct path for User model
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// User Signup
export const signupUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already registered." });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || "user", // Default role to "user" if not provided
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: "User registered successfully!",
        });

    } catch (error) {
        console.error("❌ Signup error:", error); // Log detailed error
        res.status(500).json({ success: false, message: "Server error. Please try again.", error: error.message });
    }
};

// User Login
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }

        // Generate JWT Token with user details
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION || "1d" } // Default to 1 day
        );

        res.json({
            success: true,
            message: "Login successful.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        });

    } catch (error) {
        console.error("❌ Login error:", error); // Log detailed error
        res.status(500).json({ success: false, message: "Server error. Please try again.", error: error.message });
    }
};

// Get Current User (Protected Route)
export const getCurrentUser = async (req, res) => {
    try {
        // Fetch user details by ID, excluding password
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        res.json({
            success: true,
            user
        });

    } catch (error) {
        console.error("❌ Error fetching current user:", error); // Log detailed error
        res.status(500).json({ success: false, message: "Server error. Please try again.", error: error.message });
    }
};
