import ButtonLogout from "../../components/ButtonLogout";
import FormNewBoard from "../../components/FormNewBoard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/Users";
import Board from "@/models/Board"; // eslint-disable-line no-unused-vars
import { redirect } from "next/navigation";

async function getUser() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/auth/signin");
  }
  
  await connectMongo();
  const user = await User.findById(session.user.id).populate("boards");
  
  if (!user) {
    throw new Error("User not found");
  }
  
  return user;
}



export default async function Dashboard() {
  const user = await getUser();
  
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <ButtonLogout />
      <FormNewBoard />
      
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Your Boards</h2>
        {user.boards && user.boards.length > 0 ? (
          <div className="grid gap-4">
            {user.boards.map((board) => (
              <div key={board._id} className="p-4 border rounded-lg shadow-sm">
                <h3 className="font-medium">{board.name}</h3>
                {board.description && (
                  <p className="text-gray-600 text-sm mt-1">{board.description}</p>
                )}
                <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded mt-2">
                  {board.category}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No boards created yet. Create your first board above!</p>
        )}
      </div>
    </main>
  );
}
