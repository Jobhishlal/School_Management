import React, { useState, useEffect } from "react";
import { FormLayout } from "../../../components/Form/FormLayout";
import { TextInput } from "../../../components/Form/TextInput";
import { SelectInput } from "../../../components/Form/SelectInput";
import { Pagination } from "../../../components/common/Pagination";
import { CreateLeaveRequestSubAdmin, GetSubAdminLeavesRequest, getAdminProfile } from "../../../services/authapi";
import { showToast } from "../../../utils/toast";
import type { LeaveRequestEntity } from "../../../types/LeaveRequest/CreateLeaveRequest";
import type { CreateLeaveDTO } from "../../../types/LeaveRequest/CreateLeaveRequest";
import { Modal } from "../../../components/common/Modal";
import { Plus } from "lucide-react";
import { useTheme } from "../../../components/layout/ThemeContext";

export const SubAdminLeaveApplication: React.FC = () => {
    const { isDark } = useTheme();
    type LeaveType = "CASUAL" | "SICK" | "PAID" | "UNPAID" | "EXTRA";

    const [leaveData, setLeaveData] = useState<{
        leaveType: LeaveType | "";
        startDate: string;
        endDate: string;
        reason: string;
    }>({
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: "",
    });

    const [leaves, setLeaves] = useState<LeaveRequestEntity[]>([]);


    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;


    const totalPages = Math.ceil(leaves.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentLeaves = leaves.slice(startIndex, startIndex + itemsPerPage);

    const [leaveBalance, setLeaveBalance] = useState<{ sickLeave: number; casualLeave: number } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchData = async () => {
        try {
            const [leavesData, profileData] = await Promise.all([
                GetSubAdminLeavesRequest(),
                getAdminProfile()
            ]);
            setLeaves(leavesData || []);


            if (profileData && profileData.profile && profileData.profile.leaveBalance) {
                setLeaveBalance(profileData.profile.leaveBalance);
            } else if (profileData && profileData.data && profileData.data.leaveBalance) {

                setLeaveBalance(profileData.data.leaveBalance);
            } else if (profileData && profileData.leaveBalance) {
                setLeaveBalance(profileData.leaveBalance);
            }

        } catch (error) {
            console.error("Failed to fetch data", error);
            showToast("Failed to fetch data", "error");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !leaveData.leaveType ||
            !leaveData.startDate ||
            !leaveData.endDate ||
            !leaveData.reason
        ) {
            showToast("Please fill all required fields", "error");
            return;
        }

        try {
            setIsSubmitting(true);
            const payload: CreateLeaveDTO = {
                ...leaveData,
                leaveType: leaveData.leaveType as "CASUAL" | "SICK" | "PAID" | "UNPAID" | "EXTRA",
                startDate: new Date(leaveData.startDate),
                endDate: new Date(leaveData.endDate),
            };
            await CreateLeaveRequestSubAdmin(payload);
            showToast("Leave request submitted successfully", "success");

            setLeaveData({
                leaveType: "",
                startDate: "",
                endDate: "",
                reason: "",
            });
            setIsModalOpen(false);
            fetchData();
        } catch (error: any) {
            showToast(
                error?.response?.data?.message || "Something went wrong",
                "error"
            );
        } finally {
            setIsSubmitting(false);
        }
    };


    const leaveOptions: string[] = ["CASUAL", "SICK", "PAID", "UNPAID", "EXTRA"];


    return (
        <div className={`p-6 min-h-screen ${isDark ? "bg-[#1a2632] text-white" : "bg-gray-50 text-gray-900"}`}>
            <div className="flex justify-between items-center mb-6">
                <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}>My Leave Application</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors shadow-sm bg-blue-600 hover:bg-blue-700 text-white`}
                >
                    <Plus size={20} />
                    Apply Leave
                </button>
            </div>

            {/* Leave Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className={`p-6 rounded-xl shadow-sm border ${isDark ? "bg-[#0d1117] border-gray-700" : "bg-white border-blue-100"}`}>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className={`text-sm font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Sick Leave</p>
                            <h3 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}>{leaveBalance?.sickLeave ?? 5} / 5</h3>
                        </div>
                        <div className={`p-2 rounded-lg ${isDark ? "bg-red-900/30 text-red-400" : "bg-red-50 text-red-600"}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-red-600 h-2.5 rounded-full" style={{ width: `${((leaveBalance?.sickLeave ?? 5) / 5) * 100}%` }}></div>
                    </div>
                </div>

                <div className={`p-6 rounded-xl shadow-sm border ${isDark ? "bg-[#0d1117] border-gray-700" : "bg-white border-blue-100"}`}>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className={`text-sm font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Casual Leave</p>
                            <h3 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}>{leaveBalance?.casualLeave ?? 5} / 5</h3>
                        </div>
                        <div className={`p-2 rounded-lg ${isDark ? "bg-blue-900/30 text-blue-400" : "bg-blue-50 text-blue-600"}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${((leaveBalance?.casualLeave ?? 5) / 5) * 100}%` }}></div>
                    </div>
                </div>
            </div>

            <Modal title="Apply for Leave" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <FormLayout onSubmit={handleSubmit} isSubmitting={isSubmitting}>
                    <SelectInput
                        label="Leave Type"
                        value={leaveData.leaveType}
                        options={leaveOptions}

                        isDark={isDark}
                        onChange={(val) =>
                            setLeaveData((prev) => ({ ...prev, leaveType: val as LeaveType }))
                        }
                    />
                    <TextInput
                        label="Start Date"
                        type="date"

                        value={leaveData.startDate}
                        isDark={isDark}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(val) =>
                            setLeaveData((prev) => ({ ...prev, startDate: val }))
                        }
                    />
                    <TextInput
                        label="End Date"
                        type="date"

                        value={leaveData.endDate}
                        isDark={isDark}
                        min={leaveData.startDate || new Date().toISOString().split('T')[0]}
                        onChange={(val) =>
                            setLeaveData((prev) => ({ ...prev, endDate: val }))
                        }
                    />
                    <TextInput
                        label="Reason"
                        placeholder="Enter reason for leave"

                        value={leaveData.reason}
                        isDark={isDark}
                        onChange={(val) => {
                            if (/^[a-zA-Z\s.,]*$/.test(val)) {
                                setLeaveData((prev) => ({ ...prev, reason: val }));
                            } else {
                                showToast("Only alphabets, dots, and commas are allowed", "error");
                            }
                        }}
                    />
                </FormLayout>
            </Modal>

            <div className={`mt-8 rounded-xl shadow-sm border overflow-hidden ${isDark ? "bg-[#0d1117] border-gray-700" : "bg-white border-gray-200"}`}>
                <div className={`p-4 border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                    <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-800"}`}>My Leave History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className={isDark ? "bg-[#161b22]" : "bg-gray-50"}>
                            <tr>
                                <th className={`py-3 px-4 text-left font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>Type</th>
                                <th className={`py-3 px-4 text-left font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>From</th>
                                <th className={`py-3 px-4 text-left font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>To</th>
                                <th className={`py-3 px-4 text-left font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>Days</th>
                                <th className={`py-3 px-4 text-left font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>Reason</th>
                                <th className={`py-3 px-4 text-left font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>Status</th>
                                <th className={`py-3 px-4 text-left font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>Admin Remark</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDark ? "divide-gray-700" : "divide-gray-200"}`}>
                            {currentLeaves.map((leave) => (
                                <tr key={leave.id} className={`transition-colors ${isDark ? "hover:bg-[#161b22]" : "hover:bg-gray-50"}`}>
                                    <td className={`py-3 px-4 ${isDark ? "text-gray-300" : "text-gray-800"}`}>{leave.leaveType}</td>
                                    <td className={`py-3 px-4 ${isDark ? "text-gray-300" : "text-gray-800"}`}>{new Date(leave.startDate).toLocaleDateString()}</td>
                                    <td className={`py-3 px-4 ${isDark ? "text-gray-300" : "text-gray-800"}`}>{new Date(leave.endDate).toLocaleDateString()}</td>
                                    <td className={`py-3 px-4 ${isDark ? "text-gray-300" : "text-gray-800"}`}>{leave.totalDays}</td>
                                    <td className={`py-3 px-4 ${isDark ? "text-gray-300" : "text-gray-800"}`}>{leave.reason}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${leave.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                            leave.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {leave.status}
                                        </span>
                                    </td>
                                    <td className={`py-3 px-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>{leave.adminRemark || "-"}</td>
                                </tr>
                            ))}
                            {leaves.length === 0 && (
                                <tr>
                                    <td colSpan={7} className={`text-center py-8 ${isDark ? "text-gray-500" : "text-gray-500"}`}>No leave history found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className={`p-4 border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        </div>
    );
};
