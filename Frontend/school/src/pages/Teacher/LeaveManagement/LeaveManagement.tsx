import React, { useState, useEffect } from "react";
import { FormLayout } from "../../../components/Form/FormLayout";
import { TextInput } from "../../../components/Form/TextInput";
import { SelectInput } from "../../../components/Form/SelectInput";
import { Pagination } from "../../../components/common/Pagination"; // Import Pagination
import { LeaveRequest, GetTeacherLeaves, GetTeachertimetableList } from "../../../services/authapi";
import { showToast } from "../../../utils/toast";
import type { LeaveRequestEntity } from "../../../types/LeaveRequest/CreateLeaveRequest";
import type { CreateLeaveDTO } from "../../../types/LeaveRequest/CreateLeaveRequest";
import { Modal } from "../../../components/common/Modal";
import { Plus } from "lucide-react";
import { useTheme } from "../../../components/layout/ThemeContext";

export const LeaveManagement: React.FC = () => {
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate pagination values
  const totalPages = Math.ceil(leaves.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentLeaves = leaves.slice(startIndex, startIndex + itemsPerPage);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teacherInfo, setTeacherInfo] = useState<any>(null);

  const fetchData = async () => {
    try {
      const [leavesData, teacherData] = await Promise.all([
        GetTeacherLeaves(),
        GetTeachertimetableList()
      ]);
      setLeaves(leavesData);
      setTeacherInfo(teacherData);
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
      await LeaveRequest(payload);
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
      console.log("error messages", error)
    } finally {
      setIsSubmitting(false);
    }
  };

  const sickLeaveTotal = 5;
  const casualLeaveTotal = 5;

  const sickLeaveBalance = teacherInfo?.leaveBalance?.sickLeave ?? sickLeaveTotal;
  const casualLeaveBalance = teacherInfo?.leaveBalance?.casualLeave ?? casualLeaveTotal;

  const sickLeaveTaken = sickLeaveTotal - sickLeaveBalance;
  const casualLeaveTaken = casualLeaveTotal - casualLeaveBalance;


  const leaveOptions: string[] = ["PAID", "UNPAID"];

  if (sickLeaveBalance > 0) {
    leaveOptions.push("SICK");
  }
  if (casualLeaveBalance > 0) {
    leaveOptions.push("CASUAL");
  }

  const isSickExhausted = sickLeaveBalance <= 0;
  const isCasualExhausted = casualLeaveBalance <= 0;

  if (isSickExhausted || isCasualExhausted) {
    leaveOptions.push("EXTRA");
  }

  const isFullyExhausted = isSickExhausted && isCasualExhausted;


  return (
    <div className={`p-6 min-h-screen ${isDark ? "bg-[#1a2632] text-white" : "bg-gray-50 text-gray-900"}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}>Leave Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors shadow-sm ${isFullyExhausted
            ? "bg-red-600 hover:bg-red-700 text-white"
            : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
        >
          <Plus size={20} />
          {isFullyExhausted ? "Apply Extra Leave" : "Apply Leave"}
        </button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className={`p-6 rounded-xl shadow-sm border ${isDark ? "bg-[#0d1117] border-gray-700" : "bg-white border-gray-100"}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Sick Leave</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Total</p>
              <p className="text-2xl font-bold text-blue-600">{sickLeaveTotal}</p>
            </div>
            <div>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Taken</p>
              <p className="text-2xl font-bold text-orange-600">{sickLeaveTaken}</p>
            </div>
            <div>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Balance</p>
              <p className={`text-2xl font-bold ${sickLeaveBalance <= 0 ? 'text-red-500' : 'text-green-500'}`}>{sickLeaveBalance}</p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl shadow-sm border ${isDark ? "bg-[#0d1117] border-gray-700" : "bg-white border-gray-100"}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Casual Leave</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Total</p>
              <p className="text-2xl font-bold text-blue-600">{casualLeaveTotal}</p>
            </div>
            <div>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Taken</p>
              <p className="text-2xl font-bold text-orange-600">{casualLeaveTaken}</p>
            </div>
            <div>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Balance</p>
              <p className={`text-2xl font-bold ${casualLeaveBalance <= 0 ? 'text-red-500' : 'text-green-500'}`}>{casualLeaveBalance}</p>
            </div>
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

