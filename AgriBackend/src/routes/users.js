const express = require('express');
const userController = require('../controllers/userController');
const { verifyAccessToken } = require('../middlewares/authmiddleware');
const userRouter = express.Router();

// Search for Astrologers (Public)
userRouter.post('/search/astrologers', userController.searchAstrologers);

// Search for Users (Public)
userRouter.post('/search/users', userController.searchUsers);
userRouter.get('/search', userController.searchUsers);

// Protect routes that require authentication
userRouter.use(verifyAccessToken);

// Update User
userRouter.put('/:id', userController.updateUser);

// Delete User
userRouter.delete('/:id', userController.deleteUser);

// Get a User
userRouter.get('/:userId', userController.getUser);

// Get Contacts
userRouter.get('/contacts/:userId', userController.getContacts);

// Connect User
userRouter.put('/:id/requestConnect', userController.requestConnect);

// Accept Connection
userRouter.put('/:id/acceptConnect', userController.acceptConnect);

// Disconnect User
userRouter.put('/:id/deleteConnect', userController.deleteConnect);

// Withdraw connection request
userRouter.put('/:id/withdrawRequest', userController.withdrawRequest);

// Decline connection request
userRouter.put('/:id/declineConnect', userController.declineConnect);



// Rate a User
userRouter.put('/rate/:userId', userController.rateUser);

// Update Verification Documents
userRouter.put('/:id/verification', userController.updateVerification);

module.exports = userRouter;
