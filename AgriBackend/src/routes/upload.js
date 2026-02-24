const express = require("express");
const uploadRouter = express.Router();
const fileController = require("../controllers/fileController");
const { uploadGeneral } = require("../config/cloudinary");

// Image Upload Route
uploadRouter.post("/:userId", uploadGeneral.single("file"), fileController.uploadUserProfilePic);

// Document Upload Route
uploadRouter.post("/:userId/doc", uploadGeneral.single("file"), fileController.uploadDoc);

module.exports = uploadRouter;
