const messageRepository = require('../repositories/messageRepository');

const messageService = {
    validateMessage: (text, attachments) => {
        return text || (attachments && attachments.length > 0);
    },

    isAlreadyRead: (message, userId) => {
        return message.readBy.some(read => read.userId.toString() === userId.toString());
    },

    isAlreadyDelivered: (message, userId) => {
        return message.deliveredTo.some(delivery => delivery.userId.toString() === userId.toString());
    }
};

module.exports = messageService;
