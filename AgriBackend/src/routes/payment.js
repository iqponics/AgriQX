const express = require('express');
const paymentRouter = express.Router();
const paymentController = require('../controllers/paymentController');

// Create Order
paymentRouter.post('/create-order', paymentController.createOrder);

// Verify Payment
paymentRouter.post('/verify-payment', paymentController.verifyPayment);

module.exports = paymentRouter;
