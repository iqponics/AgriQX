const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { verifyAccessToken } = require("../middlewares/authmiddleware");
const { uploadGeneral } = require("../config/cloudinary");

// Create Product (Protected, Farmer only, Image Upload)
router.post("/", verifyAccessToken, uploadGeneral.single("image"), productController.createProduct);

// Get My Products (Protected, Farmer only)
router.get("/my-products", verifyAccessToken, productController.getFarmerProducts);

// Get All Products (Public for Shop)
router.get("/", productController.getProducts);

// Get Single Product (Public for QR Scan)
router.get("/:id", productController.getProductById);

// Update Product (Protected, Farmer only, Owner only)
router.put("/:id", verifyAccessToken, uploadGeneral.single("image"), productController.updateProduct);

// Delete Product (Protected, Farmer only, Owner only)
router.delete("/:id", verifyAccessToken, productController.deleteProduct);

module.exports = router;
