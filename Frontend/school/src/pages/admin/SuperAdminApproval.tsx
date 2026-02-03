// import { useEffect, useState } from "react";
// import { ExpanceApproval, Pendingstatuslist } from "../../services/authapi";
// import { showToast } from "../../utils/toast";

// interface Expense {
//   id: string;
//   title: string;
//   description: string;
//   amount: number;
//   expenseDate: string;
//   paymentMode: string;
//   status: "PENDING" | "APPROVED" | "REJECTED";
//   createdBy: string;
// }

// export default function SuperAdminExpenseApproval() {
//   const [expenses, setExpenses] = useState<Expense[]>([]);
//   const [loading, setLoading] = useState(false);

//   // Fetch pending expenses
//   const fetchExpenses = async () => {
//     try {
//       setLoading(true);
//       const data = await Pendingstatuslist();
//       console.log("data",data)
//       setExpenses(data);
//     } catch (err: any) {
//       showToast(err?.message || "Failed to fetch expenses", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchExpenses();
//   }, []);

//   const handleApproval = async (
//     expenseId: string,
//     action: "APPROVED" | "REJECTED"
//   ) => {
//     try {
//       setLoading(true);
//      const res = await ExpanceApproval(expenseId, action);
//      console.log("rached res",res)
//       showToast(`Expense ${action.toLowerCase()} successfully`, "success");
//       fetchExpenses(); 
//     } catch (err: any) {
//       showToast(err?.message || "Approval failed", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <p>Loading...</p>;

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-4">Pending Expenses</h2>

//       {expenses.length === 0 ? (
//         <p>No pending expenses</p>
//       ) : (
//         <table className="w-full border-collapse">
//           <thead>
//             <tr>
//               <th className="border p-2">Title</th>
//               <th className="border p-2">Amount</th>
//               <th className="border p-2">Created By</th>
//               <th className="border p-2">Date</th>
//               <th className="border p-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {expenses.map((exp) => (
//               <tr key={exp.id}>
//                 <td className="border p-2">{exp.title}</td>
//                 <td className="border p-2">{exp.amount}</td>
//                 <td className="border p-2">{exp.createdBy}</td>
//                 <td className="border p-2">
//                   {new Date(exp.expenseDate).toLocaleDateString()}
//                 </td>
//                 <td className="border p-2 space-x-2">
//                   <button
//                     className="bg-green-600 text-white px-3 py-1 rounded"
//                     onClick={() => handleApproval(exp.id, "APPROVED")}
//                   >
//                     Approve
//                   </button>
//                   <button
//                     className="bg-red-600 text-white px-3 py-1 rounded"
//                     onClick={() => handleApproval(exp.id, "REJECTED")}
//                   >
//                     Reject
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }





import { useEffect, useState } from "react";
import { ExpanceApproval, ListOutFullExpense } from "../../services/authapi";
import { showToast } from "../../utils/toast";
import { useTheme } from "../../components/layout/ThemeContext";
import { Pagination } from "../../components/common/Pagination";

interface Expense {
  id: string;
  title: string;
  description: string;
  amount: number;
  expenseDate: string;
  paymentMode: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdBy: string;
}

export default function SuperAdminExpenseApproval() {
  const { isDark } = useTheme();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("PENDING");

  // Theme Classes
  const containerBg = isDark ? "bg-[#121A21] text-slate-100" : "bg-[#fafbfc] text-slate-900";
  const cardBg = isDark ? "bg-slate-800/50 border-gray-700" : "bg-white border-gray-300";
  const inputBg = isDark ? "bg-slate-700/50 border-slate-600 text-slate-100" : "bg-white border-gray-300 text-slate-900";
  const buttonSuccess = isDark ? "bg-green-600 hover:bg-green-700 text-white" : "bg-green-600 hover:bg-green-700 text-white";
  const buttonDanger = isDark ? "bg-red-600 hover:bg-red-700 text-white" : "bg-red-600 hover:bg-red-700 text-white";
  const tableBg = isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-gray-300";
  const tableHeaderBg = isDark ? "bg-slate-900/50" : "bg-gray-50";
  const tableRowHover = isDark ? "hover:bg-slate-700/30" : "hover:bg-gray-50";
  const borderColor = isDark ? "border-slate-700" : "border-gray-200";
  const textSecondary = isDark ? "text-gray-400" : "text-gray-600";
  const textPrimary = isDark ? "text-slate-100" : "text-slate-900";
  const modalBg = isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-300";

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await ListOutFullExpense();
      setExpenses(res.data || []);
    } catch (err: any) {
      showToast(err?.message || "Failed to fetch expenses", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Reset pagination when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus]);

  const handleApproval = async (
    expenseId: string,
    action: "APPROVED" | "REJECTED"
  ) => {
    try {
      setLoading(true);
      await ExpanceApproval(expenseId, action);
      showToast(`Expense ${action.toLowerCase()} successfully`, "success");
      setSelectedExpense(null);
      fetchExpenses();
    } catch (err: any) {
      showToast(err?.message || "Approval failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredExpenses = expenses.filter(exp =>
    filterStatus === "ALL" ? true : exp.status === filterStatus
  );

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedExpenses = filteredExpenses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);

  const getStatusBadge = (status: string) => {
    const statusColors = {
      PENDING: "bg-yellow-900 text-yellow-300",
      APPROVED: "bg-green-900 text-green-300",
      REJECTED: "bg-red-900 text-red-300"
    };
    return statusColors[status as keyof typeof statusColors] || "bg-gray-900 text-gray-300";
  };

  const getPaymentModeIcon = (mode: string) => {
    switch (mode?.toUpperCase()) {
      case 'CASH':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'CARD':
      case 'CREDIT':
      case 'DEBIT':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        );
      case 'UPI':
      case 'ONLINE':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className={`p-6 min-h-screen transition-colors duration-300 ${containerBg}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className={`text-3xl font-bold mb-2 ${textPrimary}`}>Expense Approvals</h1>
          <p className={textSecondary}>Review and approve pending expense requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className={`rounded-lg border p-4 transition-colors duration-300 ${cardBg}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${textSecondary}`}>Pending</p>
                <p className={`text-2xl font-bold ${textPrimary}`}>
                  {expenses.filter(e => e.status === "PENDING").length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-yellow-900/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className={`rounded-lg border p-4 transition-colors duration-300 ${cardBg}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${textSecondary}`}>Approved</p>
                <p className={`text-2xl font-bold ${textPrimary}`}>
                  {expenses.filter(e => e.status === "APPROVED").length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-900/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className={`rounded-lg border p-4 transition-colors duration-300 ${cardBg}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${textSecondary}`}>Rejected</p>
                <p className={`text-2xl font-bold ${textPrimary}`}>
                  {expenses.filter(e => e.status === "REJECTED").length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-red-900/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className={`rounded-lg border p-1 inline-flex transition-colors duration-300 ${cardBg}`}>
            {["PENDING", "APPROVED", "REJECTED", "ALL"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${filterStatus === status
                  ? "bg-blue-600 text-white"
                  : `${textSecondary} hover:bg-slate-700/30`
                  }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Expenses Table */}
        <div>
          {loading && (
            <div className={`text-center py-12 ${textSecondary}`}>
              <svg className="animate-spin h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p>Loading expenses...</p>
            </div>
          )}

          {!loading && filteredExpenses.length === 0 && (
            <div className={`text-center py-12 ${cardBg} rounded-lg border`}>
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className={textSecondary}>No expenses found for this filter</p>
            </div>
          )}

          {!loading && filteredExpenses.length > 0 && (
            <>
              <div className={`rounded-lg overflow-hidden border transition-colors duration-300 ${tableBg}`}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={`border-b transition-colors duration-200 ${borderColor} ${tableHeaderBg}`}>
                        <th className={`text-left py-4 px-4 font-medium ${textSecondary}`}>Title</th>
                        <th className={`text-left py-4 px-4 font-medium ${textSecondary}`}>Amount</th>
                        <th className={`text-left py-4 px-4 font-medium ${textSecondary}`}>Payment Mode</th>
                        <th className={`text-left py-4 px-4 font-medium ${textSecondary}`}>Created By</th>
                        <th className={`text-left py-4 px-4 font-medium ${textSecondary}`}>Date</th>
                        <th className={`text-left py-4 px-4 font-medium ${textSecondary}`}>Status</th>
                        <th className={`text-left py-4 px-4 font-medium ${textSecondary}`}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedExpenses.map((exp) => (
                        <tr key={exp.id} className={`border-b transition-colors duration-200 ${borderColor} ${tableRowHover}`}>
                          <td className={`py-4 px-4 ${textPrimary}`}>
                            <div>
                              <p className="font-medium">{exp.title}</p>
                              {exp.description && (
                                <p className={`text-sm ${textSecondary} truncate max-w-xs`}>
                                  {exp.description}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className={`py-4 px-4 ${textPrimary} font-semibold`}>
                            ₹{exp.amount.toLocaleString()}
                          </td>
                          <td className={`py-4 px-4`}>
                            <div className="flex items-center gap-2">
                              <span className={textSecondary}>
                                {getPaymentModeIcon(exp.paymentMode)}
                              </span>
                              <span className={textPrimary}>{exp.paymentMode}</span>
                            </div>
                          </td>
                          <td className={`py-4 px-4 ${textPrimary}`}>{exp.createdBy}</td>
                          <td className={`py-4 px-4 ${textPrimary}`}>
                            {new Date(exp.expenseDate).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(exp.status)}`}>
                              {exp.status}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            {exp.status === "PENDING" ? (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleApproval(exp.id, "APPROVED")}
                                  disabled={loading}
                                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 disabled:opacity-50 ${buttonSuccess}`}
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleApproval(exp.id, "REJECTED")}
                                  disabled={loading}
                                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 disabled:opacity-50 ${buttonDanger}`}
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setSelectedExpense(exp)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${inputBg} border`}
                              >
                                View Details
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
                <div className={`text-sm ${textSecondary}`}>
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredExpenses.length)} of {filteredExpenses.length} entries
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          )}
        </div>

        {/* Details Modal */}
        {selectedExpense && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedExpense(null)}>
            <div className={`rounded-lg border p-6 max-w-2xl w-full transition-colors duration-300 ${modalBg}`} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-xl font-bold ${textPrimary}`}>Expense Details</h3>
                <button
                  onClick={() => setSelectedExpense(null)}
                  className={`p-1 rounded-lg hover:bg-slate-700/30 transition-colors ${textSecondary}`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className={`text-sm ${textSecondary}`}>Title</p>
                  <p className={`text-lg font-medium ${textPrimary}`}>{selectedExpense.title}</p>
                </div>

                {selectedExpense.description && (
                  <div>
                    <p className={`text-sm ${textSecondary}`}>Description</p>
                    <p className={textPrimary}>{selectedExpense.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className={`text-sm ${textSecondary}`}>Amount</p>
                    <p className={`text-xl font-bold ${textPrimary}`}>₹{selectedExpense.amount.toLocaleString()}</p>
                  </div>

                  <div>
                    <p className={`text-sm ${textSecondary}`}>Payment Mode</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={textSecondary}>
                        {getPaymentModeIcon(selectedExpense.paymentMode)}
                      </span>
                      <p className={textPrimary}>{selectedExpense.paymentMode}</p>
                    </div>
                  </div>

                  <div>
                    <p className={`text-sm ${textSecondary}`}>Created By</p>
                    <p className={textPrimary}>{selectedExpense.createdBy}</p>
                  </div>

                  <div>
                    <p className={`text-sm ${textSecondary}`}>Date</p>
                    <p className={textPrimary}>
                      {new Date(selectedExpense.expenseDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div>
                  <p className={`text-sm ${textSecondary}`}>Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${getStatusBadge(selectedExpense.status)}`}>
                    {selectedExpense.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
