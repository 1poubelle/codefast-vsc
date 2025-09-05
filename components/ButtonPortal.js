"use client";

// Import necessary hooks and libraries
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// ButtonPortal component for accessing Stripe customer portal
const ButtonPortal = () => {
    // State to track loading when creating portal session
    const [isLoading, setIsLoading] = useState(false);
    
    // Function to handle portal button click
    const handlePortalAccess = async () => {
        console.log('Portal button clicked');
        
        // Set loading state to show animation
        setIsLoading(true);
        
        try {
            // Create return URL for after portal usage
            const returnUrl = `${window.location.origin}/dashboard`;
            console.log('Creating portal session with return URL:', returnUrl);
            
            // Make POST request to create portal session using axios
            const response = await axios.post('/api/billing/customer-portal', {
                returnUrl
            });
            
            console.log('Portal response:', response.data);
            
            // If we get a portal URL from Stripe, redirect to it
            if (response.data.url) {
                console.log('Redirecting to Stripe portal:', response.data.url);
                window.location.href = response.data.url;
            }
            
        } catch (error) {
            // Handle any errors during portal creation
            console.error('Portal error:', error);
            
            // Stop loading animation
            setIsLoading(false);
            
            // Extract error message from axios error response
            let errorMessage = 'Failed to access billing portal. Please try again.';
            
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
            onClick={handlePortalAccess}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm ${
                isLoading 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-600 hover:bg-gray-700 text-white border border-gray-600'
            }`}
        >
            {/* Show different text based on loading state */}
            {isLoading ? 'Opening Portal...' : 'Manage Billing'}
        </button>
    );
};

export default ButtonPortal;