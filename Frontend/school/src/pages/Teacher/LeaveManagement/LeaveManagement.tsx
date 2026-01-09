import React, { useState, useEffect } from "react";
import { FormLayout } from "../../../components/Form/FormLayout";
import { TextInput } from "../../../components/Form/TextInput";
import { SelectInput } from "../../../components/Form/SelectInput";
import { LeaveRequest, GetTeacherLeaves, GetTeachertimetableList } from "../../../services/authapi";
import { showToast } from "../../../utils/toast";
import type { LeaveRequestEntity } from "../../../types/LeaveRequest/CreateLeaveRequest";
import type { CreateLeaveDTO } from "../../../types/LeaveRequest/CreateLeaveRequest";
import { Modal } from "../../../components/common/Modal";
import { Plus } from "lucide-react";

export const LeaveManagement: React.FC = () => {
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
      fetchData(); // Refresh both leaves and potentially balance if backend updates it immediately (though balance currently updates on approval)
    } catch (error: any) {
      showToast(
        error?.response?.data?.message || "Something went wrong",
        "error"
      );
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

  // Logic for Leave Options and Button Label
  const leaveOptions: string[] = ["PAID", "UNPAID"];

  if (sickLeaveBalance > 0) {
    leaveOptions.push("SICK");
  }
  if (casualLeaveBalance > 0) {
    leaveOptions.push("CASUAL");
  }

  // If either balance is exhausted, allow EXTRA
  // User might want to take EXTRA SICK leave even if CASUAL is available, 
  // or generally if they are out of specific leaves.
  // The simplest UX is to show EXTRA if *any* standard leave is exhausted 
  // OR if both are exhausted. 
  // Let's allow EXTRA if either is <= 0.
  const isSickExhausted = sickLeaveBalance <= 0;
  const isCasualExhausted = casualLeaveBalance <= 0;

  if (isSickExhausted || isCasualExhausted) {
    leaveOptions.push("EXTRA");
  }

  const isFullyExhausted = isSickExhausted && isCasualExhausted;


  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Leave Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isFullyExhausted ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
        >
          <Plus size={20} />
          {isFullyExhausted ? "Apply Extra Leave" : "Apply Leave"}
        </button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Sick Leave</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold text-blue-600">{sickLeaveTotal}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Taken</p>
              <p className="text-2xl font-bold text-orange-600">{sickLeaveTaken}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Balance</p>
              <p className={`text-2xl font-bold ${sickLeaveBalance <= 0 ? 'text-red-600' : 'text-green-600'}`}>{sickLeaveBalance}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Casual Leave</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold text-blue-600">{casualLeaveTotal}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Taken</p>
              <p className="text-2xl font-bold text-orange-600">{casualLeaveTaken}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Balance</p>
              <p className={`text-2xl font-bold ${casualLeaveBalance <= 0 ? 'text-red-600' : 'text-green-600'}`}>{casualLeaveBalance}</p>
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
            required
            onChange={(val) =>
              setLeaveData((prev) => ({ ...prev, leaveType: val as LeaveType }))
            }
          />
          <TextInput
            label="Start Date"
            type="date"
            required
            value={leaveData.startDate}
            onChange={(val) =>
              setLeaveData((prev) => ({ ...prev, startDate: val }))
            }
          />
          <TextInput
            label="End Date"
            type="date"
            required
            value={leaveData.endDate}
            onChange={(val) =>
              setLeaveData((prev) => ({ ...prev, endDate: val }))
            }
          />
          <TextInput
            label="Reason"
            placeholder="Enter reason for leave"
            required
            value={leaveData.reason}
            onChange={(val) =>
              setLeaveData((prev) => ({ ...prev, reason: val }))
            }
          />
        </FormLayout>
      </Modal>

      <div className="mt-8">
        <h3 className="text-lg font-bold mb-4">My Leave History</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b text-left">Type</th>
                <th className="py-2 px-4 border-b text-left">From</th>
                <th className="py-2 px-4 border-b text-left">To</th>
                <th className="py-2 px-4 border-b text-left">Days</th>
                <th className="py-2 px-4 border-b text-left">Reason</th>
                <th className="py-2 px-4 border-b text-left">Status</th>
                <th className="py-2 px-4 border-b text-left">Admin Remark</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr key={leave.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{leave.leaveType}</td>
                  <td className="py-2 px-4 border-b">{new Date(leave.startDate).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border-b">{new Date(leave.endDate).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border-b">{leave.totalDays}</td>
                  <td className="py-2 px-4 border-b">{leave.reason}</td>
                  <td className="py-2 px-4 border-b">
                    <span className={`px-2 py-1 rounded text-sm ${leave.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      leave.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                      {leave.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">{leave.adminRemark || "-"}</td>
                </tr>
              ))}
              {leaves.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-4">No leave history found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

