const conversationRepository = require('../repositories/conversationRepository');

const conversationService = {
    validateMembers: (members) => {
        return members && Array.isArray(members) && members.length >= 2;
    },

    validateGroupName: (name) => {
        return name && name.trim() !== "";
    }
};

module.exports = conversationService;
