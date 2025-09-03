// Import necessary modules for webhook handling
import { NextResponse } from "next/server";
import Stripe from "stripe";
import connectMongo from "@/libs/mongoose";
import Users from "@/models/Users";

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_API_KEY);

// Webhook endpoint secret from Stripe dashboard
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Main webhook handler for POST requests from Stripe
export async function POST(req) {
    console.log('Stripe webhook received');
    
    try {
        // Get the raw body as text for signature verification
        const body = await req.text();
        console.log('Webhook body received');
        
        // Get the Stripe signature from headers
        const signature = req.headers.get('stripe-signature');
        console.log('Stripe signature:', signature ? 'present' : 'missing');
        
        // Verify the webhook signature to ensure it's from Stripe
        let event;
        try {
            event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
            console.log('Webhook signature verified successfully');
        } catch (err) {
            console.error('Webhook signature verification failed:', err.message);
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }
        
        console.log('Processing webhook event:', event.type);
        
        // Handle different types of Stripe events
        switch (event.type) {
            case 'checkout.session.completed':
                console.log('Processing checkout.session.completed event');
                await handleCheckoutSessionCompleted(event.data.object);
                break;
                
            default:
                // Log unknown event types for debugging
                console.log('Unhandled event type:', event.type);
        }
        
        // Return success response to Stripe
        return NextResponse.json({ received: true }, { status: 200 });
        
    } catch (error) {
        // Handle any errors that occur during webhook processing
        console.error('Webhook processing error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Function to handle successful checkout sessions
async function handleCheckoutSessionCompleted(session) {
    console.log('Handling completed checkout session:', session.id);
    
    try {
        // Connect to MongoDB database
        await connectMongo();
        console.log('Connected to database for webhook processing');
        
        // Get user ID from the client_reference_id we set during checkout
        const userId = session.client_reference_id;
        console.log('Processing payment for user ID:', userId);
        
        // Get customer ID from the session
        const customerId = session.customer;
        console.log('Stripe customer ID:', customerId);
        
        // Find and update the user in our database
        const updatedUser = await Users.findByIdAndUpdate(
            userId,
            {
                // Grant access to premium features
                hasAccess: true,
                
                // Store Stripe customer ID for future billing operations
                customerId: customerId
            },
            { 
                new: true,  // Return the updated document
                runValidators: true  // Run schema validations
            }
        );
        
        if (updatedUser) {
            console.log('User access granted successfully:', updatedUser.email);
            console.log('User hasAccess:', updatedUser.hasAccess);
            console.log('User customerId:', updatedUser.customerId);
        } else {
            console.error('User not found for ID:', userId);
            throw new Error('User not found');
        }
        
    } catch (error) {
        // Log any errors during user update
        console.error('Error updating user access:', error);
        throw error; // Re-throw to be caught by main error handler
    }
}