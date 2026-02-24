const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userRepository = require('../repositories/userRepository');

const authService = {
    generateAccessToken: (user) => {
        return jwt.sign(
            { id: user._id, role: user.role, isAstrologer: user.isAstrologer },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
    },

    generateRefreshToken: (user) => {
        return jwt.sign(
            { id: user._id, role: user.role },
            process.env.REFRESH_SECRET,
            { expiresIn: '7d' }
        );
    },

    comparePassword: async (password, hashedPassword) => {
        return await bcrypt.compare(password, hashedPassword);
    },

    hashPassword: async (password) => {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }
};

module.exports = authService;
