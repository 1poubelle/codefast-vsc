import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import Board  from "@/models/Board";
import { redirect } from "next/navigation";
import connnectMongo from "@/libs/mongoose";
import Link from "next/link";
import CardBoardLink from "@/components/CardBoardLink";
import ButtonDeleteBoard from "@/components/ButtonDeleteBoard";


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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
                    {/* Header avec titre et bouton supprimer */}
                    <div className="flex justify-between items-start mb-8">
                        <h1 className="text-4xl font-bold text-gray-800">{board.name}</h1>
                        <ButtonDeleteBoard 
                            boardId={board._id} 
                            boardName={board.name} 
                            redirectAfterDelete={true}
                        />
                    </div>
                    
                    <CardBoardLink boardId={board._id} />
                    
                    <div className="flex gap-4 justify-center mt-8">
                        <Link 
                            href={`/dashboard`}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg inline-flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                                <path fillRule="evenodd" d="M12.5 9.75A2.75 2.75 0 0 0 9.75 7H4.56l2.22 2.22a.75.75 0 1 1-1.06 1.06l-3.5-3.5a.75.75 0 0 1 0-1.06l3.5-3.5a.75.75 0 0 1 1.06 1.06L4.56 5.5h5.19a4.25 4.25 0 0 1 0 8.5h-1a.75.75 0 0 1 0-1.5h1a2.75 2.75 0 0 0 2.75-2.75Z" clipRule="evenodd" />
                            </svg>
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}