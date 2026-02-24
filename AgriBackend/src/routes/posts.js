const express = require("express");
const postRouter = express.Router();
const postController = require("../controllers/postController");
const { uploadPost } = require("../config/cloudinary");

// Create a Post Route with File Upload
postRouter.post("/", uploadPost.single("file"), postController.createPost);

// Update a Post
postRouter.put("/:id", postController.updatePost);

// Delete a Post
postRouter.delete("/:id/:userId", postController.deletePost);

// Like / Dislike a Post
postRouter.put("/:id/like", postController.likePost);

// Comment on a Post
postRouter.put("/addcomment/:id", postController.addComment);

// Get a Post by ID
postRouter.get("/:id", postController.getPost);

// Get the Feed
postRouter.get("/feed/:userId", postController.getFeed);

// Timeline
postRouter.get("/timeline/:userId", postController.getTimeline);

module.exports = postRouter;
