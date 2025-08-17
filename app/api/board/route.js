import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectMongo from "@/libs/mongoose";
import Board from "@/models/Board";
import User from "@/models/Users";
import { use } from "react";


export async function POST(req) {
    try {
        const body = await req.json();
        if (!body.name) {
            return NextResponse.json({ error: "Board Name is required" }, { status: 400 });
        }
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        await connectMongo();
        const user = await User.findById(session.user.id);

        
        const board = await Board.create({ name: body.name, userId: user._id });
        await user.save();
        return NextResponse.json({});
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}