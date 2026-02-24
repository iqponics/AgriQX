
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true,
        index: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        default: ""
    },
    messageType: {
        type: String,
        enum: ['text', 'image', 'video', 'audio', 'file', 'call'],
        default: 'text'
    },
    attachments: [{
        url: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        name: String,
        size: Number
    }],
    readBy: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        readAt: {
            type: Date,
            default: Date.now
        }
    }],
    deliveredTo: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        deliveredAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

// Custom validation: message must have either text or attachments
MessageSchema.pre('validate', function (next) {
    if (!this.text && (!this.attachments || this.attachments.length === 0)) {
        next(new Error('Message must have either text or attachments'));
    } else {
        next();
    }
});

// Indexes for efficient queries
MessageSchema.index({ conversationId: 1, createdAt: -1 });
MessageSchema.index({ senderId: 1 });

module.exports = mongoose.model("Message", MessageSchema);