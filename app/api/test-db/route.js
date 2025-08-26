import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import mongoose from "mongoose";

export async function GET() {
    try {
        // Test MongoDB connection
        await connectMongo();
        
        const connectionState = mongoose.connections[0].readyState;
        const states = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting'
        };
        
        return NextResponse.json({ 
            status: "success",
            connectionState: states[connectionState],
            message: "Database connection test successful",
            mongoUri: process.env.MONGODB_URI ? "MONGODB_URI is set" : "MONGODB_URI not found"
        });
    } catch (error) {
        console.error("Database test error:", error);
        return NextResponse.json({ 
            status: "error",
            error: error.message,
            mongoUri: process.env.MONGODB_URI ? "MONGODB_URI is set" : "MONGODB_URI not found"
        }, { status: 500 });
    }
}
