import React, { useState, useEffect } from "react";
import * as authapi from "../../services/authapi";
import { toast } from "react-toastify";
import { useTheme } from "../../components/layout/ThemeContext";
import { PlusCircle, Calendar, Clock, XCircle } from "lucide-react";
import { getDecodedToken } from "../../utils/DecodeToken";
import type { CreateLeaveDTO } from "../../services/authapi";


interface LeaveRequest {
    _id: string;
    leaveType: string;
    startDate: string;
    endDate: string;
    reason: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    responseMessage?: string;
    createdAt: string;
}

const ParentLeavePage: React.FC = () => {
    const { isDark } = useTheme();
    const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [showModal, setShowModal] = useState<boolean>(false);

    // Form State
    const [leaveType, setLeaveType] = useState<string>("CASUAL");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [reason, setReason] = useState<string>("");

    const pageBg = isDark ? "bg-gray-900" : "bg-gray-50";
    const cardBg = isDark ? "bg-gray-800" : "bg-white";
    const textPrimary = isDark ? "text-white" : "text-gray-900";
    const textSecondary = isDark ? "text-gray-400" : "text-gray-600";
    const borderColor = isDark ? "border-gray-700" : "border-gray-200";

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const decoded = getDecodedToken();
            if (!decoded?.id) return;


            const profileData = await authapi.getParentProfile(decoded.id);
            console.log("profile data", profileData)

            if (profileData && profileData.profile && profileData.profile.student) {
                const studentDbId = profileData.profile.student._id;

                if (studentDbId) {
                    const history = await authapi.getStudentLeaveHistory(studentDbId);
                    setLeaves(history.data || []);
                }
            }
        } catch (error) {
            console.error("Error fetching leaves", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const decoded = getDecodedToken();
            if (!decoded?.id) {
                toast.error("User authentication failed.");
                return;
            }

            const profileData = await authapi.getParentProfile(decoded.id);
            const student = profileData?.profile?.student;
            const parentId = profileData?.profile?.parent?._id;

            if (!student) {
                toast.error("Student details not found.");
                return;
            }

            const studentId = student.id || student._id;
            console.log("studentId", studentId)

            let classId = "";
            if (student.classDetails && student.classDetails._id) {
                classId = student.classDetails._id;
            } else if (student.class) {
                classId = typeof student.class === 'string' ? student.class : student.class._id;
            }

            if (!studentId || !classId) {
                toast.error("Student or Class information missing.");
                return;
            }

            const payload: any = {
                studentId: studentId,
                classId: classId,
                parentId: parentId || decoded.id,
                leaveType: leaveType as "CASUAL" | "SICK" | "PAID" | "UNPAID" | "EXTRA",
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                reason
            };

            const leave = await authapi.applyStudentLeave(payload);
            console.log(leave)

            toast.success("Leave application submitted successfully!");
            setShowModal(false);
            fetchLeaves();
            setReason("");
            setStartDate("");
            setEndDate("");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to apply for leave");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "APPROVED": return "text-green-500 bg-green-100 dark:bg-green-900/30";
            case "REJECTED": return "text-red-500 bg-red-100 dark:bg-red-900/30";
            default: return "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30";
        }
    };

    return (
        <div className={`min-h-screen ${pageBg} p-6 transition-colors duration-200`}>
            <div className="max-w-7xl mx-auto space-y-6">

             
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className={`text-2xl font-bold ${textPrimary}`}>Student Leave Management</h1>
                        <p className={textSecondary}>Apply and track leave requests for your child</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                        <PlusCircle size={20} />
                        Apply for Leave
                    </button>
                </div>

               
                <div className={`${cardBg} rounded-xl shadow-sm border ${borderColor} overflow-hidden`}>
                    <div className={`p-6 border-b ${borderColor}`}>
                        <h2 className={`text-lg font-semibold ${textPrimary}`}>Leave History</h2>
                    </div>

                    {loading ? (
                        <div className="p-8 flex justify-center text-gray-500">Loading...</div>
                    ) : leaves.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No leave history found.</div>
                    ) : (
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {leaves.map((leave) => (
                                <div key={leave._id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(leave.status)}`}>
                                                {leave.status}
                                            </span>
                                            {leave.status !== "PENDING" && (
                                                <span className={`text-xs font-medium ${textSecondary}`}>
                                                    (By Class Teacher)
                                                </span>
                                            )}
                                            <span className={`text-sm font-medium ${textPrimary}`}>{leave.leaveType}</span>
                                        </div>
                                        <div className={`flex items-center gap-4 text-sm ${textSecondary}`}>
                                            <span className="flex items-center gap-1">
                                                <Calendar size={14} />
                                                {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock size={14} />
                                                Applied on {new Date(leave.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className={`text-sm ${textPrimary} mt-2`}>Reason: <span className={textSecondary}>{leave.reason}</span></p>
                                        {leave.responseMessage && (
                                            <p className="text-sm text-red-500 mt-1">Teacher's Remark: {leave.responseMessage}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>

         
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className={`${cardBg} w-full max-w-lg rounded-2xl shadow-xl border ${borderColor} p-6`}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className={`text-xl font-bold ${textPrimary}`}>Apply for Leave</h2>
                            <button onClick={() => setShowModal(false)} className={textSecondary + " hover:text-red-500"}>
                                <XCircle size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium ${textSecondary} mb-1`}>Leave Type</label>
                                <select
                                    value={leaveType}
                                    onChange={(e) => setLeaveType(e.target.value)}
                                    className={`w-full p-2 rounded-lg border ${borderColor} ${cardBg} ${textPrimary} focus:ring-2 focus:ring-indigo-500 outline-none`}
                                >
                                    <option value="CASUAL">Casual Leave</option>
                                    <option value="SICK">Sick Leave</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium ${textSecondary} mb-1`}>Start Date</label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className={`w-full p-2 rounded-lg border ${borderColor} ${cardBg} ${textPrimary} focus:ring-2 focus:ring-indigo-500 outline-none`}
                                        
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium ${textSecondary} mb-1`}>End Date</label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className={`w-full p-2 rounded-lg border ${borderColor} ${cardBg} ${textPrimary} focus:ring-2 focus:ring-indigo-500 outline-none`}
                                        
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium ${textSecondary} mb-1`}>Reason</label>
                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    rows={3}
                                    className={`w-full p-2 rounded-lg border ${borderColor} ${cardBg} ${textPrimary} focus:ring-2 focus:ring-indigo-500 outline-none`}
                                    placeholder="Please allow leave for..."
                                    
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className={`px-4 py-2 rounded-lg border ${borderColor} ${textSecondary} hover:bg-gray-100 dark:hover:bg-gray-700`}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                >
                                    Submit Application
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ParentLeavePage;
