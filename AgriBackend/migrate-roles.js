require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./src/models/User");
const Product = require("./src/models/Product");

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB connected");

        // 1. Update User Roles
        // 'farmer' -> 'vendor'
        const farmerRes = await User.updateMany({ role: 'farmer' }, { $set: { role: 'vendor' } });
        console.log("Farmers updated to Vendors:", farmerRes.modifiedCount);

        // 'lawyer/user' that were essentially customers/vendors
        // If they had isLawyer=true and it was the old 'Farmer' type (from previous logs), update to vendor
        const lawyerRes = await User.updateMany({ isLawyer: true, role: { $ne: 'admin' } }, { $set: { role: 'vendor' } });
        console.log("Lawyers updated to Vendors:", lawyerRes.modifiedCount);

        // All others that are not admin or vendor should be customer
        const customerRes = await User.updateMany({ role: { $nin: ['admin', 'vendor'] } }, { $set: { role: 'customer' } });
        console.log("Others updated to Customers:", customerRes.modifiedCount);

        // Special case: Ensure admins are role 'admin'
        // From check-db, we saw 0 admins, but if user wants to be admin:
        // await User.updateOne({ emailId: 'user@example.com' }, { $set: { role: 'admin' } });

        // 2. Update Product Fields
        // Rename farmerId to vendorId if it exists as farmerId
        const products = await Product.find({});
        let updatedProducts = 0;
        for (const product of products) {
            if (product._doc.farmerId && !product._doc.vendorId) {
                await Product.updateOne(
                    { _id: product._id },
                    {
                        $set: { vendorId: product._doc.farmerId },
                        $unset: { farmerId: "" }
                    }
                );
                updatedProducts++;
            }
        }
        console.log("Products renamed farmerId -> vendorId:", updatedProducts);

        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

run();
