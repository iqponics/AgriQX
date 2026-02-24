const express = require("express");
const callRouter = express.Router();
const callController = require("../controllers/callController");
const verifyToken = require("../middlewares/verifyToken");

// Apply authentication to all routes
callRouter.use(verifyToken);

// Initiate a call
callRouter.post("/initiate", callController.initiateCall);

// Get call history for a user
callRouter.get("/history/user/:userId", callController.getUserHistory);

// Get call history for a conversation
callRouter.get("/history/conversation/:conversationId", callController.getConversationHistory);

// Update call when it ends
callRouter.patch("/:callId/end", callController.endCall);

// Update call status
callRouter.patch("/:callId/status", callController.updateStatus);

// Check if user is currently in an active call
callRouter.get("/active/:userId", callController.getActiveCall);

// Get a specific call by ID
callRouter.get("/:callId", callController.getCall);

module.exports = callRouter;
