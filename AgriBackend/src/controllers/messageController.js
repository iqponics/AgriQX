const messageRepository = require('../repositories/messageRepository');
const conversationRepository = require('../repositories/conversationRepository');
const messageService = require('../services/messageService');

const messageController = {
    createMessage: async (req, res) => {
        try {
            const { conversationId, senderId, text, messageType, attachments } = req.body;
            if (!conversationId || !senderId) {
                return res.status(400).json({ error: "Validation error", message: "conversationId and senderId are required" });
            }
            if (req.user.id !== senderId) {
                return res.status(403).json({ error: "Forbidden", message: "You can only send messages as yourself" });
            }

            const conversation = await conversationRepository.findById(conversationId);
            if (!conversation) {
                return res.status(404).json({ error: "Not found", message: "Conversation not found" });
            }
            if (!conversation.members.includes(senderId)) {
                return res.status(403).json({ error: "Forbidden", message: "You are not a member of this conversation" });
            }

            const savedMessage = await messageRepository.create({
                conversationId,
                senderId,
                text: text || "",
                messageType: messageType || 'text',
                attachments: attachments || []
            });

            conversation.lastMessage = savedMessage._id;
            conversation.lastMessageAt = savedMessage.createdAt;
            await conversationRepository.save(conversation);

            await savedMessage.populate('senderId', 'username profilePicture');
            res.status(201).json(savedMessage);
        } catch (err) {
            console.error("Error creating message:", err);
            res.status(500).json({ error: "Internal server error", message: "Failed to create message", details: err.message });
        }
    },

    getMessages: async (req, res) => {
        try {
            const { conversationId } = req.params;
            const { limit = 50, skip = 0 } = req.query;

            const conversation = await conversationRepository.findById(conversationId);
            if (!conversation) {
                return res.status(404).json({ error: "Not found", message: "Conversation not found" });
            }
            if (!conversation.members.includes(req.user.id)) {
                return res.status(403).json({ error: "Forbidden", message: "You are not a member of this conversation" });
            }

            const Message = require('../models/Message');
            const messages = await Message.find({ conversationId })
                .sort({ createdAt: 1 })
                .limit(parseInt(limit))
                .skip(parseInt(skip))
                .populate('senderId', 'username profilePicture');

            res.status(200).json(messages);
        } catch (err) {
            console.error("Error fetching messages:", err);
            res.status(500).json({ error: "Internal server error", message: "Failed to fetch messages" });
        }
    },

    markRead: async (req, res) => {
        try {
            const { messageId } = req.params;
            const { userId } = req.body;
            if (req.user.id !== userId) {
                return res.status(403).json({ error: "Forbidden", message: "You can only mark messages as read for yourself" });
            }

            const message = await messageRepository.findById(messageId);
            if (!message) {
                return res.status(404).json({ error: "Not found", message: "Message not found" });
            }

            if (messageService.isAlreadyRead(message, userId)) {
                return res.status(200).json(message);
            }

            message.readBy.push({ userId, readAt: new Date() });
            const updatedMessage = await messageRepository.save(message);
            res.status(200).json(updatedMessage);
        } catch (err) {
            console.error("Error marking message as read:", err);
            res.status(500).json({ error: "Internal server error", message: "Failed to mark message as read" });
        }
    },

    markDelivered: async (req, res) => {
        try {
            const { messageId } = req.params;
            const { userId } = req.body;
            if (req.user.id !== userId) {
                return res.status(403).json({ error: "Forbidden", message: "You can only mark messages as delivered for yourself" });
            }

            const message = await messageRepository.findById(messageId);
            if (!message) {
                return res.status(404).json({ error: "Not found", message: "Message not found" });
            }

            if (messageService.isAlreadyDelivered(message, userId)) {
                return res.status(200).json(message);
            }

            message.deliveredTo.push({ userId, deliveredAt: new Date() });
            const updatedMessage = await messageRepository.save(message);
            res.status(200).json(updatedMessage);
        } catch (err) {
            console.error("Error marking message as delivered:", err);
            res.status(500).json({ error: "Internal server error", message: "Failed to mark message as delivered" });
        }
    },

    deleteMessage: async (req, res) => {
        try {
            const { messageId } = req.params;
            const message = await messageRepository.findById(messageId);
            if (!message) {
                return res.status(404).json({ error: "Not found", message: "Message not found" });
            }
            if (message.senderId.toString() !== req.user.id) {
                return res.status(403).json({ error: "Forbidden", message: "You can only delete your own messages" });
            }

            await messageRepository.deleteOne({ _id: messageId });
            res.status(200).json({ message: "Message deleted successfully" });
        } catch (err) {
            console.error("Error deleting message:", err);
            res.status(500).json({ error: "Internal server error", message: "Failed to delete message" });
        }
    }
};

module.exports = messageController;
