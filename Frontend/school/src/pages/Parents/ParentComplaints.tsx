import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { createComplaint, getMyComplaints, updateComplaint } from '../../services/parentService';
import { MessageCircle, Send, AlertCircle, RefreshCw, PenSquare, X } from 'lucide-react';
import { useTheme } from '../../components/layout/ThemeContext';

interface Complaint {
    _id: string; // Or id, depending on backend response. Usually _id from Mongo.
    parentId: string;
    concernTitle: string;
    description: string;
    ticketStatus: string;
    concernDate: string;
    id?: string;
}

interface ComplaintForm {
    concernTitle: string;
    description: string;
}

const ParentComplaints: React.FC = () => {
    const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<ComplaintForm>();
    const { isDark } = useTheme();
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            const data = await getMyComplaints();
            // Ensure we handle the structure correctly { complaints: [...] } or [...]
            setComplaints(data.complaints || data || []);
        } catch (error) {
            console.error("Error fetching complaints", error);
            toast.error("Failed to load complaints.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const onSubmit = async (data: ComplaintForm) => {
        try {
            if (editingId) {
                await updateComplaint(editingId, data.concernTitle, data.description);
                toast.success("Complaint updated successfully!");
                setEditingId(null);
            } else {
                await createComplaint(data.concernTitle, data.description);
                toast.success("Complaint submitted successfully!");
            }
            reset();
            fetchComplaints();
        } catch (error: any) {
            console.error("Error submitting complaint", error);
            const message = error.response?.data?.message || "Failed to submit complaint";
            toast.error(message);
        }
    };

    const handleEdit = (complaint: Complaint) => {
        setEditingId(complaint.id || complaint._id);
        setValue('concernTitle', complaint.concernTitle);
        setValue('description', complaint.description);
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        reset();
    };

    const cardBg = isDark ? "bg-[#1E293B]" : "bg-white";
    const textPrimary = isDark ? "text-slate-100" : "text-slate-900";
    const textSecondary = isDark ? "text-slate-400" : "text-slate-600";
    const numberText = isDark ? "text-slate-300" : "text-slate-700";
    const inputBg = isDark ? "bg-[#0F172A]" : "bg-slate-50";
    const borderColor = isDark ? "border-slate-700" : "border-slate-200";

    return (
        <div className={`min-h-screen p-6 ${isDark ? "bg-[#0F172A]" : "bg-slate-50"}`}>
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20">
                        <MessageCircle className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className={`text-2xl font-bold ${textPrimary}`}>My Complaints & Concerns</h1>
                        <p className={textSecondary}>Track and manage your interactions with the school administration</p>
                    </div>
                </div>

                {/* Form Card */}
                <div className={`${cardBg} rounded-2xl shadow-xl border ${borderColor} overflow-hidden`}>
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                        <h2 className={`text-lg font-semibold ${textPrimary}`}>
                            {editingId ? "Edit Complaint" : "Raise a New Concern"}
                        </h2>
                        {editingId && (
                            <button
                                onClick={cancelEdit}
                                className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
                            >
                                <X size={16} /> Cancel Edit
                            </button>
                        )}
                    </div>
                    <div className="p-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                            {/* Concern Title */}
                            <div className="space-y-2">
                                <label className={`block text-sm font-semibold ${textPrimary}`}>
                                    Subject / Title
                                </label>
                                <input
                                    {...register("concernTitle", { required: "Title is required" })}
                                    className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${inputBg} ${textPrimary} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none`}
                                    placeholder="Briefly describe your concern..."
                                />
                                {errors.concernTitle && (
                                    <div className="flex items-center space-x-2 text-red-500 text-sm mt-1">
                                        <AlertCircle size={14} />
                                        <span>{errors.concernTitle.message}</span>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className={`block text-sm font-semibold ${textPrimary}`}>
                                    Detailed Description
                                </label>
                                <textarea
                                    {...register("description", { required: "Description is required" })}
                                    rows={4}
                                    className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${inputBg} ${textPrimary} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none resize-none`}
                                    placeholder="Please provide clearer details about your concern..."
                                />
                                {errors.description && (
                                    <div className="flex items-center space-x-2 text-red-500 text-sm mt-1">
                                        <AlertCircle size={14} />
                                        <span>{errors.description.message}</span>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`flex items-center space-x-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/30 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {isSubmitting ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Send size={18} />
                                            <span>{editingId ? "Update Complaint" : "Submit Ticket"}</span>
                                        </>
                                    )}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>

                {/* Complaints List */}
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <h2 className={`text-xl font-bold ${textPrimary}`}>Submited Concerns</h2>
                        <button onClick={fetchComplaints} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                        </button>
                    </div>

                    {loading && complaints.length === 0 ? (
                        <div className="text-center py-10">
                            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
                            <p className={textSecondary}>Loading tickets...</p>
                        </div>
                    ) : complaints.length === 0 ? (
                        <div className={`p-8 rounded-2xl border ${borderColor} ${cardBg} text-center`}>
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MessageCircle className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className={`text-lg font-semibold ${textPrimary}`}>No complaints found</h3>
                            <p className={textSecondary}>You haven't submitted any complaints yet.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {complaints.map((complaint) => (
                                <div key={complaint.id || complaint._id} className={`${cardBg} p-6 rounded-2xl border ${borderColor} shadow-sm hover:shadow-md transition-shadow`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="space-y-1">
                                            <h3 className={`text-lg font-semibold ${textPrimary}`}>{complaint.concernTitle}</h3>
                                            <div className="flex items-center space-x-3 text-xs">
                                                <span className={`px-2.5 py-1 rounded-full font-medium ${complaint.ticketStatus === 'Open' ? 'bg-green-100 text-green-700' :
                                                        complaint.ticketStatus === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {complaint.ticketStatus || 'Open'}
                                                </span>
                                                <span className={textSecondary}>
                                                    {new Date(complaint.concernDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEdit(complaint)}
                                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"
                                                title="Edit Complaint"
                                            >
                                                <PenSquare size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className={`${textSecondary} text-sm leading-relaxed`}>
                                        {complaint.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ParentComplaints;
