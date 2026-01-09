import React, { useEffect, useState } from "react";
import { GetAllLeavesRequest, UpdateLeaveStatus } from "../../../services/authapi";
import type { LeaveRequestEntity } from "../../../types/LeaveRequest/CreateLeaveRequest";
import { showToast } from "../../../utils/toast";

export const AdminLeaveRequest: React.FC = () => {
    const [leaves, setLeaves] = useState<LeaveRequestEntity[]>([]);
    const [loading, setLoading] = useState(false);


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

    const handleAction = async (leaveId: string, status: "APPROVED" | "REJECTED") => {
        let remark = "";
        if (status === "REJECTED") {
            const input = prompt("Enter remark for rejection:");
            if (input === null) return;
            remark = input;
        } else {
            // Optional remark for approval
            const input = prompt("Enter remark (optional):");
            if (input !== null) remark = input;
        }

        try {
            await UpdateLeaveStatus(leaveId, status, remark);
            showToast(`Leave ${status.toLowerCase()} successfully`, "success");
            fetchLeaves(); // Refresh list
        } catch (error: any) {
            showToast(error?.response?.data?.message || "Action failed", "error");
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Leave Requests</h1>
                <div className="bg-white p-3 rounded shadow text-sm">
                    <span className="font-semibold block text-gray-600">Total Yearly Limits:</span>
                    <span className="text-green-600 mr-4">Sick Leave: 5</span>
                    <span className="text-blue-600">Casual Leave: 5</span>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warning</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-4">Loading...</td>
                                </tr>
                            ) : leaves.map((leave) => (
                                <tr key={leave.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{leave.teacherName || leave.teacherId}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${leave.leaveType === 'SICK' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {leave.leaveType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                        <span className="block text-xs text-gray-400">({leave.totalDays} days)</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={leave.reason}>
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
                                            onClick={() => handleAction(leave.id, "APPROVED")}
                                            disabled={leave.status !== 'PENDING'}
                                            className={`text-indigo-600 hover:text-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed`}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleAction(leave.id, "REJECTED")}
                                            disabled={leave.status !== 'PENDING'}
                                            className={`text-red-600 hover:text-red-900 disabled:text-gray-400 disabled:cursor-not-allowed`}
                                        >
                                            Reject
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {!loading && leaves.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="text-center py-4">No leave requests found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
