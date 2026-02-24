const File = require('../models/File');

const fileRepository = {
    find: async (query) => {
        return await File.find(query);
    },

    findOne: async (query) => {
        return await File.findOne(query);
    },

    findById: async (id) => {
        return await File.findById(id);
    },

    create: async (data) => {
        const newFile = new File(data);
        return await newFile.save();
    },

    save: async (file) => {
        return await file.save();
    },

    deleteOne: async (query) => {
        return await File.deleteOne(query);
    }
};

module.exports = fileRepository;
