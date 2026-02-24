const Message = require('../models/Message');

const messageRepository = {
    create: async (data) => {
        const newMessage = new Message(data);
        return await newMessage.save();
    },

    find: async (query) => {
        return await Message.find(query);
    },

    findById: async (id) => {
        return await Message.findById(id);
    },

    save: async (message) => {
        return await message.save();
    },

    deleteMany: async (query) => {
        return await Message.deleteMany(query);
    },

    deleteOne: async (query) => {
        return await Message.deleteOne(query);
    }
};

module.exports = messageRepository;
