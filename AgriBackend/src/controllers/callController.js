const callRepository = require('../repositories/callRepository');
const conversationRepository = require('../repositories/conversationRepository');
const callService = require('../services/callService');

const callController = {
    initiateCall: async (req, res) => {
        try {
            const { conversationId, initiator, participants, type } = req.body;
            if (!conversationId || !initiator || !participants || !type) {
                return res.status(400).json({ error: "Missing required fields: conversationId, initiator, participants, type" });
            }
            if (!callService.validateCallType(type)) {
                return res.status(400).json({ error: "Invalid call type. Must be 'audio' or 'video'" });
            }

            const conversation = await conversationRepository.findById(conversationId);
            if (!conversation) {
                return res.status(404).json({ error: "Conversation not found" });
            }

            const savedCall = await callRepository.create({
                conversationId,
                initiator,
                participants,
                type,
                status: 'initiated'
            });
            res.status(201).json(savedCall);
        } catch (err) {
            console.error("Error initiating call:", err);
            res.status(500).json({ error: "Failed to initiate call", details: err.message });
        }
    },

    getUserHistory: async (req, res) => {
        try {
            const { userId } = req.params;
            const { limit = 50, skip = 0 } = req.query;

            if (req.user.id !== userId) {
                return res.status(403).json({ error: "Forbidden", message: "You can only access your own call history" });
            }

            const Call = require('../models/Call');
            const calls = await Call.find({ participants: { $in: [userId] } })
                .sort({ createdAt: -1 })
                .limit(parseInt(limit))
                .skip(parseInt(skip))
                .populate('participants', 'username profilePicture')
                .populate('initiator', 'username profilePicture');

            res.status(200).json(calls);
        } catch (err) {
            console.error("Error fetching user call history:", err);
            res.status(500).json({ error: "Failed to fetch call history", details: err.message });
        }
    },

    getConversationHistory: async (req, res) => {
        try {
            const { conversationId } = req.params;
            const { limit = 50, skip = 0 } = req.query;

            const conversation = await conversationRepository.findById(conversationId);
            if (!conversation) {
                return res.status(404).json({ error: "Conversation not found" });
            }
            if (!conversation.members.includes(req.user.id)) {
                return res.status(403).json({ error: "Forbidden", message: "You are not a member of this conversation" });
            }

            const Call = require('../models/Call');
            const calls = await Call.find({ conversationId })
                .sort({ createdAt: -1 })
                .limit(parseInt(limit))
                .skip(parseInt(skip))
                .populate('participants', 'username profilePicture')
                .populate('initiator', 'username profilePicture');

            res.status(200).json(calls);
        } catch (err) {
            console.error("Error fetching conversation call history:", err);
            res.status(500).json({ error: "Failed to fetch call history", details: err.message });
        }
    },

    endCall: async (req, res) => {
        try {
            const { callId } = req.params;
            const { duration, quality } = req.body;

            const updateData = {
                status: 'ended',
                endTime: new Date()
            };
            if (duration !== undefined) updateData.duration = duration;
            if (quality) updateData.quality = quality;

            const updatedCall = await callRepository.findByIdAndUpdate(callId, updateData);
            if (!updatedCall) {
                return res.status(404).json({ error: "Call not found" });
            }
            res.status(200).json(updatedCall);
        } catch (err) {
            console.error("Error ending call:", err);
            res.status(500).json({ error: "Failed to end call", details: err.message });
        }
    },

    updateStatus: async (req, res) => {
        try {
            const { callId } = req.params;
            const { status } = req.body;
            if (!callService.validateStatus(status)) {
                return res.status(400).json({ error: "Invalid status" });
            }

            const updateData = { status };
            if (status === 'active') updateData.startTime = new Date();

            const updatedCall = await callRepository.findByIdAndUpdate(callId, updateData);
            if (!updatedCall) {
                return res.status(404).json({ error: "Call not found" });
            }
            res.status(200).json(updatedCall);
        } catch (err) {
            console.error("Error updating call status:", err);
            res.status(500).json({ error: "Failed to update call status", details: err.message });
        }
    },

    getActiveCall: async (req, res) => {
        try {
            const { userId } = req.params;
            if (req.user.id !== userId) {
                return res.status(403).json({ error: "Forbidden", message: "You can only check your own call status" });
            }

            const Call = require('../models/Call');
            const activeCall = await Call.findOne({
                participants: { $in: [userId] },
                status: { $in: ['ringing', 'active'] }
            })
                .sort({ createdAt: -1 })
                .populate('participants', 'username profilePicture')
                .populate('initiator', 'username profilePicture');

            if (activeCall) {
                res.status(200).json({ isInCall: true, call: activeCall });
            } else {
                res.status(200).json({ isInCall: false, call: null });
            }
        } catch (err) {
            console.error("Error checking active call:", err);
            res.status(500).json({ error: "Failed to check active call", details: err.message });
        }
    },

    getCall: async (req, res) => {
        try {
            const { callId } = req.params;
            const call = await callRepository.findById(callId);
            if (!call) {
                return res.status(404).json({ error: "Call not found" });
            }
            res.status(200).json(call);
        } catch (err) {
            console.error("Error fetching call:", err);
            res.status(500).json({ error: "Failed to fetch call", details: err.message });
        }
    }
};

module.exports = callController;
