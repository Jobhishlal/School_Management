import React, { useState, useEffect } from "react";
import * as authapi from "../../../services/authapi";
import { toast } from "react-toastify";
import { useTheme } from "../../../components/layout/ThemeContext";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface LeaveRequest {
    id: string;
    leaveType: string;
    startDate: string;
    endDate: string;
    reason: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    studentId: {
        fullName: string;
        studentId: string;
        _id: string;
    };
    createdAt: string;
}

const TeacherStudentLeavePage: React.FC = () => {
    const { isDark } = useTheme();
    const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
    const [remarks, setRemarks] = useState<string>("");
    const [actionType, setActionType] = useState<"APPROVED" | "REJECTED" | null>(null);

    const pageBg = isDark ? "bg-gray-900" : "bg-gray-50";
    const cardBg = isDark ? "bg-gray-800" : "bg-white";
    const textPrimary = isDark ? "text-white" : "text-gray-900";
    const textSecondary = isDark ? "text-gray-400" : "text-gray-600";
    const borderColor = isDark ? "border-gray-700" : "border-gray-200";

    useEffect(() => {
        console.log("TeacherStudentLeavePage mounted");
        fetchClassLeaves();
    }, []);

    const fetchClassLeaves = async () => {
        try {

            const classData = await authapi.getTeacherClass();
            console.log("TeacherStudentLeavePage fetched classData:", classData);
            if (classData && classData.data && classData.data.classInfo) {
                const classId = classData.data.classInfo._id;
                console.log("Teacher Class ID used for fetching leaves:", classId);
                const leavesData = await authapi.getClassStudentLeaves(classId);
                console.log("Fetched Leaves Response:", leavesData);
                setLeaves(leavesData.data || []);
            } else {
                toast.error("You are not assigned as a Class Teacher.");
            }
        } catch (error) {
            console.error("Error fetching class leaves", error);

        } finally {
            setLoading(false);
        }
    };

    const handleActionClick = (leave: LeaveRequest, type: "APPROVED" | "REJECTED") => {
        setSelectedLeave(leave);
        setActionType(type);
        setRemarks(type === "APPROVED" ? "Granted." : "Rejected.");
    };

    const confirmAction = async () => {
        if (!selectedLeave || !actionType) return;

        try {
            await authapi.updateStudentLeaveStatus(selectedLeave.id, actionType, remarks);
            toast.success(`Leave request ${actionType.toLowerCase()} successfully`);
            setSelectedLeave(null);
            setActionType(null);
            fetchClassLeaves(); // Refresh list
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update leave status");
        }
    };

    return (
        <div className={`min-h-screen ${pageBg} p-6 transition-colors duration-200`}>
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div>
                    <h1 className={`text-2xl font-bold ${textPrimary}`}>Student Leave Approvals</h1>
                    <p className={textSecondary}>Review pending leave requests from your students</p>
                </div>

                {/* List */}
                <div className={`${cardBg} rounded-xl shadow-sm border ${borderColor} overflow-hidden`}>
                    <div className={`p-6 border-b ${borderColor} flex justify-between items-center`}>
                        <h2 className={`text-lg font-semibold ${textPrimary}`}>Pending Requests</h2>
                        <span className={`px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium`}>
                            {leaves.length} Pending
                        </span>
                    </div>

                    {loading ? (
                        <div className="p-8 flex justify-center text-gray-500">Loading...</div>
                    ) : leaves.length === 0 ? (
                        <div className="p-12 text-center flex flex-col items-center gap-3">
                            <CheckCircle size={48} className="text-green-500 opacity-50" />
                            <p className={textSecondary}>All caught up! No pending leave requests.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {leaves.map((leave) => (
                                <div key={leave.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                    <div className="flex flex-col md:flex-row justify-between gap-4">
                                        <div className="space-y-2 flex-1">
                                            <div className="flex items-center gap-3">
                                                <h3 className={`text-lg font-bold ${textPrimary}`}>
                                                    {leave.studentId?.fullName || "Student Name"}
                                                </h3>
                                                <span className={`px-2 py-0.5 rounded text-xs font-bold border ${borderColor} ${textSecondary}`}>
                                                    {leave.studentId?.studentId}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800`}>
                                                    {leave.leaveType}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-6 text-sm">
                                                <span className={`flex items-center gap-1 ${textSecondary}`}>
                                                    <Clock size={16} />
                                                    {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                                </span>
                                                <span className={textSecondary}>
                                                    Applied: {new Date(leave.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>

                                            <div className={`p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border ${borderColor}`}>
                                                <p className={`text-sm ${textPrimary} italic`}>"{leave.reason}"</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-row md:flex-col gap-2 justify-center">
                                            <button
                                                onClick={() => handleActionClick(leave, "APPROVED")}
                                                className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition shadow-sm"
                                            >
                                                <CheckCircle size={16} /> Approve
                                            </button>
                                            <button
                                                onClick={() => handleActionClick(leave, "REJECTED")}
                                                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition shadow-sm"
                                            >
                                                <XCircle size={16} /> Reject
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Action Modal */}
            {selectedLeave && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className={`${cardBg} w-full max-w-md rounded-2xl shadow-xl border ${borderColor} p-6 transform transition-all`}>
                        <div className="text-center mb-6">
                            {actionType === "APPROVED" ? (
                                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                                    <CheckCircle className="text-green-600" size={24} />
                                </div>
                            ) : (
                                <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
                                    <XCircle className="text-red-600" size={24} />
                                </div>
                            )}
                            <h3 className={`text-xl font-bold ${textPrimary}`}>
                                {actionType === "APPROVED" ? "Approve" : "Reject"} Request?
                            </h3>
                            <p className={`text-sm ${textSecondary} mt-1`}>
                                You are about to {actionType?.toLowerCase()} the leave request for <b>{selectedLeave.studentId?.fullName}</b>.
                            </p>
                        </div>

                        <div className="mb-6">
                            <label className={`block text-sm font-medium ${textPrimary} mb-2`}>
                                Add Remarks (Optional)
                            </label>
                            <textarea
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                className={`w-full p-3 rounded-lg border ${borderColor} ${cardBg} ${textPrimary} focus:ring-2 focus:ring-indigo-500 outline-none resize-none`}
                                rows={3}
                                placeholder="Enter any comments for the parent..."
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setSelectedLeave(null)}
                                className={`flex-1 py-2.5 rounded-lg border ${borderColor} ${textPrimary} font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmAction}
                                className={`flex-1 py-2.5 rounded-lg text-white font-medium shadow-sm transition ${actionType === "APPROVED" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                                    }`}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default TeacherStudentLeavePage;
