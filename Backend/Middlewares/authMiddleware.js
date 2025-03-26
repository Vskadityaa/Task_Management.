import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
    const token = req.cookies?.token || req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ success: false, message: "Access Denied. No token provided." });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
        req.user = verified;
        next();
    } catch (err) {
        res.status(403).json({ success: false, message: "Invalid Token" });
    }
};

export const verifyAdmin = (req, res, next) => {
    authenticateToken(req, res, () => {
        if (req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Access Denied. Admins only." });
        }
        next();
    });
};
