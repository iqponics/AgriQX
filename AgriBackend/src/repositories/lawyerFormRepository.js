const LawyerForm = require('../models/LawyerForm');

const lawyerFormRepository = {
    create: async (data) => {
        const newForm = new LawyerForm(data);
        return await newForm.save();
    },

    findById: async (id) => {
        return await LawyerForm.findById(id);
    },

    findOne: async (query) => {
        return await LawyerForm.findOne(query);
    },

    find: async (query) => {
        return await LawyerForm.find(query);
    },

    save: async (form) => {
        return await form.save();
    },

    deleteOne: async (query) => {
        return await LawyerForm.deleteOne(query);
    }
};

module.exports = lawyerFormRepository;
