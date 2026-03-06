const userRepository = require('../repositories/userRepository');
const postRepository = require('../repositories/postRepository');

const adminController = {
    getStats: async (req, res) => {
        try {
            // We need countDocuments. I'll add them to repositories or use models directly if repo doesn't have it.
            // For efficiency, I'll use the models directly for counts to keep code exact.
            const User = require('../models/User');
            const Post = require('../models/Post');

            const Product = require('../models/Product');

            const totalUsers = await User.countDocuments();
            const totalVendors = await User.countDocuments({ role: 'vendor' });
            const totalProducts = await Product.countDocuments();
            const pendingProductsCount = await Product.countDocuments({
                $or: [{ status: 'pending' }, { status: { $exists: false } }]
            });

            const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select("firstname lastname emailId createdAt");

            res.status(200).json({
                totalUsers,
                totalVendors,
                totalProducts,
                pendingProductsCount,
                recentUsers
            });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getUsers: async (req, res) => {
        try {
            const { type, search } = req.query;
            let query = {};

            if (type === 'vendor') {
                query.role = 'vendor';
            } else if (type === 'customer') {
                query.role = 'customer';
            }

            if (search) {
                query.$or = [
                    { firstname: { $regex: search, $options: 'i' } },
                    { lastname: { $regex: search, $options: 'i' } },
                    { emailId: { $regex: search, $options: 'i' } }
                ];
            }

            const users = await userRepository.find(query); // userRepository.find sorts by createdAt -1 in my impl
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    verifyLawyer: async (req, res) => {
        try {
            const { status, rejectionReason } = req.body;
            const updateData = { status: status };

            if (status === 'Rejected' && rejectionReason) {
                updateData.rejectionReason = rejectionReason;
            }

            const user = await userRepository.findByIdAndUpdate(
                req.params.id,
                { $set: updateData }
            );
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    updateUserRole: async (req, res) => {
        try {
            const { role } = req.body;
            if (!['vendor', 'customer', 'admin'].includes(role)) {
                return res.status(400).json({ message: "Invalid role specified" });
            }

            const user = await userRepository.findByIdAndUpdate(
                req.params.id,
                { $set: { role: role } }
            );
            if (!user) return res.status(404).json({ message: "User not found" });

            res.status(200).json({ message: "User role updated successfully", user });
        } catch (err) {
            res.status(500).json({ message: "Failed to update role", error: err.message });
        }
    },

    deleteUser: async (req, res) => {
        try {
            await userRepository.findByIdAndDelete(req.params.id);
            await postRepository.updateById(req.params.id, { $set: { userId: null } }); // Or deleteMany
            // Original code says: await Post.deleteMany({ userId: req.params.id });
            const Post = require('../models/Post');
            await Post.deleteMany({ userId: req.params.id });
            res.status(200).json("User has been deleted");
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getAllPosts: async (req, res) => {
        try {
            const Post = require('../models/Post');
            const posts = await Post.find()
                .populate("userId", "firstname lastname profilePic")
                .sort({ createdAt: -1 });
            res.status(200).json(posts);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    deletePost: async (req, res) => {
        try {
            await postRepository.deletePost(req.params.id);
            res.status(200).json("Post has been deleted");
        } catch (err) {
            res.status(500).json(err);
        }
    }
};

module.exports = adminController;
