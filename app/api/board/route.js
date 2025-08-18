import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import connectMongo from "@/libs/mongoose";
import Board from "@/models/Board";
import User from "@/models/Users";


export async function POST(req) {
    try {
        const body = await req.json();
        if (!body.name) {
            return NextResponse.json({ error: "Board Name is required" }, { status: 400 });
        }
        
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        
        // Connect to MongoDB with error handling
        try {
            await connectMongo();
        } catch (dbError) {
            console.error("Database connection failed:", dbError);
            return NextResponse.json({ 
                error: "Database connection failed. Please try again." 
            }, { status: 503 });
        }
        
        // Find user with timeout handling
        let user;
        try {
            user = await User.findById(session.user.id).maxTimeMS(5000);
        } catch (userError) {
            console.error("User lookup failed:", userError);
            return NextResponse.json({ 
                error: "Failed to verify user. Please try again." 
            }, { status: 500 });
        }

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        
        // Create board with timeout handling
        let board;
        try {
            board = await Board.create({ 
                name: body.name, 
                description: body.description || "",
                category: body.category || "feedback",
                userId: user._id 
            });
        } catch (boardError) {
            console.error("Board creation failed:", boardError);
            return NextResponse.json({ 
                error: "Failed to create board. Please try again." 
            }, { status: 500 });
        }
        
        // Add board to user's boards array
        try {
            user.boards.push(board._id);
            await user.save();
        } catch (updateError) {
            console.error("User update failed:", updateError);
            // Board was created but user update failed - log this but don't fail the request
            console.warn("Board created but failed to update user's boards array");
        }
        
        return NextResponse.json({ 
            board,
            message: "Board created successfully" 
        });
    } catch (error) {
        console.error("Board creation error:", error);
        
        // Handle specific MongoDB timeout errors
        if (error.message.includes('buffering timed out')) {
            return NextResponse.json({ 
                error: "Database connection timeout. Please check your connection and try again." 
            }, { status: 503 });
        }
        
        return NextResponse.json({ 
            error: "An unexpected error occurred. Please try again." 
        }, { status: 500 });
    }
}