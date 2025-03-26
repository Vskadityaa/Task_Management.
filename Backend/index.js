import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import AuthRouter from "./Routes/AuthRouter.js";  
import AdminRouter from "./Routes/adminRoutes.js";  
import ProductRouter from "./Routes/ProductRouter.js";  

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error("❌ MongoDB Connection Error: Missing MONGO_URI in .env file");
    process.exit(1);
}

// ✅ Connect to MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
});

app.use(express.json()); // ✅ Use express.json() instead of bodyParser.json()
app.use(cors({ origin: "http://localhost:3000", credentials: true })); // ✅ Allow frontend requests

// ✅ Register Routes
app.use("/auth", AuthRouter);
app.use("/admin", AdminRouter);
app.use("/products", ProductRouter);

// ✅ Health Check Route
app.get("/ping", (req, res) => {
    res.send("✅ Server is running!");
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
