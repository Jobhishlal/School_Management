// import React, { useEffect, useState } from "react";
// import { ListOutFullExpense, ExpenseCreate, PendingExpenseUpdate } from "../../services/authapi";
// import { showToast } from "../../utils/toast";
// import { useTheme } from "../../components/layout/ThemeContext";
// import { NavLink } from "react-router-dom";

// interface Expense {
//   id: string;
//   title: string;
//   description: string;
//   amount: number;
//   expenseDate: string;
//   paymentMode: string;
//   status: "PENDING" | "APPROVED" | "REJECTED";
//   createdBy: string;
//   approvedBy?: string;
//   createdAt: string;
// }

// interface ExpenseFormDTO {
//   title: string;
//   description: string;
//   amount: number;
//   expenseDate: string;
//   paymentMode: string;
//   createdBy: string;
// }

// export default function ExpenseManagement() {
//    const { isDark } = useTheme();
//   const [expenses, setExpenses] = useState<Expense[]>([]);
//   const [formData, setFormData] = useState<ExpenseFormDTO>({
//     title: "",
//     description: "",
//     amount: 0,
//     expenseDate: "",
//     paymentMode: "CASH",
//     createdBy: "",
//   });
//   const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

//   const fetchExpenses = async () => {
//     try {
//       const res = await ListOutFullExpense();
//       setExpenses(res.data);
//     } catch (err: any) {
//       showToast(err?.message || "Failed to load expenses", "error");
//     }
//   };

//   useEffect(() => {
//     fetchExpenses();
//   }, []);


//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: name === "amount" ? Number(value) : value,
//     });
//   };

 
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const createdBy = localStorage.getItem("role") || "";
//     if (!createdBy) return showToast("User not logged in", "error");

//     const payload = {
//       ...formData,
//       createdBy,
//       expenseDate: new Date(formData.expenseDate).toISOString(),
//     };

//     try {
//       if (editingExpense) {
      
//         await PendingExpenseUpdate(editingExpense.id, payload);
//         showToast("Expense updated successfully");
//         setEditingExpense(null);
//       } else {
       
//         await ExpenseCreate(payload);
//         showToast("Expense created successfully");
//       }

//       // Reset form
//       setFormData({
//         title: "",
//         description: "",
//         amount: 0,
//         expenseDate: "",
//         paymentMode: "CASH",
//         createdBy: "",
//       });

//       fetchExpenses();
//     } catch (err: any) {
//       showToast(err?.message || "Operation failed", "error");
//     }
//   };

//   // 🔹 Handle edit click
//   const handleEditClick = (expense: Expense) => {
//     setEditingExpense(expense);
//     setFormData({
//       title: expense.title,
//       description: expense.description,
//       amount: expense.amount,
//       expenseDate: expense.expenseDate.split("T")[0],
//       paymentMode: expense.paymentMode,
//       createdBy: expense.createdBy,
//     });
//   };

//    const textPrimary = isDark ? "text-slate-200" : "text-gray-900";
//   const textSecondary = isDark ? "text-slate-400" : "text-gray-600";
//   return (
//     <div className="max-w-6xl mx-auto p-4">
//     <div className="flex gap-6 text-sm border-b border-slate-700/50">
//   <NavLink
//     to="/finance-management"
//     className={({ isActive }) =>
//       `pb-3 border-b-2 font-medium transition-colors duration-200 ${
//         isActive
//           ? "border-blue-500 text-blue-600"
//           : `border-transparent ${textSecondary} hover:text-blue-400`
//       }`
//     }
//   >
//     Fee Management
//   </NavLink>

//   <NavLink
//     to="/expense-management"
//     className={({ isActive }) =>
//       `pb-3 border-b-2 font-medium transition-colors duration-200 ${
//         isActive
//           ? "border-blue-500 text-blue-600"
//           : `border-transparent ${textSecondary} hover:text-blue-400`
//       }`
//     }
//   >
//     Expense Management
//   </NavLink>

//   <NavLink
//     to="/fee-report"
//     className={({ isActive }) =>
//       `pb-3 border-b-2 font-medium transition-colors duration-200 ${
//         isActive
//           ? "border-blue-500 text-blue-600"
//           : `border-transparent ${textSecondary} hover:text-blue-400`
//       }`
//     }
//   >
//     Fee Report
//   </NavLink>
// </div>

//       {/* 🔹 Form */}
//       <div className="max-w-md mx-auto bg-white p-6 rounded shadow mb-6">
//         <h2 className="text-xl font-semibold mb-4">
//           {editingExpense ? "Edit Expense" : "Create Expense"}
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             name="title"
//             value={formData.title}
//             onChange={handleChange}
//             placeholder="Expense Title"
//             className="w-full border p-2 rounded"
//             required
//           />
//           <textarea
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             placeholder="Description"
//             className="w-full border p-2 rounded"
//           />
//           <input
//             type="number"
//             name="amount"
//             value={formData.amount}
//             onChange={handleChange}
//             placeholder="Amount"
//             className="w-full border p-2 rounded"
//             required
//           />
//           <input
//             type="date"
//             name="expenseDate"
//             value={formData.expenseDate}
//             onChange={handleChange}
//             className="w-full border p-2 rounded"
//             required
//           />
//           <select
//             name="paymentMode"
//             value={formData.paymentMode}
//             onChange={handleChange}
//             className="w-full border p-2 rounded"
//           >
//             <option value="CASH">Cash</option>
//             <option value="UPI">UPI</option>
//             <option value="BANK">Bank</option>
//             <option value="CARD">Card</option>
//           </select>

//           <button
//             type="submit"
//             className="w-full bg-green-600 text-white py-2 rounded"
//           >
//             {editingExpense ? "Update Expense" : "Create Expense"}
//           </button>
//         </form>
//       </div>

//       {/* 🔹 Table */}
//       <h2 className="text-2xl font-bold mb-4">Expense History</h2>
//       <table className="w-full border-collapse border">
//         <thead>
//           <tr>
//              <th className="border p-2">Date</th>
//             <th className="border p-2">Title</th>
//              <th className="border p-2">Description</th>
//             <th className="border p-2">Amount</th>
//             <th className="border p-2">Status</th>
//             <th className="border p-2">approvedBy</th>

//             <th className="border p-2">Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {expenses.map((exp) => (
//             <tr key={exp.id}>
//               <td className="border p-2">{exp.expenseDate}</td>

//               <td className="border p-2">{exp.title}</td>
//               <td className="border p-2">{exp.description}</td>
//               <td className="border p-2">{exp.amount}</td>
//               <td
//                 className={`border p-2 font-semibold ${
//                   exp.status === "APPROVED"
//                     ? "text-green-600"
//                     : exp.status === "REJECTED"
//                     ? "text-red-600"
//                     : "text-yellow-600"
//                 }`}
//               >
//                 {exp.status}
//               </td>
//                <td className="border p-2">{exp.approvedBy}</td>
//               <td className="border p-2">
//                 {exp.status === "PENDING" && (
//                   <button
//                     className="bg-blue-500 text-white px-3 py-1 rounded"
//                     onClick={() => handleEditClick(exp)}
//                   >
//                     Edit
//                   </button>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
























import React, { useEffect, useState } from "react";
import { ListOutFullExpense, ExpenseCreate, PendingExpenseUpdate } from "../../services/authapi";
import { showToast } from "../../utils/toast";
import { useTheme } from "../../components/layout/ThemeContext";
import { NavLink } from "react-router-dom";

interface Expense {
  id: string;
  title: string;
  description: string;
  amount: number;
  expenseDate: string;
  paymentMode: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdBy: string;
  approvedBy?: string;
  createdAt: string;
}

interface ExpenseFormDTO {
  title: string;
  description: string;
  amount: number;
  expenseDate: string;
  paymentMode: string;
  createdBy: string;
}

export default function ExpenseManagement() {
  const { isDark } = useTheme();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [formData, setFormData] = useState<ExpenseFormDTO>({
    title: "",
    description: "",
    amount: 0,
    expenseDate: "",
    paymentMode: "CASH",
    createdBy: "",
  });
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const fetchExpenses = async () => {
    try {
      const res = await ListOutFullExpense();
      setExpenses(res.data);
    } catch (err: any) {
      showToast(err?.message || "Failed to load expenses", "error");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "amount" ? Number(value) : value,
    });
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const createdBy = localStorage.getItem("role") || "";
  if (!createdBy) {
    showToast("User not logged in", "error");
    return;
  }

 
 



  const payload = {
    ...formData,
    createdBy,
    
  };

  try {
    if (editingExpense) {
      await PendingExpenseUpdate(editingExpense.id, payload);
      showToast("Expense updated successfully","success");
      setEditingExpense(null);
    } else {
      await ExpenseCreate(payload);
      showToast("Expense created successfully","success");
    }

    setFormData({
      title: "",
      description: "",
      amount: 0,
      expenseDate: "",
      paymentMode: "CASH",
      createdBy: "",
    });

    fetchExpenses();
  } catch (err: any) {
    const backendMessage =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "Operation failed";

    showToast(backendMessage, "error");
  }
};


  const handleEditClick = (expense: Expense) => {
    setEditingExpense(expense);
    setFormData({
      title: expense.title,
      description: expense.description,
      amount: expense.amount,
      expenseDate: expense.expenseDate.split("T")[0],
      paymentMode: expense.paymentMode,
      createdBy: expense.createdBy,
    });
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
    setFormData({
      title: "",
      description: "",
      amount: 0,
      expenseDate: "",
      paymentMode: "CASH",
      createdBy: "",
    });
  };

  // Theme classes
  const containerBg = isDark ? "bg-[#121A21] text-slate-100" : "bg-[#fafbfc] text-slate-900";
  const cardBg = isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-gray-200";
  const inputBg = isDark ? "bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-400" : "bg-white border-gray-300 text-slate-900 placeholder-gray-500";
  const textPrimary = isDark ? "text-slate-200" : "text-gray-900";
  const textSecondary = isDark ? "text-slate-400" : "text-gray-600";
  const tableBg = isDark ? "bg-slate-800/30" : "bg-white";
  const tableHeaderBg = isDark ? "bg-slate-700/50" : "bg-gray-50";
  const tableBorder = isDark ? "border-slate-700" : "border-gray-200";

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${containerBg}`}>
      <div className="max-w-7xl mx-auto">
        {/* Navigation Tabs */}
        <div className="flex gap-6 text-sm border-b mb-6" style={{ borderColor: isDark ? "rgba(71, 85, 105, 0.5)" : "rgba(229, 231, 235, 1)" }}>
          <NavLink
            to="/finance-management"
            className={({ isActive }) =>
              `pb-3 border-b-2 font-medium transition-colors duration-200 ${
                isActive
                  ? "border-blue-500 text-blue-600"
                  : `border-transparent ${textSecondary} hover:text-blue-400`
              }`
            }
          >
            Fee Management
          </NavLink>

          <NavLink
            to="/expense-management"
            className={({ isActive }) =>
              `pb-3 border-b-2 font-medium transition-colors duration-200 ${
                isActive
                  ? "border-blue-500 text-blue-600"
                  : `border-transparent ${textSecondary} hover:text-blue-400`
              }`
            }
          >
            Expense Management
          </NavLink>

          <NavLink
            to="/fee-report"
            className={({ isActive }) =>
              `pb-3 border-b-2 font-medium transition-colors duration-200 ${
                isActive
                  ? "border-blue-500 text-blue-600"
                  : `border-transparent ${textSecondary} hover:text-blue-400`
              }`
            }
          >
            Fee Report
          </NavLink>
        </div>

        <div className={`max-w-3xl mx-auto p-6 rounded-lg border transition-colors duration-300 mb-8 ${cardBg}`}>
          <h2 className={`text-lg font-semibold mb-6 ${textPrimary}`}>
            {editingExpense ? "Edit Expense" : "Create New Expense"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         
              <div>
                <label className={`block text-sm font-medium mb-2 ${textPrimary}`}>
                  Expense Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter expense title"
                  className={`w-full border rounded-lg px-3 py-2 text-sm transition-colors duration-200 ${inputBg}`}
                  
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${textPrimary}`}>
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Enter amount"
                  className={`w-full border rounded-lg px-3 py-2 text-sm transition-colors duration-200 ${inputBg}`}
                 
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${textPrimary}`}>
                  Expense Date
                </label>
                <input
                  type="date"
                  name="expenseDate"
                  value={formData.expenseDate}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-3 py-2 text-sm transition-colors duration-200 ${inputBg}`}
                 
                />
              </div>

              {/* Payment Mode */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${textPrimary}`}>
                  Payment Mode
                </label>
                <select
                  name="paymentMode"
                  value={formData.paymentMode}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-3 py-2 text-sm transition-colors duration-200 ${inputBg}`}
                >
                  <option value="CASH">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="BANK">Bank Transfer</option>
                  <option value="CARD">Card</option>
                </select>
              </div>
            </div>

            {/* Description - Full Width */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${textPrimary}`}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description"
                rows={3}
                className={`w-full border rounded-lg px-3 py-2 text-sm transition-colors duration-200 ${inputBg}`}
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                {editingExpense ? "Update Expense" : "Create Expense"}
              </button>
              {editingExpense && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 border ${
                    isDark
                      ? "border-slate-600 text-slate-300 hover:bg-slate-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Expense Table Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-xl font-semibold ${textPrimary}`}>
              Expense History
            </h3>
            <span className={`text-sm ${textSecondary}`}>
              Total: {expenses.length} expenses
            </span>
          </div>

          <div className={`rounded-lg border overflow-hidden transition-colors duration-200 ${tableBg} ${tableBorder}`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`${tableHeaderBg}`}>
                  <tr>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${textSecondary}`}>
                      Date
                    </th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${textSecondary}`}>
                      Title
                    </th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${textSecondary}`}>
                      Description
                    </th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${textSecondary}`}>
                      Amount
                    </th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${textSecondary}`}>
                      Payment
                    </th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${textSecondary}`}>
                      Status
                    </th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${textSecondary}`}>
                      Approved By
                    </th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${textSecondary}`}>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: isDark ? "rgba(71, 85, 105, 0.5)" : "rgba(229, 231, 235, 1)" }}>
                  {expenses.length === 0 ? (
                    <tr>
                      <td colSpan={8} className={`px-4 py-12 text-center text-sm ${textSecondary}`}>
                        <div className="flex flex-col items-center justify-center">
                          <svg className="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <p className="font-medium">No expenses found</p>
                          <p className="text-xs mt-1">Create your first expense using the form above</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    expenses.map((exp) => (
                      <tr
                        key={exp.id}
                        className={`transition-colors duration-200 ${
                          isDark ? "hover:bg-slate-700/30" : "hover:bg-gray-50"
                        }`}
                      >
                        <td className={`px-4 py-4 text-sm whitespace-nowrap ${textPrimary}`}>
                          {exp.expenseDate.split('T')[0]}
                        </td>
                        <td className={`px-4 py-4 text-sm font-medium ${textPrimary}`}>
                          {exp.title}
                        </td>
                        <td className={`px-4 py-4 text-sm ${textSecondary} max-w-xs truncate`}>
                          {exp.description || "-"}
                        </td>
                        <td className={`px-4 py-4 text-sm font-semibold ${textPrimary}`}>
                          ₹{exp.amount.toLocaleString()}
                        </td>
                        <td className={`px-4 py-4 text-sm ${textSecondary}`}>
                          {exp.paymentMode}
                        </td>
                        <td className="px-4 py-4 text-sm whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              exp.status === "APPROVED"
                                ? isDark
                                  ? "bg-green-900/30 text-green-400 border border-green-800"
                                  : "bg-green-100 text-green-800 border border-green-200"
                                : exp.status === "REJECTED"
                                ? isDark
                                  ? "bg-red-900/30 text-red-400 border border-red-800"
                                  : "bg-red-100 text-red-800 border border-red-200"
                                : isDark
                                ? "bg-yellow-900/30 text-yellow-400 border border-yellow-800"
                                : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                            }`}
                          >
                            {exp.status}
                          </span>
                        </td>
                        <td className={`px-4 py-4 text-sm ${textSecondary}`}>
                          {exp.approvedBy || "-"}
                        </td>
                        <td className="px-4 py-4 text-sm whitespace-nowrap">
                          {exp.status === "PENDING" ? (
                            <button
                              onClick={() => handleEditClick(exp)}
                              className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 hover:underline"
                            >
                              Edit
                            </button>
                          ) : (
                            <span className={textSecondary}>-</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}