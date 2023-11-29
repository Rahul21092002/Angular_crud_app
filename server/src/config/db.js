const mongoose = require('mongoose');

// DB URI from .env file
const DB_URI = process.env.DB_URI;

const connectDB = async () => {
    try {
        const dbConnection = await mongoose.connect(DB_URI);

        console.log(`MongoDB Connected: ${dbConnection.connection.host}`);
    } catch (error) {
        console.log(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    } 
};

module.exports = connectDB;
