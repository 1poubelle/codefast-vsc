// Dashboard page - Main user dashboard showing all their boards
import ButtonLogout from "../../components/ButtonLogout";
import FormNewBoard from "../../components/FormNewBoard";
import ButtonDeleteBoard from "../../components/ButtonDeleteBoard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/Users";
import Board from "@/models/Board"; // eslint-disable-line no-unused-vars
import { redirect } from "next/navigation";
import Link from "next/link";
import ButtonCheckout from "@/components/ButtonCheckout";

// Server-side function to get the current authenticated user with their boards
async function getUser() {
  // Get the current session using NextAuth
  const session = await getServerSession(authOptions);
  
  // If no session exists, redirect to sign in page
  if (!session) {
    redirect("/auth/signin");
  }
  
  // Connect to MongoDB via Mongoose
  await connectMongo();
  
  // Find the user by ID and populate their boards array with actual Board documents
  // This replaces the board ObjectIds with the full board data
  const user = await User.findById(session.user.id).populate("boards");
  
  // If user doesn't exist in database (shouldn't happen), throw error
  if (!user) {
    throw new Error("User not found");
  }
  
  return user;
}



// Main Dashboard component - Server component that runs on the server
export default async function Dashboard() {
  // Get the authenticated user and their boards from the database
  const user = await getUser();
  
  return (
    <main className="p-6">
      {/* Page title */}
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="mb-4 flex justify-between items-center">  
      {/* Show checkout button only if user doesn't have premium access */}
      {!user.hasAccess && <ButtonCheckout />}
      
      {/* Show premium status if user has access */}
      {user.hasAccess && (
        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm font-medium">
          ✓ Premium Active
        </div>
      )}
      
      {/* Logout button component */}
      <ButtonLogout />
      </div>
      {/* Form to create a new board */}
      <FormNewBoard />
      
      {/* Section displaying user's boards */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Your Boards</h2>
        
        {/* Conditional rendering: show boards if they exist, otherwise show empty state */}
        {user.boards && user.boards.length > 0 ? (
          // Grid layout for displaying multiple boards
          <div className="grid gap-4">
            {/* Map through each board and render a card */}
            {user.boards.map((board) => (
              <div key={board._id} className="p-4 border rounded-lg shadow-sm hover:bg-neutral hover:text-neutral-content duration-300">
                {/* Header avec titre et bouton supprimer */}
                <div className="flex justify-between items-start mb-2">
                  {/* Board name */}
                  <Link href={`/dashboard/b/${board._id}`}>
                    <h3 className="font-medium hover:underline">{board.name}</h3>
                  </Link>
                  
                  {/* Delete button */}
                  <ButtonDeleteBoard boardId={board._id} boardName={board.name} />
                </div>
                
                {/* Board description (only if it exists) */}
                {board.description && (
                  <p className="text-gray-600 text-sm mt-1">{board.description}</p>
                )}
                
                {/* Board category badge */}
                <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded mt-2">
                  {board.category}
                </span>
              </div>
            ))}
          </div>
        ) : (
          // Empty state when user has no boards
          <p className="text-gray-500">No boards created yet. Create your first board above!</p>
        )}
      </div>
    </main>
  );
}
