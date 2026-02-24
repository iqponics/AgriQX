const AstrologerForm = require('../models/AstrologerForm');

const astrologerFormRepository = {
    create: async (data) => {
        const newForm = new AstrologerForm(data);
        return await newForm.save();
    },

    findById: async (id) => {
        return await AstrologerForm.findById(id);
    },

    findOne: async (query) => {
        return await AstrologerForm.findOne(query);
    },

    find: async (query) => {
        return await AstrologerForm.find(query);
    },

    save: async (form) => {
        return await form.save();
    },

    deleteOne: async (query) => {
        return await AstrologerForm.deleteOne(query);
    }
};

module.exports = astrologerFormRepository;
