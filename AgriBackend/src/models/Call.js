const mongoose = require('mongoose');

const CallSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true,
        index: true
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    initiator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['audio', 'video'],
        required: true
    },
    status: {
        type: String,
        enum: ['initiated', 'ringing', 'active', 'ended', 'missed', 'rejected'],
        default: 'initiated'
    },
    startTime: {
        type: Date,
        default: null
    },
    endTime: {
        type: Date,
        default: null
    },
    duration: {
        type: Number, // Duration in seconds
        default: 0
    },
    quality: {
        packetLoss: {
            type: Number,
            default: 0
        },
        averageLatency: {
            type: Number,
            default: 0
        },
        connectionType: {
            type: String,
            enum: ['direct', 'relay', 'unknown'],
            default: 'unknown'
        }
    }
}, { timestamps: true });

// Custom validation for participants
CallSchema.path('participants').validate(function (value) {
    return value && value.length >= 2;
}, 'A call must have at least 2 participants');

// Index for efficient queries
CallSchema.index({ participants: 1, createdAt: -1 });
CallSchema.index({ conversationId: 1, createdAt: -1 });

// Virtual field to calculate duration if not set
CallSchema.virtual('calculatedDuration').get(function () {
    if (this.startTime && this.endTime) {
        return Math.floor((this.endTime - this.startTime) / 1000);
    }
    return this.duration;
});

module.exports = mongoose.model("Call", CallSchema);
