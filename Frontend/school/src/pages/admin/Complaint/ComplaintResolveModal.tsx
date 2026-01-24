
import React, { useState } from 'react';
import { resolveComplaint } from '../../../services/complaintService';
import { toast } from 'react-toastify';

interface ComplaintResolveModalProps {
    isOpen: boolean;
    onClose: () => void;
    complaintId: string;
    onSuccess: () => void;
}

export const ComplaintResolveModal: React.FC<ComplaintResolveModalProps> = ({ isOpen, onClose, complaintId, onSuccess }) => {
    const [feedback, setFeedback] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!feedback.trim()) {
            toast.error("Please enter feedback/solution.");
            return;
        }

        try {
            setSubmitting(true);
            await resolveComplaint(complaintId, feedback);
            toast.success("Complaint resolved successfully!");
            onSuccess();
        } catch (error) {
            console.error("Error resolving complaint:", error);
            toast.error("Failed to resolve complaint.");
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">Resolve Complaint</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <span className="text-2xl">&times;</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-4">
                        <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
                            Feedback / Solution
                        </label>
                        <textarea
                            id="feedback"
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            placeholder="Enter the resolution details based on clean architecture..."
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Resolving...' : 'Submit Resolution'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
