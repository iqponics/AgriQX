const Conversation = require('../models/Conversation');

const conversationRepository = {
    create: async (data) => {
        const newConvo = new Conversation(data);
        return await newConvo.save();
    },

    findOne: async (query) => {
        return await Conversation.findOne(query);
    },

    find: async (query) => {
        return await Conversation.find(query);
    },

    findById: async (id) => {
        return await Conversation.findById(id);
    },

    save: async (conversation) => {
        return await conversation.save();
    },

    deleteOne: async (query) => {
        return await Conversation.deleteOne(query);
    }
};

module.exports = conversationRepository;
