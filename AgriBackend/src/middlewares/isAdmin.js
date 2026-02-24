const User = require("../models/User");

const isAdmin = async (req, res, next) => {
    try {
        const userId = req.body.userId || req.query.userId || req.user.id; // Adapt based on how you handle auth

        // Ideally, req.user should be populated by your auth middleware (verifyToken)
        // If you haven't attached user to req yet, you might need to find them or rely on verifyToken

        if (!req.user || !req.user.id) {
            return res.status(403).json({ message: "Access denied. No user found." });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error checking admin status" });
    }
};

module.exports = isAdmin;
