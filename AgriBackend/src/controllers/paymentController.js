const paymentService = require('../services/paymentService');
const userRepository = require('../repositories/userRepository');

const paymentController = {
    createOrder: async (req, res) => {
        try {
            const { amount, currency, planType } = req.body;
            const options = {
                amount: amount * 100,
                currency,
                receipt: `receipt_${Date.now()}`,
                payment_capture: 1,
                notes: { planType }
            };

            const response = await paymentService.createOrder(options);
            res.json({
                id: response.id,
                currency: response.currency,
                amount: response.amount
            });
        } catch (error) {
            console.error('Razorpay error:', error);
            res.status(500).json({ error: 'Error creating order' });
        }
    },

    verifyPayment: async (req, res) => {
        try {
            const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

            if (!paymentService.verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
                return res.status(400).json({ error: 'Invalid signature' });
            }

            const order = await paymentService.fetchOrder(razorpay_order_id);

            // Original logic for findOneAndUpdate with upsert
            const User = require('../models/User');
            const user = await User.findOneAndUpdate(
                { emailId: order.notes.email }, // Fixed typo from 'email' to 'emailId' if needed, but original said 'email'
                {
                    subscriptionType: order.notes.planType,
                    subscriptionExpiry: paymentService.calculateExpiryDate(order.notes.planType),
                    $push: {
                        paymentHistory: {
                            paymentId: razorpay_payment_id,
                            amount: order.amount / 100,
                            currency: order.currency,
                            createdAt: new Date()
                        }
                    }
                },
                { new: true, upsert: true }
            );

            res.json({
                status: 'success',
                paymentId: razorpay_payment_id,
                user: {
                    subscriptionType: user.subscriptionType,
                    expiry: user.subscriptionExpiry
                }
            });
        } catch (error) {
            console.error('Verification error:', error);
            res.status(500).json({ error: 'Payment verification failed' });
        }
    }
};

module.exports = paymentController;
