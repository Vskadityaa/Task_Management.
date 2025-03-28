import express from "express";
import { signupUser, loginUser, getCurrentUser } from "../controllers/AuthController.js";
import authMiddleware from "../middlewares/authMiddleware.js"; // Ensure this middleware exists

const router = express.Router();

// User Signup Route
router.post("/signup", signupUser);

// User Login Route
router.post("/login", loginUser);

// Get Current User (Protected Route)
router.get("/me", authMiddleware, getCurrentUser);

export default router;
