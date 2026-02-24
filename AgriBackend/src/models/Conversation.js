const mongoose = require('mongoose');


const ConversationSchema = new mongoose.Schema({
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    name: {
        type: String,
        default: ""
    },
    isGroup: {
        type: Boolean,
        default: false
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    lastMessageAt: {
        type: Date
    }
}, { timestamps: true });

// Custom validation for members
ConversationSchema.path('members').validate(function (value) {
    return value && value.length >= 1;
}, 'A conversation must have at least 1 member');

// Indexes for efficient queries
ConversationSchema.index({ members: 1 });
ConversationSchema.index({ lastMessageAt: -1 });

module.exports = mongoose.model("Conversation", ConversationSchema);