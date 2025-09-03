// Import necessary components and icons
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

// Success page component - shown after successful Stripe payment
export default function SuccessPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            {/* Main success card container - fully responsive using Tailwind */}
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 text-center border border-gray-200">
                {/* Success icon - smaller size */}
                <div className="flex justify-center mb-4">
                    <CheckCircleIcon className="w-12 h-12 text-green-500" />
                </div>
                
                {/* Success heading */}
                <h1 className="text-xl font-bold text-gray-900 mb-3">
                    Payment Successful! 🎉
                </h1>
                
                {/* Success message */}
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                    Thank you for your subscription! Your payment has been processed successfully 
                    and you now have access to all premium features.
                </p>
                
                {/* What happens next section */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm">What happens next:</h3>
                    <ul className="text-xs text-gray-600 space-y-1">
                        <li>• You'll receive a confirmation email shortly</li>
                        <li>• Your subscription is now active</li>
                        <li>• Access all premium features immediately</li>
                    </ul>
                </div>
                
                {/* Action buttons - responsive layout using Tailwind */}
                <div className="flex flex-col gap-3">
                    {/* Primary action - go to dashboard */}
                    <Link 
                        href="/dashboard" 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                    >
                        Go to Dashboard
                    </Link>
                    
                    {/* Secondary action - view billing */}
                    <Link 
                        href="/billing" 
                        className="w-full border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                    >
                        View Billing
                    </Link>
                </div>
                
                {/* Support link */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                        Need help? {' '}
                        <Link href="/support" className="text-blue-600 hover:text-blue-700 underline">
                            Contact Support
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}