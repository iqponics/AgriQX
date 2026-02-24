const Call = require('../models/Call');

const callRepository = {
    create: async (data) => {
        const newCall = new Call(data);
        return await newCall.save();
    },

    find: async (query) => {
        return await Call.find(query);
    },

    findById: async (id) => {
        return await Call.findById(id);
    },

    findByIdAndUpdate: async (id, data, options = { new: true }) => {
        return await Call.findByIdAndUpdate(id, data, options);
    },

    findOne: async (query) => {
        return await Call.findOne(query);
    }
};

module.exports = callRepository;
