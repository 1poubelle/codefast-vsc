import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import Board  from "@/models/Board";
import { redirect } from "next/navigation";
import connnectMongo from "@/libs/mongoose";
import Link from "next/link";


const getBoard = async (boardId) => {
    console.log('getBoard called with boardId:', boardId);
    const session = await getServerSession(authOptions);
    console.log('session:', session);
    console.log('session.user.id:', session?.user?.id);
    
    await connnectMongo();
    console.log('Connected to MongoDB');
    
    const board = await Board.findOne({_id: boardId, userId: session?.user?.id});
    console.log('Found board:', board);

   
    
    if (!board) {
        console.log('Board not found, redirecting to dashboard');
        redirect("/dashboard");
    }
    console.log('Returning board');
    return board;
};

export default async function FeedbackBoard({params}) {
    console.log('FeedbackBoard component called with params:', params);
    const {boardId} = params
    console.log('Extracted boardId:', boardId);
    const board = await getBoard(boardId)
    console.log('Got board in component:', board);
    return (
        <div>
            <h1>{board.name}</h1>
            <Link href={`/dashboard`}>Back to Dashboard</Link>
        </div>
    )
}