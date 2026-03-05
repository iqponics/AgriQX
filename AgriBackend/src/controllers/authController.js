const userRepository = require('../repositories/userRepository');
const authService = require('../services/authService');
const { v4: uuidv4 } = require('uuid');
const sendEmail = require('../utils/sendEmail.js'); // FIXED PATH (change if needed)
const jwt = require('jsonwebtoken');

const authController = {
    register: async (req, res) => {
        try {
            if (!req.body.emailId) {
                return res.status(400).json({ message: 'Email ID is required' });
            }

            const existingUser = await userRepository.findByEmail(req.body.emailId);
            if (existingUser) {
                return res.status(400).json({ message: 'Email ID already exists' });
            }

            const hashedPassword = await authService.hashPassword(req.body.password);

            const newUser = {
                ...req.body,
                password: hashedPassword,
                confirmationCode: uuidv4(),
                status: 'Pending',
                role: req.body.role || 'customer'
            };

            const user = await userRepository.createUser(newUser);

            if (!user.emailId || !user.confirmationCode) {
                console.error("Missing email or confirmation code after save!");
                return res.status(500).json({ message: "User data incomplete." });
            }

            try {
                await sendEmail(user.firstname, user.emailId, user.confirmationCode);
            } catch (emailErr) {
                // Email failure should NOT block registration — just log it
                console.error("Email sending failed (non-fatal):", emailErr.message);
            }

            return res.status(200).json({
                message: "User registered successfully! Check your email to verify."
            });

        } catch (err) {
            // Mongoose validation error → 400, not 500
            if (err.name === 'ValidationError') {
                const messages = Object.values(err.errors).map(e => e.message);
                return res.status(400).json({ message: messages.join('. ') });
            }
            console.error("Register Error:", err.message, err.stack);
            return res.status(500).json({
                message: process.env.NODE_ENV === 'production'
                    ? 'Server error during registration'
                    : err.message
            });
        }
    },


    // ================= LOGIN =================
    login: async (req, res) => {
        try {
            const user = await userRepository.findByEmail(req.body.emailId);
            if (!user) return res.status(404).json({ message: "Invalid credentials" });

            if (user.status !== "Active") {
                return res.status(401).json({ message: "Please verify your email!" });
            }

            const validPassword = await authService.comparePassword(req.body.password, user.password);
            if (!validPassword) return res.status(400).json({ message: "Invalid credentials" });

            const { password, refreshToken, ...userData } = user._doc;

            const accessToken = authService.generateAccessToken({ ...user._doc });
            const newRefreshToken = authService.generateRefreshToken({ ...user._doc });

            user.refreshToken = newRefreshToken;
            await userRepository.saveUser(user, { validateBeforeSave: false });

            const cookieOptions = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            };

            res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 900000 });
            res.cookie('refreshToken', newRefreshToken, { ...cookieOptions, maxAge: 604800000 });

            return res.status(200).json({ userData, token: accessToken });

        } catch (err) {
            console.error("Login Error:", err);
            return res.status(500).json({ message: 'Server error' });
        }
    },

    logout: async (req, res) => {
        try {
            const { refreshToken } = req.cookies;

            if (refreshToken) {
                await userRepository.unsetRefreshToken(refreshToken);
            }

            const cookieOptions = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
            };

            res.clearCookie('accessToken', cookieOptions);
            res.clearCookie('refreshToken', cookieOptions);

            return res.status(200).json({ message: 'Successfully logged out' });

        } catch (err) {
            console.error("🔥 Logout Error:", err);
            return res.status(500).json({ message: "Server error" });
        }
    },

    // ================= EMAIL CONFIRMATION =================
    confirmEmail: async (req, res) => {
        try {
            const user = await userRepository.findByConfirmationCode(req.params.confirmationCode);
            if (!user) return res.status(404).json({ message: "User not found" });

            user.status = "Active";
            await userRepository.saveUser(user);

            return res.status(200).json({ message: 'Email verified successfully!' });

        } catch (err) {
            console.error("🔥 Confirm Email Error:", err);
            return res.status(500).json({ message: 'Server error' });
        }
    },

    // ================= GOOGLE CALLBACK =================
    googleCallback: async (req, res) => {
        try {
            const user = req.user;

            const accessToken = authService.generateAccessToken({ ...user._doc, role: user.role });
            const refreshToken = authService.generateRefreshToken({ ...user._doc, role: user.role });

            user.refreshToken = refreshToken;
            await userRepository.saveUser(user, { validateBeforeSave: false });

            const cookieOptions = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            };

            res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 900000 });
            res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 604800000 });

            return res.redirect(`${process.env.CLIENT_URL}/login?token=${accessToken}`);

        } catch (err) {
            console.error("Google Callback Error:", err);
            return res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
        }
    }
};

module.exports = authController;
