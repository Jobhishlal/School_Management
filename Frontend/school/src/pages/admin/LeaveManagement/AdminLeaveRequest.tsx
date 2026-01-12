import React, { useEffect, useState } from "react";
import { GetAllLeavesRequest, UpdateLeaveStatus } from "../../../services/authapi";
import type { LeaveRequestEntity } from "../../../types/LeaveRequest/CreateLeaveRequest";
import { showToast } from "../../../utils/toast";
import { useTheme } from "../../../components/layout/ThemeContext";
import { Modal } from "../../../components/common/Modal";
import { Pagination } from "../../../components/common/Pagination"; // Import Pagination

export const AdminLeaveRequest: React.FC = () => {
    const { isDark } = useTheme();
    const [leaves, setLeaves] = useState<LeaveRequestEntity[]>([]);

   
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;


    const totalPages = Math.ceil(leaves.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentLeaves = leaves.slice(startIndex, startIndex + itemsPerPage);

    const [loading, setLoading] = useState(false);
    const [selectedLeave, setSelectedLeave] = useState<LeaveRequestEntity | null>(null);


    const fetchLeaves = async () => {
        try {
            setLoading(true);
            const data = await GetAllLeavesRequest();
            setLeaves(data);
        } catch (error) {
            console.error("Failed to fetch leaves", error);
            showToast("Failed to fetch leave requests", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const handleAction = async (leaveId: string, status: "APPROVED" | "REJECTED", e?: React.MouseEvent) => {
        if (e) e.stopPropagation();

        let remark = "";
        if (status === "REJECTED") {
            const input = prompt("Enter remark for rejection:");
            if (input === null) return;
            remark = input;
        } else {

            const input = prompt("Enter remark (optional):");
            if (input !== null) remark = input;
        }

        try {
            await UpdateLeaveStatus(leaveId, status, remark);
            showToast(`Leave ${status.toLowerCase()} successfully`, "success");
            fetchLeaves();
            if (selectedLeave?.id === leaveId) {
                setSelectedLeave(null);
            }
        } catch (error: any) {
            showToast(error?.response?.data?.message || "Action failed", "error");
        }
    };

    const openModal = (leave: LeaveRequestEntity) => {
        setSelectedLeave(leave);
    };

    const closeModal = () => {
        setSelectedLeave(null);
    };

    return (
        <div className={`p-6 min-h-screen ${isDark ? "bg-[#1a2632] text-white" : "bg-gray-50 text-gray-900"}`}>
            <div className="flex justify-between items-center mb-6">
                <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}>Leave Requests</h1>
                <div className={`p-4 rounded shadow-sm text-sm border ${isDark ? "bg-[#0d1117] border-gray-700" : "bg-white border-gray-100"}`}>
                    <span className={`font-semibold block mb-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}>Total Yearly Limits:</span>
                    <div className="flex gap-4">
                        <span className="font-medium text-green-500">Sick Leave: 5</span>
                        <span className="font-medium text-blue-500">Casual Leave: 5</span>
                    </div>
                </div>
            </div>

            <div className={`rounded-lg shadow overflow-hidden border ${isDark ? "bg-[#0d1117] border-gray-700" : "bg-white border-gray-200"}`}>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y">
                        <thead className={isDark ? "bg-[#161b22] text-gray-300" : "bg-gray-50 text-gray-500"}>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Teacher</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Duration</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Reason</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Warning</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDark ? "divide-gray-700 bg-[#0d1117]" : "divide-gray-200 bg-white"}`}>
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className={`text-center py-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Loading...</td>
                                </tr>
                            ) : currentLeaves.map((leave) => (
                                <tr
                                    key={leave.id}
                                    onClick={() => openModal(leave)}
                                    className={`cursor-pointer transition-colors ${isDark ? "hover:bg-[#161b22]" : "hover:bg-gray-50"}`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-900"}`}>
                                            {leave.applicantRole === "SUB_ADMIN" ? (
                                                <span className="flex items-center gap-2">
                                                    {leave.subAdminName || "SubAdmin"}
                                                    <span className="px-1.5 py-0.5 text-[10px] rounded bg-purple-100 text-purple-800 font-bold border border-purple-200">SA</span>
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2">
                                                    {leave.teacherName || leave.teacherId}
                                                    <span className="px-1.5 py-0.5 text-[10px] rounded bg-blue-100 text-blue-800 font-bold border border-blue-200">T</span>
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${leave.leaveType === 'SICK' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {leave.leaveType}
                                        </span>
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                                        {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                        <span className={`block text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>({leave.totalDays} days)</span>
                                    </td>
                                    <td className={`px-6 py-4 text-sm max-w-xs truncate ${isDark ? "text-gray-400" : "text-gray-500"}`} title={leave.reason}>
                                        {leave.reason}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {leave.warningMessage ? (
                                            <span className="text-xs font-bold text-red-600 bg-red-50 p-1 rounded border border-red-200 block max-w-xs whitespace-normal">
                                                ⚠️ {leave.warningMessage}
                                            </span>
                                        ) : (
                                            <span className="text-green-500 text-xs">No Warnings</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${leave.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                            leave.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {leave.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button
                                            onClick={(e) => handleAction(leave.id, "APPROVED", e)}
                                            disabled={leave.status !== 'PENDING'}
                                            className={`text-indigo-600 hover:text-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed ${isDark ? "hover:text-indigo-400 disabled:text-gray-600" : ""}`}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={(e) => handleAction(leave.id, "REJECTED", e)}
                                            disabled={leave.status !== 'PENDING'}
                                            className={`text-red-600 hover:text-red-900 disabled:text-gray-400 disabled:cursor-not-allowed ${isDark ? "hover:text-red-400 disabled:text-gray-600" : ""}`}
                                        >
                                            Reject
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {!loading && leaves.length === 0 && (
                                <tr>
                                    <td colSpan={7} className={`text-center py-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}>No leave requests found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

             
                <div className={`p-4 border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>

            <Modal
                isOpen={!!selectedLeave}
                onClose={closeModal}
                title="Leave Request Details"
            >
                {selectedLeave && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Applicant</label>
                                <p className={`text-base font-medium ${isDark ? "text-gray-200" : "text-gray-900"}`}>
                                    {selectedLeave.applicantRole === "SUB_ADMIN" ? selectedLeave.subAdminName : (selectedLeave.teacherName || selectedLeave.teacherId)}
                                    <span className={`ml-2 text-xs font-normal ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                                        ({selectedLeave.applicantRole === "SUB_ADMIN" ? "SubAdmin" : "Teacher"})
                                    </span>
                                </p>
                            </div>
                            <div>
                                <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Leave Type</label>
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${selectedLeave.leaveType === 'SICK' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                                    }`}>
                                    {selectedLeave.leaveType}
                                </span>
                            </div>
                            <div>
                                <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Duration</label>
                                <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                                    {new Date(selectedLeave.startDate).toLocaleDateString()} - {new Date(selectedLeave.endDate).toLocaleDateString()}
                                </p>
                                <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>Total: {selectedLeave.totalDays} days</p>
                            </div>
                            <div>
                                <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Status</label>
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${selectedLeave.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                    selectedLeave.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {selectedLeave.status}
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Reason</label>
                            <div className={`p-3 rounded-md text-sm ${isDark ? "bg-[#161b22] text-gray-300 border border-gray-700" : "bg-gray-50 text-gray-800 border border-gray-100"}`}>
                                {selectedLeave.reason}
                            </div>
                        </div>

                        {selectedLeave.warningMessage && (
                            <div>
                                <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>System Warning</label>
                                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                                    <div className="flex items-start">
                                        <span className="text-lg mr-2">⚠️</span>
                                        <p className="text-sm text-red-700 font-medium">{selectedLeave.warningMessage}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {selectedLeave.adminRemark && (
                            <div>
                                <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Admin Remark</label>
                                <p className={`text-sm italic ${isDark ? "text-gray-400" : "text-gray-600"}`}>{selectedLeave.adminRemark}</p>
                            </div>
                        )}

                        {selectedLeave.status === 'PENDING' && (
                            <div className={`pt-4 border-t flex justify-end gap-3 ${isDark ? "border-gray-700" : "border-gray-100"}`}>
                                <button
                                    onClick={() => handleAction(selectedLeave.id, "REJECTED")}
                                    className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                >
                                    Reject Request
                                </button>
                                <button
                                    onClick={() => handleAction(selectedLeave.id, "APPROVED")}
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
                                >
                                    Approve Request
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};
