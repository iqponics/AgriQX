const callService = {
    validateCallType: (type) => {
        return ['audio', 'video'].includes(type);
    },

    validateStatus: (status) => {
        const validStatuses = ['initiated', 'ringing', 'active', 'ended', 'missed', 'rejected'];
        return validStatuses.includes(status);
    }
};

module.exports = callService;
