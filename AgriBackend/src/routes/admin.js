const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const productController = require("../controllers/productController");
const verifyToken = require("../middlewares/verifyToken");
const isAdmin = require("../middlewares/isAdmin");

// GET Stats
router.get("/stats", verifyToken, isAdmin, adminController.getStats);

// GET All Users
router.get("/users", verifyToken, isAdmin, adminController.getUsers);

// PATCH Verify Lawyer
router.patch("/users/:id/verify", verifyToken, isAdmin, adminController.verifyLawyer);

// DELETE User
router.delete("/users/:id", verifyToken, isAdmin, adminController.deleteUser);

// GET All Posts
router.get("/posts", verifyToken, isAdmin, adminController.getAllPosts);

// DELETE Post
router.delete("/posts/:id", verifyToken, isAdmin, adminController.deletePost);

// --- Product Approval System ---

// GET Pending Products
router.get("/products/pending", verifyToken, isAdmin, productController.getPendingProducts);

// PATCH Verify Product
router.patch("/products/:id/verify", verifyToken, isAdmin, productController.verifyProduct);

module.exports = router;
