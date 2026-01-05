
import React, { useEffect, useState } from "react";
import {
  StudentFinanceCompleteDetails,
  GetAllClass,
  SearchPaymentHistoryNamebase,
  GetPaymentHistory,
  GetAllFeeStructures,
} from "../../services/authapi";
import { showToast } from "../../utils/toast";
import { useTheme } from "../../components/layout/ThemeContext";
import { Pagination } from "../../components/common/Pagination";
import { onlyDate } from "../../utils/DateConverter";

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

// Existing Class Payment Status Component Logic
const ClassPaymentView: React.FC<{
  classes: ClassItem[];
  fetchPaymentStatus: (classId: string) => void;
  students: StudentPaymentStatus[];
  loading: boolean;
  searchName: string;
  setSearchName: (name: string) => void;
  searchStudentPayment: () => void;
  selectedClassId: string;
  setSelectedClassId: (id: string) => void;
  theme: any;
}> = ({
  classes,
  fetchPaymentStatus,
  students,
  loading,
  searchName,
  setSearchName,
  searchStudentPayment,
  selectedClassId,
  setSelectedClassId,
  theme,
}) => {
    const {
      inputBg,
      buttonPrimary,
      textSecondary,
      textPrimary,
      tableBg,
      tableHeaderBg,
      tableRowHover,
      borderColor,
    } = theme;

    return (
      <div>
        {/* Search Section */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && searchStudentPayment()}
              className={`w-full rounded-lg pl-12 pr-4 py-3 border focus:outline-none focus:border-blue-500 placeholder-gray-500 transition-colors duration-200 ${inputBg}`}
            />
            <svg
              className="absolute left-4 top-3.5 w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
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
              <label className={`block text-sm mb-2 ${textSecondary}`}>Action</label>
              <button
                onClick={() => fetchPaymentStatus(selectedClassId)}
                className={`w-full rounded-lg px-4 py-3 transition-colors duration-200 font-medium ${buttonPrimary}`}
              >
                Fetch Payment Status
              </button>
            </div>
          </div>
        </div>

        {/* Payment History Table */}
        <div>
          <h2 className={`text-xl font-semibold mb-4 ${textPrimary}`}>Student Payment Status</h2>

          {loading && <div className={`text-center py-8 ${textSecondary}`}>Loading...</div>}

          {!loading && students.length === 0 && (
            <div className={`text-center py-8 ${textSecondary}`}>No payment records found</div>
          )}

          {!loading && students.length > 0 && (
            <div className={`rounded-lg overflow-hidden border transition-colors duration-300 ${tableBg}`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr
                      className={`border-b transition-colors duration-200 ${borderColor} ${tableHeaderBg}`}
                    >
                      <th className={`text-left py-4 px-4 font-medium ${textSecondary}`}>
                        Student Name
                      </th>
                      <th className={`text-left py-4 px-4 font-medium ${textSecondary}`}>
                        Fee Structure
                      </th>
                      <th className={`text-left py-4 px-4 font-medium ${textSecondary}`}>
                        Academic Year
                      </th>
                      <th className={`text-left py-4 px-4 font-medium ${textSecondary}`}>
                        Amount Paid
                      </th>
                      <th className={`text-left py-4 px-4 font-medium ${textSecondary}`}>
                        Total Amount
                      </th>
                      <th className={`text-left py-4 px-4 font-medium ${textSecondary}`}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => (
                      <tr
                        key={s.studentId}
                        className={`border-b transition-colors duration-200 ${borderColor} ${tableRowHover}`}
                      >
                        <td className={`py-4 px-4 ${textPrimary}`}>{s.studentName}</td>
                        <td className={`py-4 px-4 ${textPrimary}`}>{s.feeStructure?.name ?? "N/A"}</td>
                        <td className={`py-4 px-4 ${textPrimary}`}>
                          {s.feeStructure?.academicYear ?? "N/A"}
                        </td>
                        <td className={`py-4 px-4 ${textPrimary}`}>
                          ₹{s.feeStructure?.totalPaid ?? 0}
                        </td>
                        <td className={`py-4 px-4 ${textPrimary}`}>
                          ₹{s.feeStructure?.totalAmount ?? 0}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${s.paymentStatus === "COMPLETED"
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
              {students.map(
                (s) =>
                  s.feeStructure &&
                  s.feeStructure.items &&
                  s.feeStructure.items.length > 0 && (
                    <details
                      key={`${s.studentId}-details`}
                      className={`border-t transition-colors duration-200 ${borderColor}`}
                    >
                      <summary
                        className={`py-3 px-4 cursor-pointer text-blue-400 font-medium transition-colors duration-200 ${tableRowHover}`}
                      >
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
                                <th
                                  className={`text-left py-2 px-3 text-sm font-medium ${textSecondary}`}
                                >
                                  Fee Item
                                </th>
                                <th
                                  className={`text-left py-2 px-3 text-sm font-medium ${textSecondary}`}
                                >
                                  Amount
                                </th>
                                <th
                                  className={`text-left py-2 px-3 text-sm font-medium ${textSecondary}`}
                                >
                                  Paid
                                </th>
                                <th
                                  className={`text-left py-2 px-3 text-sm font-medium ${textSecondary}`}
                                >
                                  Status
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {s.feeStructure.items.filter(Boolean).map((item, idx) => (
                                <tr
                                  key={idx}
                                  className={`border-t transition-colors duration-200 ${borderColor}`}
                                >
                                  <td className={`py-2 px-3 text-sm ${textPrimary}`}>
                                    {item?.name ?? "N/A"}
                                  </td>
                                  <td className={`py-2 px-3 text-sm ${textPrimary}`}>
                                    ₹{item?.amount ?? 0}
                                  </td>
                                  <td className={`py-2 px-3 text-sm ${textPrimary}`}>
                                    ₹{item?.paidAmount ?? 0}
                                  </td>
                                  <td className="py-2 px-3 text-sm">
                                    <span
                                      className={`font-medium ${item?.status === "PAID"
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
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

const PaymentHistoryLogView: React.FC<{ theme: any }> = ({ theme }) => {
  const {
    inputBg,
    buttonPrimary,
    textSecondary,
    textPrimary,
    tableBg,
    tableHeaderBg,
    tableRowHover,
    borderColor,
  } = theme;

  const [historyData, setHistoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, total: 0 });
  const [feeStructures, setFeeStructures] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    feeStructureId: "",
    startDate: "",
    endDate: "",
  });

  const fetchHistory = async (page = 1) => {
    setLoading(true);
    try {
      const res = await GetPaymentHistory({
        ...filters,
        page,
        limit: 5,
      });
      setHistoryData(res.data || []);
      setPagination({
        currentPage: res.page,
        totalPages: Math.ceil(res.total / res.limit),
        total: res.total,
      });
    } catch (error) {
      showToast("Failed to fetch payment history", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    // Fetch Fee Structures for Dropdown
    const loadFeeStructures = async () => {
      try {
        const res = await GetAllFeeStructures();
        setFeeStructures(res.data || []);
      } catch (err) {
        console.error("Failed to load fee structures", err);
      }
    };
    loadFeeStructures();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div>
      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className={`block text-sm mb-2 ${textSecondary}`}>Fee Structure Name</label>
          <select
            name="feeStructureId"
            value={filters.feeStructureId}
            onChange={handleFilterChange}
            className={`w-full rounded-lg px-4 py-3 border focus:outline-none focus:border-blue-500 transition-colors duration-200 ${inputBg}`}
          >
            <option value="">All Fee Structures</option>
            {feeStructures.map((fs: any) => (
              <option key={fs.id} value={fs.id}>
                {fs.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={`block text-sm mb-2 ${textSecondary}`}>Start Date</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className={`w-full rounded-lg px-4 py-3 border focus:outline-none focus:border-blue-500 transition-colors duration-200 ${inputBg}`}
          />
        </div>
        <div>
          <label className={`block text-sm mb-2 ${textSecondary}`}>End Date</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className={`w-full rounded-lg px-4 py-3 border focus:outline-none focus:border-blue-500 transition-colors duration-200 ${inputBg}`}
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={() => fetchHistory(1)}
            className={`w-full rounded-lg px-4 py-3 transition-colors duration-200 font-medium ${buttonPrimary}`}
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Table */}
      {loading && <div className={`text-center py-8 ${textSecondary}`}>Loading...</div>}

      {!loading && historyData.length === 0 && (
        <div className={`text-center py-8 ${textSecondary}`}>No transactions found</div>
      )}

      {!loading && historyData.length > 0 && (
        <div className={`rounded-lg overflow-hidden border transition-colors duration-300 ${tableBg}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b transition-colors duration-200 ${borderColor} ${tableHeaderBg}`}>
                  <th className={`text-left py-4 px-4 font-medium ${textSecondary}`}>Student Name</th>
                  <th className={`text-left py-4 px-4 font-medium ${textSecondary}`}>Fee Name</th>
                  <th className={`text-left py-4 px-4 font-medium ${textSecondary}`}>Date</th>
                  <th className={`text-left py-4 px-4 font-medium ${textSecondary}`}>Time</th>
                  <th className={`text-left py-4 px-4 font-medium ${textSecondary}`}>Amount</th>
                  <th className={`text-left py-4 px-4 font-medium ${textSecondary}`}>Method</th>
                  <th className={`text-left py-4 px-4 font-medium ${textSecondary}`}>Status</th>
                </tr>
              </thead>
              <tbody>
                {historyData.map((item: any) => (
                  <tr key={item.id} className={`border-b transition-colors duration-200 ${borderColor} ${tableRowHover}`}>
                    <td className={`py-4 px-4 ${textPrimary}`}>{item.studentId?.fullName}</td>
                    <td className={`py-4 px-4 ${textPrimary}`}>
                      {item.studentFeeId?.name || "N/A"}
                    </td>
                    <td className={`py-4 px-4 ${textPrimary}`}>{onlyDate(item.paymentDate)}</td>
                    <td className={`py-4 px-4 ${textPrimary}`}>
                      {new Date(item.paymentDate).toLocaleTimeString()}
                    </td>
                    <td className={`py-4 px-4 ${textPrimary}`}>₹{item.amount}</td>
                    <td className={`py-4 px-4 ${textPrimary}`}>{item.method}</td>
                    <td className="py-4 px-4">
                      <span className="bg-green-900 text-green-300 px-3 py-1 rounded-full text-sm">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={fetchHistory}
      />
    </div>
  );
};

const ClassPaymentStatus: React.FC = () => {
  const { isDark } = useTheme();

  const [viewMode, setViewMode] = useState<"CLASS" | "HISTORY">("HISTORY"); // Default to global history as requested

  // States for Class View
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [students, setStudents] = useState<StudentPaymentStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchName, setSearchName] = useState("");

  const theme = {
    containerBg: isDark ? "bg-[#121A21] text-slate-100" : "bg-[#fafbfc] text-slate-900",
    cardBg: isDark ? "bg-slate-800/50 border-gray-700" : "bg-white border-gray-300",
    inputBg: isDark
      ? "bg-slate-700/50 border-slate-600 text-slate-100"
      : "bg-white border-gray-300 text-slate-900",
    buttonPrimary: isDark
      ? "bg-blue-600 hover:bg-blue-700 text-white"
      : "bg-blue-600 hover:bg-blue-700 text-white",
    tableBg: isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-gray-300",
    tableHeaderBg: isDark ? "bg-slate-900/50" : "bg-gray-50",
    tableRowHover: isDark ? "hover:bg-slate-700/30" : "hover:bg-gray-50",
    borderColor: isDark ? "border-slate-700" : "border-gray-200",
    textSecondary: isDark ? "text-gray-400" : "text-gray-600",
    textPrimary: isDark ? "text-slate-100" : "text-slate-900",
  };

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

  const fetchPaymentStatus = async (classId: string) => {
    if (!classId) {
      showToast("Please select a class", "error");
      return;
    }
    try {
      setLoading(true);
      const res = await StudentFinanceCompleteDetails(classId);
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

  return (
    <div className={`p-6 min-h-screen transition-colors duration-300 ${theme.containerBg}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Payment History</h1>
          <div className="flex gap-2 bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setViewMode("HISTORY")}
              className={`px-4 py-2 rounded-md transition-colors ${viewMode === "HISTORY" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                }`}
            >
              Transaction Log
            </button>
            <button
              onClick={() => setViewMode("CLASS")}
              className={`px-4 py-2 rounded-md transition-colors ${viewMode === "CLASS" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                }`}
            >
              Class View
            </button>

          </div>
        </div>

        {viewMode === "CLASS" ? (
          <ClassPaymentView
            classes={classes}
            fetchPaymentStatus={fetchPaymentStatus}
            students={students}
            loading={loading}
            searchName={searchName}
            setSearchName={setSearchName}
            searchStudentPayment={searchStudentPayment}
            selectedClassId={selectedClassId}
            setSelectedClassId={setSelectedClassId}
            theme={theme}
          />
        ) : (
          <PaymentHistoryLogView theme={theme} />
        )}
      </div>
    </div>
  );
};

export default ClassPaymentStatus;