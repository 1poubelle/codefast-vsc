"use client";

// Import useState hook to manage loading state
import { useState } from 'react';

// Import axios for HTTP requests as per user instructions
import axios from 'axios';

// Import toast for displaying error messages
import { toast } from 'react-hot-toast';

// ButtonCheckout component handles subscription checkout process
const ButtonCheckout = () => {
    // State to track if checkout request is loading
    const [isLoading, setIsLoading] = useState(false);
    
    // Function to handle checkout button click
    const handleCheckout = async () => {
        console.log('Checkout button clicked');
        
        // Set loading state to true to show animation
        setIsLoading(true);
        
        try {
            // Create success and cancel URLs for Stripe checkout
            const successUrl = `${window.location.origin}/success`;
            const cancelUrl = `${window.location.origin}/cancel`;
            
            console.log('Making checkout request with URLs:', { successUrl, cancelUrl });
            
            // Make POST request to create checkout session using axios
            const response = await axios.post('/api/billing/create-checkout-session', {
                successUrl,
                cancelUrl,
            });
            
            console.log('Checkout response:', response.data);
            
            // If we get a checkout URL from Stripe, redirect to it
            if (response.data.url) {
                console.log('Redirecting to Stripe checkout:', response.data.url);
                window.location.href = response.data.url;
            }
            
        } catch (error) {
            // Handle any errors during checkout
            console.error('Checkout error:', error);
            
            // Stop loading animation
            setIsLoading(false);
            
            // Extract error message from axios error response
            let errorMessage = 'Something went wrong. Please try again.';
            
            // Check if we have a specific error message from the server
            if (error.response && error.response.data && error.response.data.error) {
                errorMessage = error.response.data.error;
                console.log('Server error message:', errorMessage);
            } else if (error.message) {
                errorMessage = error.message;
                console.log('General error message:', errorMessage);
            }
            
            // Display error message using toast
            toast.error(errorMessage);
        }
    };
    
    return (
        <button 
            className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
            onClick={handleCheckout}
            disabled={isLoading}
        >
            {/* Show different text based on loading state */}
            {isLoading ? 'Processing...' : 'Subscribe'}
        </button>
    );
};

export default ButtonCheckout;