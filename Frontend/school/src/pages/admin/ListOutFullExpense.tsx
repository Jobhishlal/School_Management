import React, { useEffect, useState } from "react";
import { ListOutFullExpense } from "../../services/authapi";
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
  approvedBy?: string;
  createdAt: string;
}

export default function ExpenseHistory() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const data = await ListOutFullExpense();
      setExpenses(data.data);
    } catch (err: any) {
      showToast(err?.message || "Failed to load expenses", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Expense History</h2>

      {expenses.length === 0 ? (
        <p>No expenses found</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Title</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Created By</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Approved By</th>
              <th className="border p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp.id}>
                <td className="border p-2">{exp.title}</td>
                <td className="border p-2">{exp.amount}</td>
                <td className="border p-2">{exp.createdBy}</td>
                <td
                  className={`border p-2 font-semibold ${
                    exp.status === "APPROVED"
                      ? "text-green-600"
                      : exp.status === "REJECTED"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {exp.status}
                </td>
                <td className="border p-2">
                  {exp.approvedBy || "-"}
                </td>
                <td className="border p-2">
                  {new Date(exp.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

