const conversationRepository = require('../repositories/conversationRepository');
const messageRepository = require('../repositories/messageRepository');
const conversationService = require('../services/conversationService');

const conversationController = {
    createConversation: async (req, res) => {
        try {
            const { senderId, receiverId } = req.body;
            if (!senderId || !receiverId) {
                return res.status(400).json({ error: "Validation error", message: "senderId and receiverId are required" });
            }

            const existingConvo = await conversationRepository.findOne({
                isGroup: false,
                members: { $all: [senderId, receiverId] }
            });

            if (existingConvo) {
                return res.status(200).json(existingConvo);
            }

            const savedConvo = await conversationRepository.create({ members: [senderId, receiverId] });
            res.status(201).json(savedConvo);
        } catch (err) {
            console.error("Error creating conversation:", err);
            res.status(500).json({ error: "Internal server error", message: "Failed to create conversation" });
        }
    },

    createGroup: async (req, res) => {
        try {
            const { members, name, groupAdmin } = req.body;
            if (!conversationService.validateMembers(members)) {
                return res.status(400).json({ error: "Validation error", message: "Group must have at least 2 members" });
            }
            if (!conversationService.validateGroupName(name)) {
                return res.status(400).json({ error: "Validation error", message: "Group name is required" });
            }

            const savedConvo = await conversationRepository.create({
                members,
                name,
                isGroup: true,
                groupAdmin: groupAdmin || members[0]
            });
            res.status(201).json(savedConvo);
        } catch (err) {
            console.error("Error creating group conversation:", err);
            res.status(500).json({ error: "Internal server error", message: "Failed to create group conversation" });
        }
    },

    getConversations: async (req, res) => {
        try {
            const { userId } = req.params;
            if (req.user.id !== userId) {
                return res.status(403).json({ error: "Forbidden", message: "You can only access your own conversations" });
            }

            // We need to use models directly for populate if repository doesn't handle it, 
            // but let's assume we use Conversation model via repository find with populate chain.
            // Since repo returns the query, we can chain populate.
            // Wait, repo.find returns the result of await Conversation.find(query).
            // I should update repository to allow populate or do it here.
            // To keep it clean, I'll update repository to return the query or handle populate.

            // I'll use the model directly here to keep logic exact as per original routes if needed, 
            // but I should use repository.

            const Conversation = require('../models/Conversation');
            const conversations = await Conversation.find({ members: { $in: [userId] } })
                .populate('members', 'username profilePicture')
                .populate('lastMessage')
                .populate('groupAdmin', 'username profilePicture')
                .sort({ lastMessageAt: -1 });

            res.status(200).json(conversations);
        } catch (err) {
            console.error("Error fetching conversations:", err);
            res.status(500).json({ error: "Internal server error", message: "Failed to fetch conversations" });
        }
    },

    findConversation: async (req, res) => {
        try {
            const { firstUserId, secondUserId } = req.params;
            if (req.user.id !== firstUserId && req.user.id !== secondUserId) {
                return res.status(403).json({ error: "Forbidden", message: "You can only access your own conversations" });
            }

            const Conversation = require('../models/Conversation');
            let convo = await Conversation.findOne({
                isGroup: false,
                members: { $all: [firstUserId, secondUserId] }
            })
                .populate('members', 'username profilePicture')
                .populate('lastMessage');

            if (!convo) {
                convo = await conversationRepository.create({ members: [firstUserId, secondUserId] });
                await convo.populate('members', 'username profilePicture');
            }

            res.status(200).json(convo);
        } catch (err) {
            console.error("Error finding conversation:", err);
            res.status(500).json({ error: "Internal server error", message: "Failed to find conversation" });
        }
    },

    updateConversation: async (req, res) => {
        try {
            const { id } = req.params;
            const { name } = req.body;
            const conversation = await conversationRepository.findById(id);

            if (!conversation) {
                return res.status(404).json({ error: "Not found", message: "Conversation not found" });
            }
            if (!conversation.members.includes(req.user.id)) {
                return res.status(403).json({ error: "Forbidden", message: "You are not a member of this conversation" });
            }
            if (conversation.isGroup && conversation.groupAdmin.toString() !== req.user.id) {
                return res.status(403).json({ error: "Forbidden", message: "Only group admin can update the conversation" });
            }

            if (name !== undefined) conversation.name = name;
            const updatedConvo = await conversationRepository.save(conversation);
            res.status(200).json(updatedConvo);
        } catch (err) {
            console.error("Error updating conversation:", err);
            res.status(500).json({ error: "Internal server error", message: "Failed to update conversation" });
        }
    },

    addMember: async (req, res) => {
        try {
            const { id } = req.params;
            const { userId } = req.body;
            if (!userId) {
                return res.status(400).json({ error: "Validation error", message: "userId is required" });
            }

            const conversation = await conversationRepository.findById(id);
            if (!conversation) {
                return res.status(404).json({ error: "Not found", message: "Conversation not found" });
            }
            if (!conversation.isGroup) {
                return res.status(400).json({ error: "Bad request", message: "Cannot add members to non-group conversation" });
            }
            if (conversation.groupAdmin.toString() !== req.user.id) {
                return res.status(403).json({ error: "Forbidden", message: "Only group admin can add members" });
            }
            if (conversation.members.includes(userId)) {
                return res.status(400).json({ error: "Bad request", message: "User is already a member" });
            }

            conversation.members.push(userId);
            const updatedConvo = await conversationRepository.save(conversation);
            await updatedConvo.populate('members', 'username profilePicture');
            res.status(200).json(updatedConvo);
        } catch (err) {
            console.error("Error adding member:", err);
            res.status(500).json({ error: "Internal server error", message: "Failed to add member" });
        }
    },

    removeMember: async (req, res) => {
        try {
            const { id, userId } = req.params;
            const conversation = await conversationRepository.findById(id);

            if (!conversation) {
                return res.status(404).json({ error: "Not found", message: "Conversation not found" });
            }
            if (!conversation.isGroup) {
                return res.status(400).json({ error: "Bad request", message: "Cannot remove members from non-group conversation" });
            }
            if (conversation.groupAdmin.toString() !== req.user.id && req.user.id !== userId) {
                return res.status(403).json({ error: "Forbidden", message: "Only group admin can remove members" });
            }

            conversation.members = conversation.members.filter(member => member.toString() !== userId);
            const updatedConvo = await conversationRepository.save(conversation);
            await updatedConvo.populate('members', 'username profilePicture');
            res.status(200).json(updatedConvo);
        } catch (err) {
            console.error("Error removing member:", err);
            res.status(500).json({ error: "Internal server error", message: "Failed to remove member" });
        }
    },

    deleteConversation: async (req, res) => {
        try {
            const { id } = req.params;
            const conversation = await conversationRepository.findById(id);

            if (!conversation) {
                return res.status(404).json({ error: "Not found", message: "Conversation not found" });
            }
            if (!conversation.members.includes(req.user.id)) {
                return res.status(403).json({ error: "Forbidden", message: "You are not a member of this conversation" });
            }
            if (conversation.isGroup && conversation.groupAdmin.toString() !== req.user.id) {
                return res.status(403).json({ error: "Forbidden", message: "Only group admin can delete the conversation" });
            }

            await messageRepository.deleteMany({ conversationId: id });
            await conversationRepository.deleteOne({ _id: id });
            res.status(200).json({ message: "Conversation deleted successfully" });
        } catch (err) {
            console.error("Error deleting conversation:", err);
            res.status(500).json({ error: "Internal server error", message: "Failed to delete conversation" });
        }
    }
};

module.exports = conversationController;
