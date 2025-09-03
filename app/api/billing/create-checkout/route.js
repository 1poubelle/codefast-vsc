// Import NextResponse to handle API responses in Next.js 14 App Router
import { NextResponse } from "next/server";

// Import Stripe SDK to interact with Stripe payment service
import Stripe from "stripe";

// Import database connection function using Mongoose
import connectMongo from "@/libs/mongoose";

// Import the User model to interact with user data in MongoDB
import Users from "@/models/Users";

// Import NextAuth functions to handle user authentication
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

// This is the main API route handler for creating Stripe checkout sessions
// It handles POST requests to /api/billing/create-checkout
export async function POST(req) {
    console.log('Creating Stripe checkout session');
    
    try {
        // Parse the JSON body from the incoming request
        // This contains successUrl and cancelUrl from the frontend
        const body = await req.json();
        console.log('Request body:', body);
        
        // Check if the required URLs are provided
        // These URLs are where Stripe will redirect users after payment
        if (!body.successUrl || !body.cancelUrl) {
            // Return error response with 400 status (Bad Request)
            return NextResponse.json({ error: "Success and Cancel URLs are required" }, { status: 400 });
        }
        
        // Initialize Stripe with the secret API key from environment variables
        // This allows us to create checkout sessions and manage payments
        const stripe = new Stripe(process.env.STRIPE_API_KEY);
        
        // Get the current user's session using NextAuth
        // This tells us who is logged in and making the payment
        const session = await getServerSession(authOptions);
        console.log('User session:', session?.user?.email);
        
        // Connect to MongoDB database using Mongoose
        // This is required before we can query user data
        await connectMongo();
        
        // Find the user in our database using their ID from the session
        // We need user details like email for the Stripe checkout
        const user = await Users.findById(session.user.id);
        console.log('User found:', user?.email);
        
        // Create a new Stripe checkout session
        // This generates a payment page that users will be redirected to
        const stripeCheckoutSession = await stripe.checkout.sessions.create({
            // Set to "subscription" for recurring payments (monthly/yearly plans)
            mode: "subscription",
            
            // Only allow card payments (credit/debit cards)
            payment_method_types: ["card"],
            
            // Define what the user is buying - the price ID comes from Stripe dashboard
            line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
            
            // Where to redirect user after successful payment
            success_url: body.successUrl,
            
            // Where to redirect user if they cancel the payment
            cancel_url: body.cancelUrl,
            
            // Pre-fill the checkout form with user's email
            customer_email: user.email,
            
            // Store the user ID so we can identify them in webhooks
            client_reference_id: user._id.toString(),
        });
        
        console.log('Checkout session created:', stripeCheckoutSession.id);
        
        // Return the checkout URL to the frontend
        // The frontend will redirect the user to this URL to complete payment
        return NextResponse.json({ url: stripeCheckoutSession.url }, { status: 200 });
        
    } catch (error) {
        // If anything goes wrong, log the error and return error response
        console.error('Checkout error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}