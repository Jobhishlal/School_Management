
import React, { useEffect, useState } from "react";
import {
  StudentFinanceCompleteDetails,
  GetAllClass,
  SearchPaymentHistoryNamebase,
} from "../../services/authapi";
import { showToast } from "../../utils/toast";
import { useTheme } from "../../components/layout/ThemeContext";

interface ClassItem {
  _id: string;
  className: string;
  division: string;
}

interface FeeItemStatus {
  name?: string;
  amount: number;
  paidAmount: number;
  status: "PAID" | "PARTIAL" | "NOT_PAID";
}

interface FeeStructureInfo {
  name: string;
  academicYear: string;
  notes?: string;
  items: FeeItemStatus[];
  totalAmount: number;
  totalPaid: number;
}

interface StudentPaymentStatus {
  studentId: string;
  studentName: string;
  className?: string;
  division?: string;
  paymentStatus: "COMPLETED" | "PARTIAL" | "NOT_PAID";
  feeStructure?: FeeStructureInfo | null;
  lastPaymentDate?: string;
}

const ClassPaymentStatus: React.FC = () => {
  const { isDark } = useTheme();
  
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [students, setStudents] = useState<StudentPaymentStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const res = await GetAllClass();
        setClasses(res.data || []);
      } catch {
        showToast("Failed to load classes", "error");
      }
    };
    loadClasses();
  }, []);

  const fetchPaymentStatus = async () => {
    if (!selectedClassId) {
      showToast("Please select a class", "error");
      return;
    }
    try {
      setLoading(true);
      const res = await StudentFinanceCompleteDetails(selectedClassId);
      setStudents(res.data || []);
    } catch (err: any) {
      showToast(
        err?.response?.data?.message || "Failed to fetch payment details",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const searchStudentPayment = async () => {
    if (!searchName.trim()) {
      showToast("Enter student name", "error");
      return;
    }

    try {
      setLoading(true);
      const res = await SearchPaymentHistoryNamebase(searchName);
      setStudents(res.data || []);
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Student not found", "error");
    } finally {
      setLoading(false);
    }
  };

  // Theme Classes - matching your exact theme
  const containerBg = isDark ? "bg-[#121A21] text-slate-100" : "bg-[#fafbfc] text-slate-900";
  const cardBg = isDark ? "bg-slate-800/50 border-gray-700" : "bg-white border-gray-300";
  const inputBg = isDark ? "bg-slate-700/50 border-slate-600 text-slate-100" : "bg-white border-gray-300 text-slate-900";
  const buttonPrimary = isDark ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white";
  const buttonSuccess = isDark ? "bg-green-600 hover:bg-green-700 text-white" : "bg-green-600 hover:bg-green-700 text-white";
  const tableBg = isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-gray-300";
  const tableHeaderBg = isDark ? "bg-slate-900/50" : "bg-gray-50";
  const tableRowHover = isDark ? "hover:bg-slate-700/30" : "hover:bg-gray-50";
  const borderColor = isDark ? "border-slate-700" : "border-gray-200";
  const textSecondary = isDark ? "text-gray-400" : "text-gray-600";
  const textPrimary = isDark ? "text-slate-100" : "text-slate-900";

  return (
    <div className={`p-6 min-h-screen transition-colors duration-300 ${containerBg}`}>
      <div className="max-w-7xl mx-auto">
        {/* Search Section */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchStudentPayment()}
              className={`w-full rounded-lg pl-12 pr-4 py-3 border focus:outline-none focus:border-blue-500 placeholder-gray-500 transition-colors duration-200 ${inputBg}`}
            />
            <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Class & Section */}
        <div className="mb-6">
          <h2 className={`text-xl font-semibold mb-4 ${textPrimary}`}>Class & Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm mb-2 ${textSecondary}`}>class</label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className={`w-full rounded-lg px-4 py-3 border focus:outline-none focus:border-blue-500 transition-colors duration-200 ${inputBg}`}
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.className} - {cls.division}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block text-sm mb-2 ${textSecondary}`}>Grade</label>
              <button
                onClick={fetchPaymentStatus}
                className={`w-full rounded-lg px-4 py-3 transition-colors duration-200 font-medium ${buttonPrimary}`}
              >
                Fetch Payment Status
              </button>
            </div>
          </div>
        </div>

        {/* Payment History Table */}
        <div>
          <h2 className={`text-xl font-semibold mb-4 ${textPrimary}`}>Payment History</h2>
          
          {loading && (
            <div className={`text-center py-8 ${textSecondary}`}>Loading...</div>
          )}

          {!loading && students.length === 0 && (
            <div className={`text-center py-8 ${textSecondary}`}>No payment records found</div>
          )}

          {!loading && students.length > 0 && (
            <div className={`rounded-lg overflow-hidden border transition-colors duration-300 ${tableBg}`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b transition-colors duration-200 ${borderColor} ${tableHeaderBg}`}>
                      <th className={`text-left py-4 px-4 font-medium ${textSecondary}`}>Student Name</th>
                      <th className={`text-left py-4 px-4 font-medium ${textSecondary}`}>Fee Structure</th>
                      <th className={`text-left py-4 px-4 font-medium ${textSecondary}`}>Academic Year</th>
                      <th className={`text-left py-4 px-4 font-medium ${textSecondary}`}>Amount Paid</th>
                      <th className={`text-left py-4 px-4 font-medium ${textSecondary}`}>Total Amount</th>
                      <th className={`text-left py-4 px-4 font-medium ${textSecondary}`}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => (
                      <tr key={s.studentId} className={`border-b transition-colors duration-200 ${borderColor} ${tableRowHover}`}>
                        <td className={`py-4 px-4 ${textPrimary}`}>{s.studentName}</td>
                        <td className={`py-4 px-4 ${textPrimary}`}>{s.feeStructure?.name ?? "N/A"}</td>
                        <td className={`py-4 px-4 ${textPrimary}`}>{s.feeStructure?.academicYear ?? "N/A"}</td>
                        <td className={`py-4 px-4 ${textPrimary}`}>₹{s.feeStructure?.totalPaid ?? 0}</td>
                        <td className={`py-4 px-4 ${textPrimary}`}>₹{s.feeStructure?.totalAmount ?? 0}</td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                              s.paymentStatus === "COMPLETED"
                                ? "bg-green-900 text-green-300"
                                : s.paymentStatus === "PARTIAL"
                                ? "bg-orange-900 text-orange-300"
                                : "bg-red-900 text-red-300"
                            }`}
                          >
                            {s.paymentStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Expandable Details Section */}
              {students.map((s) => (
                s.feeStructure && s.feeStructure.items && s.feeStructure.items.length > 0 && (
                  <details key={`${s.studentId}-details`} className={`border-t transition-colors duration-200 ${borderColor}`}>
                    <summary className={`py-3 px-4 cursor-pointer text-blue-400 font-medium transition-colors duration-200 ${tableRowHover}`}>
                      View Fee Breakdown - {s.studentName}
                    </summary>
                    <div className="px-4 pb-4">
                      {s.feeStructure.notes && (
                        <p className={`mb-3 text-sm ${textSecondary}`}>{s.feeStructure.notes}</p>
                      )}
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className={`${tableHeaderBg}`}>
                              <th className={`text-left py-2 px-3 text-sm font-medium ${textSecondary}`}>Fee Item</th>
                              <th className={`text-left py-2 px-3 text-sm font-medium ${textSecondary}`}>Amount</th>
                              <th className={`text-left py-2 px-3 text-sm font-medium ${textSecondary}`}>Paid</th>
                              <th className={`text-left py-2 px-3 text-sm font-medium ${textSecondary}`}>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {s.feeStructure.items.filter(Boolean).map((item, idx) => (
                              <tr key={idx} className={`border-t transition-colors duration-200 ${borderColor}`}>
                                <td className={`py-2 px-3 text-sm ${textPrimary}`}>{item?.name ?? "N/A"}</td>
                                <td className={`py-2 px-3 text-sm ${textPrimary}`}>₹{item?.amount ?? 0}</td>
                                <td className={`py-2 px-3 text-sm ${textPrimary}`}>₹{item?.paidAmount ?? 0}</td>
                                <td className="py-2 px-3 text-sm">
                                  <span
                                    className={`font-medium ${
                                      item?.status === "PAID"
                                        ? "text-green-400"
                                        : item?.status === "PARTIAL"
                                        ? "text-orange-400"
                                        : "text-red-400"
                                    }`}
                                  >
                                    {item?.status ?? "UNKNOWN"}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </details>
                )
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassPaymentStatus;