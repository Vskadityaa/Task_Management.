import express from "express";
import { signup, login } from "../Controllers/AuthController.js";
import { signupValidation, loginValidation } from "../Middlewares/AuthValidation.js";

const router = express.Router();

router.post("/signup", signupValidation, signup);
router.post("/login", loginValidation, login);

export default router;
