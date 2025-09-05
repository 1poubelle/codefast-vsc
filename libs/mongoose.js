import mongoose from "mongoose";

const connectMongo = async () => {
    try {
        // Check if already connected
        if (mongoose.connections[0].readyState) {
            console.log("Already connected to MongoDB");
            return;
        }

        // Connect with serverless-optimized configuration
        await mongoose.connect(process.env.MONGODB_URI, {
            // Enable buffering for serverless environments to prevent timing issues
            bufferCommands: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            // Additional serverless optimizations
            maxIdleTimeMS: 30000,
            retryWrites: true,
        });
        console.log("Connected to MongoDB via Mongoose");
    } catch (error) {
        console.error("MONGOOSE CONNECTION ERROR:", error.message);
        throw error;
    }
}

export default connectMongo;