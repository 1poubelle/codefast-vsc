
import Board  from "@/models/Board";
import { redirect } from "next/navigation";
import connnectMongo from "@/libs/mongoose";


const getBoard = async (boardId) => {
    
    await connnectMongo();
    
    const board = await Board.findById(boardId);

   
    
    if (!board) {
        redirect("/");
    }
    return board;
};

export default async function PublicFeedbackBoard({params}) {
    const {boardId} = params
    const board = await getBoard(boardId)
    return (
        <div>
            <h1>{board.name} (Public)</h1>
        </div>
    )
}