// database/db.js
const mongoose = require("mongoose");
const env = require("dotenv");

env.config();
const DB = process.env.DB_URL;

const connectToDatabase = async () => {
    try {
        await mongoose.connect(DB, {
            serverSelectionTimeoutMS: 10000,
        });
        console.log("Database is Connected");
    } catch (err) {
        console.error("Database connection error:", err);
        process.exit(1);
    }
};

module.exports = connectToDatabase;
