
'use client';
import { useState } from 'react';
import axios from 'axios';

const FormNewBoard = () => {
    const [formData, setFormData] = useState({
        boardName: '',
        description: '',
        category: 'feedback'
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.boardName.trim()) {
            alert('Board name is required');
            return;
        }
        
        setIsLoading(true);
        try {
            const response = await axios.post('/api/board', {
                name: formData.boardName.trim(),
                description: formData.description.trim(),
                category: formData.category
            });

            const data = response.data;
            
            // Reset form after successful creation
            setFormData({
                boardName: '',
                description: '',
                category: 'feedback'
            });
            
            alert('Board created successfully!');
            console.log('Board created:', data.board);
            
        } catch (error) {
            console.error('Error creating board:', error);
            
            // Handle axios error structure
            const errorMessage = error.response?.data?.error || error.message || 'Failed to create board';
            
            // Handle specific error cases
            if (errorMessage.includes('Unauthorized')) {
                alert('Please sign in to create a board.');
            } else if (errorMessage.includes('required')) {
                alert('Board name is required.');
            } else {
                alert(`Failed to create board: ${errorMessage}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title text-2xl mb-6 text-center">Create New Feedback Board</h2>
                    
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
                                placeholder="Enter your board name..."
                                className="input input-bordered w-full focus:input-primary"
                                required
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
                            required
                            type="date"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Describe the purpose of this feedback board..."
                                className="textarea textarea-bordered h-24 resize-none focus:textarea-primary"
                                rows="3"
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
                                className="select select-bordered w-full focus:select-primary"
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
                                className="btn btn-primary btn-lg w-full"
                                disabled={isLoading || !formData.boardName.trim()}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="loading loading-spinner loading-md"></span>
                                        Creating Board...
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                        </svg>
                                        Create Board
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Info Alert */}
                    <div className="alert alert-info mt-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span className="text-sm">Your feedback board will be publicly accessible once created.</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormNewBoard;