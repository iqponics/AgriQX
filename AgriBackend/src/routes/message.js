const express = require("express");
const messageRouter = express.Router();
const messageController = require("../controllers/messageController");
const verifyToken = require("../middlewares/verifyToken");

// Apply authentication to all routes
messageRouter.use(verifyToken);

// Create a message
messageRouter.post("/", messageController.createMessage);

// Get messages for a conversation
messageRouter.get("/:conversationId", messageController.getMessages);

// Mark message as read
messageRouter.patch("/:messageId/read", messageController.markRead);

// Mark message as delivered
messageRouter.patch("/:messageId/delivered", messageController.markDelivered);

// Delete a message
messageRouter.delete("/:messageId", messageController.deleteMessage);

module.exports = messageRouter;
