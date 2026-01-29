import React, { useEffect, useState } from 'react';
import { getAllComplaints, resolveComplaint } from '../../../services/complaintService';
import { toast } from 'react-toastify';
import { useTheme } from '../../../components/layout/ThemeContext';
import { Modal } from '../../../components/common/Modal';
import { FaSearch } from 'react-icons/fa';
import { Eye, CheckCircle } from 'lucide-react';
import { Pagination } from '../../../components/common/Pagination';

interface Complaint {
    id: string;
    studentName: string;
    description: string;
    concernTitle: string;
    concernDate: string;
    ticketStatus: 'Pending' | 'solved';
    adminFeedback?: string;
}

const ComplaintList: React.FC = () => {
    const { isDark } = useTheme();
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            const data = await getAllComplaints(page, 10);
            setComplaints(data.complaints);
            setFilteredComplaints(data.complaints);
            setTotalPages(Math.ceil(data.total / 10));
        } catch (error) {
            console.error("Failed to fetch complaints", error);
            toast.error("Failed to load complaints");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, [page]);

    useEffect(() => {
        const filtered = complaints.filter(c =>
            c.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.concernTitle.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredComplaints(filtered);
    }, [searchTerm, complaints]);

    const handleViewClick = (complaint: Complaint) => {
        setSelectedComplaint(complaint);
        setFeedback(''); // Reset feedback
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedComplaint(null);
        setFeedback('');
    };

    const handleSubmitResolution = async () => {
        if (!selectedComplaint || !feedback.trim()) {
            toast.warning("Please enter feedback");
            return;
        }

        try {
            setSubmitting(true);
            await resolveComplaint(selectedComplaint.id, feedback);
            toast.success("Complaint resolved successfully");
            handleCloseModal();
            fetchComplaints();
        } catch (error) {
            console.error("Error resolving complaint:", error);
            toast.error("Failed to resolve complaint");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={`min-h-screen p-2 sm:p-4 md:p-6 lg:p-8 ${isDark ? "bg-[#121A21] text-slate-100" : "bg-slate-50 text-slate-900"}`}>
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col space-y-4 mb-4 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Parent Complaints</h2>
                    <p className={`text-sm ${isDark ? "text-slate-400" : "text-gray-600"}`}>Manage and resolve parent concerns.</p>

                    {/* Search */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Search by student name or title"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`w-full py-2.5 pl-10 pr-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${isDark ? "bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400" : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"}`}
                            />
                            <FaSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-slate-400" : "text-gray-500"}`} />
                        </div>
                    </div>
                </div>

                <div className={`rounded-lg overflow-hidden ${isDark ? "bg-slate-800/50" : "bg-white"} shadow-sm`}>
                    {loading ? (
                        <div className="p-8 sm:p-12 text-center">
                            <div className="inline-flex items-center justify-center w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-base sm:text-lg font-medium">Loading complaints...</p>
                        </div>
                    ) : filteredComplaints.length === 0 ? (
                        <div className="p-8 sm:p-12 text-center">
                            <p className="text-base sm:text-lg font-medium">No complaints found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className={`w-full text-sm text-left ${isDark ? "text-slate-300" : "text-gray-500"}`}>
                                <thead className={`text-xs uppercase ${isDark ? "bg-slate-700/50 text-slate-300" : "bg-gray-50 text-gray-700"}`}>
                                    <tr>
                                        <th className="px-6 py-3">Student</th>
                                        <th className="px-6 py-3">Title</th>
                                        <th className="px-6 py-3">Description</th>
                                        <th className="px-6 py-3">Date</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredComplaints.map((complaint) => (
                                        <tr key={complaint.id} className={`border-b ${isDark ? "border-slate-700 hover:bg-slate-700/30" : "border-gray-100 hover:bg-gray-50"}`}>
                                            <td className="px-6 py-4 font-medium">{complaint.studentName || 'N/A'}</td>
                                            <td className="px-6 py-4">{complaint.concernTitle}</td>
                                            <td className="px-6 py-4 max-w-xs truncate" title={complaint.description}>{complaint.description}</td>
                                            <td className="px-6 py-4">{new Date(complaint.concernDate).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${complaint.ticketStatus === 'solved' ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"}`}>
                                                    {complaint.ticketStatus}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    {complaint.ticketStatus !== 'solved' && (
                                                        <button
                                                            onClick={() => handleViewClick(complaint)}
                                                            className={`p-2 rounded-full transition-colors ${isDark ? "hover:bg-slate-700 text-blue-400" : "hover:bg-gray-100 text-blue-600"}`}
                                                            title="View Details"
                                                        >
                                                            <Eye size={18} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {totalPages > 1 && (
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                )}

                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title="Complaint Details"
                >
                    {selectedComplaint && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <label className={`block font-medium mb-1 ${isDark ? "text-slate-400" : "text-gray-500"}`}>Student Name</label>
                                    <p className={`font-semibold ${isDark ? "text-slate-200" : "text-gray-800"}`}>{selectedComplaint.studentName || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className={`block font-medium mb-1 ${isDark ? "text-slate-400" : "text-gray-500"}`}>Date</label>
                                    <p className={`font-semibold ${isDark ? "text-slate-200" : "text-gray-800"}`}>{new Date(selectedComplaint.concernDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <label className={`block font-medium mb-1 ${isDark ? "text-slate-400" : "text-gray-500"}`}>Current Status</label>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium inline-block mt-1 ${selectedComplaint.ticketStatus === 'solved' ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"}`}>
                                        {selectedComplaint.ticketStatus}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-400" : "text-gray-500"}`}>Concern Title</label>
                                <div className={`p-3 rounded-lg border ${isDark ? "bg-slate-800/50 border-slate-700 text-slate-200" : "bg-gray-50 border-gray-200 text-gray-800"}`}>
                                    {selectedComplaint.concernTitle}
                                </div>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-400" : "text-gray-500"}`}>Description</label>
                                <div className={`p-3 rounded-lg border h-24 overflow-y-auto ${isDark ? "bg-slate-800/50 border-slate-700 text-slate-200" : "bg-gray-50 border-gray-200 text-gray-800"}`}>
                                    {selectedComplaint.description}
                                </div>
                            </div>

                            {selectedComplaint.ticketStatus === 'solved' ? (
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-400" : "text-gray-500"}`}>Admin Feedback / Solution</label>
                                    <div className={`p-3 rounded-lg border ${isDark ? "border-green-800/30 bg-green-900/10 text-slate-200" : "border-green-200 bg-green-50 text-gray-800"}`}>
                                        {selectedComplaint.adminFeedback}
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-gray-700"}`}>
                                        Resolve & Provide Feedback *
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        placeholder="Enter resolution details..."
                                        className={`w-full px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none ${isDark ? "bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400" : "bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500"}`}
                                    />
                                    <div className="flex justify-end pt-4">
                                        <button
                                            onClick={handleSubmitResolution}
                                            disabled={submitting}
                                            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 text-sm transition-colors disabled:opacity-50"
                                        >
                                            {submitting ? (
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <>
                                                    <CheckCircle size={16} />
                                                    Submit Resolution
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end pt-2 border-t border-gray-200/10">
                                <button
                                    onClick={handleCloseModal}
                                    className={`px-4 py-2 rounded-lg font-medium border text-sm transition-colors ${isDark ? "bg-transparent border-slate-600 text-slate-400 hover:bg-slate-700" : "bg-transparent border-gray-300 text-gray-500 hover:bg-gray-50"}`}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </div>
    );
};

export default ComplaintList;
