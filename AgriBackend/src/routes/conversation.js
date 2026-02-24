const express = require("express");
const conversationRouter = express.Router();
const conversationController = require("../controllers/conversationController");
const verifyToken = require("../middlewares/verifyToken");

// Apply authentication to all routes
conversationRouter.use(verifyToken);

// Create a conversation
conversationRouter.post("/", conversationController.createConversation);

// Create a group
conversationRouter.post("/group", conversationController.createGroup);

// Get conversations for a user
conversationRouter.get("/:userId", conversationController.getConversations);

// Get conversation between 2 users
conversationRouter.get("/find/:firstUserId/:secondUserId", conversationController.findConversation);

// Update conversation
conversationRouter.patch("/:id", conversationController.updateConversation);

// Add member to group
conversationRouter.post("/:id/members", conversationController.addMember);

// Remove member from group
conversationRouter.delete("/:id/members/:userId", conversationController.removeMember);

// Delete conversation
conversationRouter.delete("/:id", conversationController.deleteConversation);

module.exports = conversationRouter;
