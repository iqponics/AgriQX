const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    // Product Details
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, default: 'Vegetables' },
    weight: {
        value: { type: Number, required: true },
        unit: { type: String, required: true }
    },
    price: { type: Number, required: true },
    batchNo: { type: String, required: true },
    origin: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
    expiryDate: { type: Date, required: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // Farm Details
    farmDetails: {
        farmId: String,
        contactNo: String,
        village: String,
        district: String,
        state: String,
        country: String,
        sizeInAcres: Number,
        isOrganic: { type: Boolean, default: false },
        certification: String,
        soilType: String,
        waterSource: String
    },

    // Crop Cultivation
    cultivation: {
        cultivationId: String,
        crop: String,
        variety: String,
        sowingDate: Date,
        fertilizer: String,
        pesticide: String,
        irrigation: String,
        yield: Number
    },

    // Harvest Batch
    harvest: {
        batchId: String,
        harvestDate: Date,
        quantity: Number,
        grade: String,
        moisture: Number,
        qualityCheck: String
    },

    // Processing Details
    processing: {
        processingId: String,
        center: String,
        processType: String,
        processDate: Date,
        weightAfter: Number,
        packaging: String,
        expiryDate: Date
    },

    // Quality Test
    qualityTest: {
        testId: String,
        residuePpm: Number,
        microbial: String,
        status: String,
        agency: String
    },

    // Logistic & Distribution
    logistics: {
        transportId: String,
        from: String,
        to: String,
        mode: String,
        temperature: Number,
        dispatchDate: Date,
        deliveryDate: Date
    },

    distribution: {
        distributionId: String,
        distributor: String,
        retailer: String,
        city: String,
        quantity: Number,
        pricePerKg: Number
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },

    // Blockchain Verification
    blockchainVerificationUrl: { type: String, default: null },
    blockchainExternalId: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema);
