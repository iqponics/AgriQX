require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./src/models/User');

const MONGO_URI = process.env.MONGO_URI;

const createAdmin = async () => {
    try {
        if (!MONGO_URI) {
            console.error("MONGO_URI not found in environment variables");
            process.exit(1);
        }

        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");

        const email = "karnashruti20@gmail.com";
        const password = "123456";
        const role = "admin";

        // Check if user already exists
        const existingUser = await User.findOne({ emailId: email });
        if (existingUser) {
            console.log("Admin user already exists. Updating role and password...");
            const hashedPassword = await bcrypt.hash(password, 10);
            existingUser.role = role;
            existingUser.password = hashedPassword;
            existingUser.firstname = "Shruti";
            existingUser.lastname = "Karna";
            await existingUser.save();
            console.log("Admin user updated successfully.");
        } else {
            console.log("Creating new admin user...");
            const hashedPassword = await bcrypt.hash(password, 10);
            const adminUser = new User({
                firstname: "Shruti",
                lastname: "Karna",
                emailId: email,
                password: hashedPassword,
                role: role,
                status: 'Active'
            });
            await adminUser.save();
            console.log("Admin user created successfully.");
        }

        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    } catch (error) {
        console.error("Error creating admin user:", error);
    }
};

createAdmin();
