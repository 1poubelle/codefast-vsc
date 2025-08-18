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
        await connectMongo();
        const user = await User.findById(session.user.id);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        
        const board = await Board.create({ 
            name: body.name, 
            description: body.description || "",
            category: body.category || "feedback",
            userId: user._id 
        });
        
        // Add board to user's boards array
        user.boards.push(board._id);
        await user.save();
        
        return NextResponse.json({ 
            board,
            message: "Board created successfully" 
        });
    } catch (error) {
        console.error("Board creation error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
}