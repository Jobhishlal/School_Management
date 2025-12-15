import React, { useEffect, useState } from "react";
import { ExpanceApproval, Pendingstatuslist } from "../../services/authapi";
import { showToast } from "../../utils/toast";

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
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch pending expenses
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const data = await Pendingstatuslist();
      console.log("data",data)
      setExpenses(data);
    } catch (err: any) {
      showToast(err?.message || "Failed to fetch expenses", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleApproval = async (
    expenseId: string,
    action: "APPROVED" | "REJECTED"
  ) => {
    try {
      setLoading(true);
     const res = await ExpanceApproval(expenseId, action);
     console.log("rached res",res)
      showToast(`Expense ${action.toLowerCase()} successfully`, "success");
      fetchExpenses(); 
    } catch (err: any) {
      showToast(err?.message || "Approval failed", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Pending Expenses</h2>

      {expenses.length === 0 ? (
        <p>No pending expenses</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Title</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Created By</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp.id}>
                <td className="border p-2">{exp.title}</td>
                <td className="border p-2">{exp.amount}</td>
                <td className="border p-2">{exp.createdBy}</td>
                <td className="border p-2">
                  {new Date(exp.expenseDate).toLocaleDateString()}
                </td>
                <td className="border p-2 space-x-2">
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded"
                    onClick={() => handleApproval(exp.id, "APPROVED")}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded"
                    onClick={() => handleApproval(exp.id, "REJECTED")}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
