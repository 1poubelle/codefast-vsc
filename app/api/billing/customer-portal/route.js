// Import necessary modules for Stripe customer portal
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import connectMongo from "@/libs/mongoose";
import Users from "@/models/Users";

// Initialize Stripe with secret API key
const stripe = new Stripe(process.env.STRIPE_API_KEY);

// Customer portal endpoint for managing subscriptions
export async function POST(req) {
    console.log('Creating Stripe customer portal session');
    
    try {
        // Get the request body for return URL
        const body = await req.json();
        console.log('Portal request body:', body);
        
        // Get the current user session
        const session = await getServerSession(authOptions);
        if (!session) {
            console.log('No session found for portal request');
            return NextResponse.json({ error: "Please sign in to access billing portal" }, { status: 401 });
        }
        
        console.log('User requesting portal access:', session.user.email);
        
        // Connect to database to get user's Stripe customer ID
        await connectMongo();
        console.log('Connected to database for portal session');
        
        // Find the user and get their Stripe customer ID
        const user = await Users.findById(session.user.id);
        if (!user) {
            console.log('User not found in database:', session.user.id);
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        
        console.log('User found:', user.email);
        console.log('User customerId:', user.customerId);
        
        // Check if user has a Stripe customer ID
        if (!user.customerId) {
            console.log('User has no Stripe customer ID');
            return NextResponse.json({ 
                error: "No billing information found. Please make a purchase first." 
            }, { status: 400 });
        }
        
        // Set return URL - where user goes after using the portal
        const returnUrl = body.returnUrl || `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard`;
        console.log('Portal return URL:', returnUrl);
        
        // Create Stripe billing portal session
        const portalSession = await stripe.billingPortal.sessions.create({
            // The Stripe customer ID for this user
            customer: user.customerId,
            
            // Where to redirect the user after they're done with the portal
            return_url: returnUrl,
        });
        
        console.log('Portal session created:', portalSession.id);
        console.log('Portal URL:', portalSession.url);
        
        // Return the portal URL to redirect the user
        return NextResponse.json({ 
            url: portalSession.url 
        }, { status: 200 });
        
    } catch (error) {
        // Handle any errors during portal creation
        console.error('Portal creation error:', error);
        
        // Handle specific Stripe errors
        if (error.type === 'StripeInvalidRequestError') {
            return NextResponse.json({ 
                error: "Invalid billing information. Please contact support." 
            }, { status: 400 });
        }
        
        return NextResponse.json({ 
            error: error.message || "Failed to create billing portal session" 
        }, { status: 500 });
    }
}