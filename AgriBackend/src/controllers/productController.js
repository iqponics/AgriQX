const Product = require("../models/Product");

const productController = {
    // Create new product (Farmer only)
    createProduct: async (req, res) => {
        try {
            if (!req.file || !req.file.path) {
                return res.status(400).json({ message: "Product image is required" });
            }

            const {
                name, description, category, weightValue, weightUnit, price, batchNo, latitude, longitude, expiryDate,
                farmDetails_farmId, farmDetails_contactNo, farmDetails_village, farmDetails_district, farmDetails_state, farmDetails_country, farmDetails_sizeInAcres, farmDetails_isOrganic, farmDetails_certification, farmDetails_soilType, farmDetails_waterSource,
                cultivation_cultivationId, cultivation_crop, cultivation_variety, cultivation_sowingDate, cultivation_fertilizer, cultivation_pesticide, cultivation_irrigation, cultivation_yield,
                harvest_batchId, harvest_harvestDate, harvest_quantity, harvest_grade, harvest_moisture, harvest_qualityCheck,
                processing_processingId, processing_center, processing_processType, processing_processDate, processing_weightAfter, processing_packaging, processing_expiryDate,
                qualityTest_testId, qualityTest_residuePpm, qualityTest_microbial, qualityTest_status, qualityTest_agency,
                logistics_transportId, logistics_from, logistics_to, logistics_mode, logistics_temperature, logistics_dispatchDate, logistics_deliveryDate,
                distribution_distributionId, distribution_distributor, distribution_retailer, distribution_city, distribution_quantity, distribution_pricePerKg
            } = req.body;
            // Only users with role 'vendor' can create products
            if (req.user.role !== 'vendor') {
                return res.status(403).json({ message: "Access denied. Only vendors can create products." });
            }

            const newProduct = new Product({
                name,
                imageUrl: req.file.path,
                description,
                category,
                weight: {
                    value: parseFloat(weightValue),
                    unit: weightUnit
                },
                price: parseFloat(price),
                batchNo,
                origin: {
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude)
                },
                expiryDate,
                vendorId: req.user.id || req.user._id,

                farmDetails: {
                    farmId: farmDetails_farmId,
                    contactNo: farmDetails_contactNo,
                    village: farmDetails_village,
                    district: farmDetails_district,
                    state: farmDetails_state,
                    country: farmDetails_country,
                    sizeInAcres: parseFloat(farmDetails_sizeInAcres),
                    isOrganic: farmDetails_isOrganic === 'true' || farmDetails_isOrganic === true,
                    certification: farmDetails_certification,
                    soilType: farmDetails_soilType,
                    waterSource: farmDetails_waterSource
                },
                cultivation: {
                    cultivationId: cultivation_cultivationId,
                    crop: cultivation_crop,
                    variety: cultivation_variety,
                    sowingDate: cultivation_sowingDate,
                    fertilizer: cultivation_fertilizer,
                    pesticide: cultivation_pesticide,
                    irrigation: cultivation_irrigation,
                    yield: parseFloat(cultivation_yield)
                },
                harvest: {
                    batchId: harvest_batchId,
                    harvestDate: harvest_harvestDate,
                    quantity: parseFloat(harvest_quantity),
                    grade: harvest_grade,
                    moisture: parseFloat(harvest_moisture),
                    qualityCheck: harvest_qualityCheck
                },
                processing: {
                    processingId: processing_processingId,
                    center: processing_center,
                    processType: processing_processType,
                    processDate: processing_processDate,
                    weightAfter: parseFloat(processing_weightAfter),
                    packaging: processing_packaging,
                    expiryDate: processing_expiryDate
                },
                qualityTest: {
                    testId: qualityTest_testId,
                    residuePpm: parseFloat(qualityTest_residuePpm),
                    microbial: qualityTest_microbial,
                    status: qualityTest_status,
                    agency: qualityTest_agency
                },
                logistics: {
                    transportId: logistics_transportId,
                    from: logistics_from,
                    to: logistics_to,
                    mode: logistics_mode,
                    temperature: parseFloat(logistics_temperature),
                    dispatchDate: logistics_dispatchDate,
                    deliveryDate: logistics_deliveryDate
                },
                distribution: {
                    distributionId: distribution_distributionId,
                    distributor: distribution_distributor,
                    retailer: distribution_retailer,
                    city: distribution_city,
                    quantity: parseFloat(distribution_quantity),
                    pricePerKg: parseFloat(distribution_pricePerKg)
                },
                status: 'pending'
            });

            const savedProduct = await newProduct.save();
            res.status(201).json(savedProduct);

        } catch (err) {
            console.error("Error creating product:", err.message, err.errors);
            res.status(400).json({ message: err.message || "Failed to create product" });
        }
    },

    // Get all products (Public Shop)
    getProducts: async (req, res) => {
        try {
            const products = await Product.find({ status: 'approved' }).sort({ createdAt: -1 }).populate('vendorId', 'firstname lastname profilePic');
            res.status(200).json(products);
        } catch (err) {
            console.error("Error fetching products:", err);
            res.status(500).json({ message: "Failed to fetch products" });
        }
    },

    // Get products for a specific farmer (Protected)
    getFarmerProducts: async (req, res) => {
        try {
            const vendorId = req.user.id || req.user._id;
            const vendorsProducts = await Product.find({ vendorId }).sort({ createdAt: -1 });
            res.status(200).json(vendorsProducts);
        } catch (err) {
            console.error("Error fetching farmer products:", err);
            res.status(500).json({ message: "Failed to fetch your products" });
        }
    },

    // Get single product details (Public for QR scan)
    getProductById: async (req, res) => {
        try {
            const product = await Product.findById(req.params.id).populate('vendorId', 'firstname lastname profilePic');
            if (!product) return res.status(404).json({ message: "Product not found" });
            res.status(200).json(product);
        } catch (err) {
            console.error("Error fetching product details:", err);
            res.status(500).json({ message: "Failed to fetch product details" });
        }
    },

    // Update product (Vendor only, Owner only)
    updateProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const vendorId = req.user.id || req.user._id;

            let product = await Product.findById(id);
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

            if (req.user.role !== 'vendor') {
                return res.status(403).json({ message: "Access denied. Only vendors can update products." });
            }

            if (product.vendorId.toString() !== vendorId.toString()) {
                return res.status(403).json({ message: "Access denied. You can only update your own products." });
            }

            const {
                name, description, category, weightValue, weightUnit, price, batchNo, latitude, longitude, expiryDate,
                farmDetails_farmId, farmDetails_contactNo, farmDetails_village, farmDetails_district, farmDetails_state, farmDetails_country, farmDetails_sizeInAcres, farmDetails_isOrganic, farmDetails_certification, farmDetails_soilType, farmDetails_waterSource,
                cultivation_cultivationId, cultivation_crop, cultivation_variety, cultivation_sowingDate, cultivation_fertilizer, cultivation_pesticide, cultivation_irrigation, cultivation_yield,
                harvest_batchId, harvest_harvestDate, harvest_quantity, harvest_grade, harvest_moisture, harvest_qualityCheck,
                processing_processingId, processing_center, processing_processType, processing_processDate, processing_weightAfter, processing_packaging, processing_expiryDate,
                qualityTest_testId, qualityTest_residuePpm, qualityTest_microbial, qualityTest_status, qualityTest_agency,
                logistics_transportId, logistics_from, logistics_to, logistics_mode, logistics_temperature, logistics_dispatchDate, logistics_deliveryDate,
                distribution_distributionId, distribution_distributor, distribution_retailer, distribution_city, distribution_quantity, distribution_pricePerKg
            } = req.body;

            const updateData = {
                name,
                description,
                category,
                weight: {
                    value: parseFloat(weightValue),
                    unit: weightUnit
                },
                price: parseFloat(price),
                batchNo,
                origin: {
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude)
                },
                expiryDate,
                farmDetails: {
                    farmId: farmDetails_farmId,
                    contactNo: farmDetails_contactNo,
                    village: farmDetails_village,
                    district: farmDetails_district,
                    state: farmDetails_state,
                    country: farmDetails_country,
                    sizeInAcres: parseFloat(farmDetails_sizeInAcres),
                    isOrganic: farmDetails_isOrganic === 'true' || farmDetails_isOrganic === true,
                    certification: farmDetails_certification,
                    soilType: farmDetails_soilType,
                    waterSource: farmDetails_waterSource
                },
                cultivation: {
                    cultivationId: cultivation_cultivationId,
                    crop: cultivation_crop,
                    variety: cultivation_variety,
                    sowingDate: cultivation_sowingDate,
                    fertilizer: cultivation_fertilizer,
                    pesticide: cultivation_pesticide,
                    irrigation: cultivation_irrigation,
                    yield: parseFloat(cultivation_yield)
                },
                harvest: {
                    batchId: harvest_batchId,
                    harvestDate: harvest_harvestDate,
                    quantity: parseFloat(harvest_quantity),
                    grade: harvest_grade,
                    moisture: parseFloat(harvest_moisture),
                    qualityCheck: harvest_qualityCheck
                },
                processing: {
                    processingId: processing_processingId,
                    center: processing_center,
                    processType: processing_processType,
                    processDate: processing_processDate,
                    weightAfter: parseFloat(processing_weightAfter),
                    packaging: processing_packaging,
                    expiryDate: processing_expiryDate
                },
                qualityTest: {
                    testId: qualityTest_testId,
                    residuePpm: parseFloat(qualityTest_residuePpm),
                    microbial: qualityTest_microbial,
                    status: qualityTest_status,
                    agency: qualityTest_agency
                },
                logistics: {
                    transportId: logistics_transportId,
                    from: logistics_from,
                    to: logistics_to,
                    mode: logistics_mode,
                    temperature: parseFloat(logistics_temperature),
                    dispatchDate: logistics_dispatchDate,
                    deliveryDate: logistics_deliveryDate
                },
                distribution: {
                    distributionId: distribution_distributionId,
                    distributor: distribution_distributor,
                    retailer: distribution_retailer,
                    city: distribution_city,
                    quantity: parseFloat(distribution_quantity),
                    pricePerKg: parseFloat(distribution_pricePerKg)
                }
            };

            // If a new image is uploaded, update the imageUrl
            if (req.file && req.file.path) {
                updateData.imageUrl = req.file.path;
            }

            // Reset status to pending after update to require re-approval
            updateData.status = 'pending';

            product = await Product.findByIdAndUpdate(id, { $set: updateData }, { new: true });
            res.status(200).json(product);

        } catch (err) {
            console.error("Error updating product:", err);
            res.status(500).json({ message: "Failed to update product" });
        }
    },

    // Delete product (Vendor only, Owner only)
    deleteProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const vendorId = req.user.id || req.user._id;

            const product = await Product.findById(id);
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

            if (product.vendorId.toString() !== vendorId.toString()) {
                return res.status(403).json({ message: "Access denied. You can only delete your own products." });
            }

            await Product.findByIdAndDelete(id);
            res.status(200).json({ message: "Product deleted successfully" });

        } catch (err) {
            console.error("Error deleting product:", err);
            res.status(500).json({ message: "Failed to delete product" });
        }
    },

    // Admin: Get all pending products
    getPendingProducts: async (req, res) => {
        try {
            const products = await Product.find({
                $or: [
                    { status: 'pending' },
                    { status: { $exists: false } }
                ]
            }).sort({ createdAt: -1 }).populate('vendorId', 'firstname lastname profilePic');
            res.status(200).json(products);
        } catch (err) {
            console.error("Error fetching pending products:", err);
            res.status(500).json({ message: "Failed to fetch pending products" });
        }
    },

    // Admin: Verify product (approve/reject)
    verifyProduct: async (req, res) => {
        try {
            const { status } = req.body;
            if (!['approved', 'rejected'].includes(status)) {
                return res.status(400).json({ message: "Invalid status" });
            }

            const product = await Product.findByIdAndUpdate(req.params.id, { $set: { status } }, { new: true });
            if (!product) return res.status(404).json({ message: "Product not found" });

            res.status(200).json(product);
        } catch (err) {
            console.error("Error verifying product:", err);
            res.status(500).json({ message: "Failed to verify product" });
        }
    }
};

module.exports = productController;
