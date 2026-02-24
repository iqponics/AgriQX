require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./src/models/User");
const Product = require("./src/models/Product");

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB connected");

        const usersCount = await User.countDocuments();
        console.log("Total Users:", usersCount);

        const admins = await User.find({ isAdmin: true });
        console.log("Admin Users Found:", admins.length);
        if (admins.length > 0) {
            console.log("Admin 1 Email:", admins[0].emailId);
            console.log("Admin 1 Role:", admins[0].role);
            console.log("Admin 1 isAdmin:", admins[0].isAdmin);
        }

        const farmersCount = await User.countDocuments({ role: 'farmer' });
        console.log("Farmers Count (role=farmer):", farmersCount);

        const lawyersCount = await User.countDocuments({ isLawyer: true });
        console.log("Lawyers Count (isLawyer=true):", lawyersCount);

        const productsCount = await Product.countDocuments();
        console.log("Total Products:", productsCount);

        const pendingCount = await Product.countDocuments({
            $or: [{ status: 'pending' }, { status: { $exists: false } }]
        });
        console.log("Pending Products Count:", pendingCount);

        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

run();
