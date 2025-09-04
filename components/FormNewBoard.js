
'use client';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const FormNewBoard = ({ userHasAccess = false }) => {
    const [formData, setFormData] = useState({
        boardName: '',
        description: '',
        category: 'feedback'
    });
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Check if user has premium access before allowing board creation
        if (!userHasAccess) {
            toast.error('Premium subscription required to create boards');
            console.log('Toast error: Premium subscription required');
            return;
        }
        
        if (!formData.boardName.trim()) {
            toast.error('Board name is required');
            console.log('Toast error: Board name is required');
            return;
        }
        
        setIsLoading(true);
        try {
            const { data } = await axios.post('/api/board', {
                name: formData.boardName.trim(),
                description: formData.description.trim(),
                category: formData.category
            });
            
            // Only show success and reset form if request was successful
            setFormData({ boardName: '', description: '', category: 'feedback' });
            console.log('Toast success: Board created successfully!');
            console.log('Board created:', data.board);
            toast.success('Board created successfully!');
            
            // Refresh the page to show the new board immediately
            router.refresh();
            console.log('Page refreshed to show new board');

            
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Failed to create board';
            const toastMessage = errorMessage.includes('Unauthorized') 
                ? 'Please sign in to create a board.' 
                : `Failed to create board: ${errorMessage}`;
            console.log('Toast error:', toastMessage);
            console.log('Board creation error:', error);
            toast.error(toastMessage);

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <div className={`card shadow-xl ${userHasAccess ? 'bg-white border border-gray-200' : 'bg-gray-50 border border-gray-300'}`}>
                <div className="card-body">
                    {/* Premium indicator for non-premium users */}
                    {!userHasAccess && (
                        <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-3 py-2 rounded-lg text-sm mb-4 text-center">
                            🔒 Premium Feature - Subscribe to create boards
                        </div>
                    )}
                    
                    <h2 className="text-xl font-bold mb-6 text-center text-gray-900">Create New Feedback Board</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Board Name Input */}
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-semibold">Board Name</span>
                                <span className="label-text-alt text-error">*</span>
                            </label>
                            <input
                                type="text"
                                name="boardName"
                                value={formData.boardName}
                                onChange={handleInputChange}
                                placeholder={userHasAccess ? "Enter your board name..." : "Upgrade to premium to create boards"}
                                className={`w-full px-3 py-2 border rounded-lg ${userHasAccess ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500' : 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed'}`}
                                required
                                disabled={!userHasAccess}
                            />
                            <label className="label">
                                <span className="label-text-alt">Choose a clear, descriptive name</span>
                            </label>
                        </div>

                        {/* Description Input */}
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-semibold">Description</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder={userHasAccess ? "Describe the purpose of this feedback board..." : "Premium required"}
                                className={`w-full px-3 py-2 border rounded-lg h-24 resize-none ${userHasAccess ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500' : 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed'}`}
                                rows="3"
                                disabled={!userHasAccess}
                            />
                            <label className="label">
                                <span className="label-text-alt">Optional: Help users understand what feedback you&apos;re looking for</span>
                            </label>
                        </div>

                        {/* Category Select */}
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-semibold">Category</span>
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-lg ${userHasAccess ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500' : 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed'}`}
                                disabled={!userHasAccess}
                            >
                                <option value="feedback">General Feedback</option>
                                <option value="feature">Feature Request</option>
                                <option value="bug">Bug Report</option>
                                <option value="improvement">Improvement</option>
                                <option value="question">Question</option>
                            </select>
                        </div>

                        {/* Submit Button */}
                        <div className="form-control mt-8">
                            <button
                                type="submit"
                                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
                                    userHasAccess 
                                        ? isLoading || !formData.boardName.trim()
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                                disabled={!userHasAccess || isLoading || !formData.boardName.trim()}
                            >
                                {!userHasAccess ? (
                                    '🔒 Upgrade to Premium'
                                ) : isLoading ? (
                                    'Creating Board...'
                                ) : (
                                    'Create Board'
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Info Alert - different messages based on access */}
                    <div className={`mt-4 p-3 rounded-lg border text-sm ${
                        userHasAccess 
                            ? 'bg-blue-50 border-blue-200 text-blue-800'
                            : 'bg-orange-50 border-orange-200 text-orange-800'
                    }`}>
                        {userHasAccess ? (
                            <span>ℹ️ Your feedback board will be publicly accessible once created.</span>
                        ) : (
                            <span>💡 Upgrade to premium to create unlimited feedback boards and unlock all features.</span>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default FormNewBoard;