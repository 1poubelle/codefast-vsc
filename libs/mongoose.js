import mongoose from "mongoose";

const connectMongo = async () => {
    try {
        // Check if already connected
        if (mongoose.connections[0].readyState) {
            console.log("Already connected to MongoDB");
            return;
        }

        // Connect with proper configuration
        await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI, {
            bufferCommands: false,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log("Connected to MongoDB via Mongoose");
    } catch (error) {
        console.error("MONGOOSE CONNECTION ERROR:", error.message);
        throw error;
    }
}

export default connectMongo;