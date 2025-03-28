import jwt from "jsonwebtoken";

// ✅ Middleware: Authenticate Token
export const authenticateToken = (req, res, next) => {
    try {
        // Extract token from cookies or Authorization header
        const token = req.cookies?.token || req.header("Authorization")?.split(" ")[1];

        // If token is not found, return an unauthorized error
        if (!token) {
            return res.status(401).json({ success: false, message: "Access Denied. No token provided." });
        }

        // Verify the token using JWT Secret
        const verified = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
        req.user = verified; // Attach the verified user data to the request object
        next(); // Continue to the next middleware or route handler
    } catch (err) {
        console.error("Token verification failed:", err);
        return res.status(403).json({ success: false, message: "Invalid or expired token." });
    }
};

// ✅ Middleware: Verify Admin Access
export const verifyAdmin = (req, res, next) => {
    // First authenticate token, then check if the user is an admin
    authenticateToken(req, res, () => {
        if (!req.user || req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Access Denied. Admins only." });
        }
        next(); // Continue to the next middleware or route handler if the user is an admin
    });
};
