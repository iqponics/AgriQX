const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/authController');
const passport = require('../config/passport');

authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));

authRouter.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login", session: false }), authController.googleCallback);

authRouter.post('/register', authController.register);

authRouter.get('/confirm/:confirmationCode', authController.confirmEmail);

authRouter.post('/login', authController.login);

authRouter.post('/logout', authController.logout);

authRouter.get('/diag-email', authController.diagEmail);

module.exports = authRouter;
