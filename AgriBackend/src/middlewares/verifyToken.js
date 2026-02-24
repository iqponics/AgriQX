const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                error: "Access denied",
                message: "No authorization header provided"
            });
        }

        // Check if it's a Bearer token
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({
                error: "Access denied",
                message: "Invalid authorization header format. Use: Bearer <token>"
            });
        }

        const token = parts[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user info to request
        req.user = {
            id: decoded.id || decoded._id,
            email: decoded.email,
            username: decoded.username
        };

        next();
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                error: "Access denied",
                message: "Invalid token"
            });
        }

        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: "Access denied",
                message: "Token expired"
            });
        }

        return res.status(500).json({
            error: "Internal server error",
            message: "Failed to authenticate token"
        });
    }
};

module.exports = verifyToken;
