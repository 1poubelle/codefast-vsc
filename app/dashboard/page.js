// Dashboard page - Main user dashboard showing all their boards
import ButtonLogout from "../../components/ButtonLogout";
import FormNewBoard from "../../components/FormNewBoard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/Users";
import Board from "@/models/Board"; // eslint-disable-line no-unused-vars
import { redirect } from "next/navigation";
import Link from "next/link";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-lg text-gray-600">Welcome back! Manage your boards and projects.</p>
          </div>
          <ButtonLogout />
        </div>
        
        {/* Create New Board Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Board</h2>
          <FormNewBoard />
        </div>
        
        {/* Boards Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Boards</h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              {user.boards ? user.boards.length : 0} boards
            </span>
          </div>
          
          {/* Conditional rendering: show boards if they exist, otherwise show empty state */}
          {user.boards && user.boards.length > 0 ? (
            // Grid layout for displaying multiple boards
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Map through each board and render a card */}
              {user.boards.map((board) => (
                <Link 
                  href={`/dashboard/b/${board._id}`} 
                  key={board._id}
                  className="group block"
                >
                  <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-300 group-hover:scale-[1.02] group-hover:-translate-y-1">
                    {/* Board header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {board.category}
                      </span>
                    </div>
                    
                    {/* Board content */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                      {board.name}
                    </h3>
                    
                    {/* Board description (only if it exists) */}
                    {board.description && (
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                        {board.description}
                      </p>
                    )}
                    
                    {/* Board footer */}
                    <div className="flex items-center text-sm text-gray-500 group-hover:text-blue-600 transition-colors duration-200">
                      <span>View board</span>
                      <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            // Empty state when user has no boards
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No boards yet</h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                Get started by creating your first board above. It's the perfect way to organize your projects and ideas.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
