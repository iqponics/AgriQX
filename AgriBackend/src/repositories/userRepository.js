const User = require('../models/User');

const userRepository = {
    findByGoogleId: async (googleId) => {
        return await User.findOne({ googleId });
    },

    findById: async (id) => {
        return await User.findById(id);
    },

    findByEmail: async (emailId) => {
        return await User.findOne({ emailId });
    },

    findByConfirmationCode: async (confirmationCode) => {
        return await User.findOne({ confirmationCode });
    },

    findByRefreshToken: async (refreshToken) => {
        return await User.findOne({ refreshToken });
    },

    find: async (query) => {
        return await User.find(query);
    },

    findByIdAndUpdate: async (id, data, options = { new: true }) => {
        return await User.findByIdAndUpdate(id, data, options);
    },

    findByIdAndDelete: async (id) => {
        return await User.findByIdAndDelete(id);
    },

    updateById: async (id, update) => {
        return await User.updateOne({ _id: id }, update);
    },

    createUser: async (userData) => {
        const newUser = new User(userData);
        return await newUser.save();
    },

    saveUser: async (user, options = {}) => {
        return await user.save(options);
    },

    unsetRefreshToken: async (refreshToken) => {
        return await User.findOneAndUpdate(
            { refreshToken },
            { $unset: { refreshToken: 1 } }
        );
    }
};

module.exports = userRepository;
