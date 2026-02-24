const Razorpay = require('razorpay');
const crypto = require('crypto');

let razorpay;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
} else {
    console.warn("WARNING: Razorpay keys are missing. Payment features will not work.");
}

const paymentService = {
    calculateExpiryDate: (planType) => {
        const expiry = new Date();
        if (planType === 'monthly') expiry.setMonth(expiry.getMonth() + 1);
        else if (planType === 'yearly') expiry.setFullYear(expiry.getFullYear() + 1);
        return expiry;
    },

    createOrder: async (options) => {
        if (!razorpay) throw new Error("Razorpay is not initialized. Please check your keys.");
        return await razorpay.orders.create(options);
    },

    fetchOrder: async (orderId) => {
        if (!razorpay) throw new Error("Razorpay is not initialized. Please check your keys.");
        return await razorpay.orders.fetch(orderId);
    },

    verifySignature: (razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
        const secret = process.env.RAZORPAY_KEY_SECRET;
        const generatedSignature = crypto
            .createHmac('sha256', secret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');
        return generatedSignature === razorpay_signature;
    }
};

module.exports = paymentService;
