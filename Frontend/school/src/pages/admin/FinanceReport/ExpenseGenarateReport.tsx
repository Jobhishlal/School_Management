import { useEffect, useState } from "react";
import { ExpenseReport } from "../../../services/authapi";
import type { ExpenseReportType } from "../../../types/ExpenseReport.types";
import { showToast } from "../../../utils/toast";
import { useTheme } from "../../../components/layout/ThemeContext";
import { NavLink } from "react-router-dom";

import RevenueAreaChart from "../../../components/FinanceReport/RevenueAreaChart";
import RevenueBarChart from "../../../components/FinanceReport/RevenueBarChart";
import { SummaryCard } from "../../../components/FinanceReport/SummaryCard";


export function ExpenseReletedReport() {
  const { isDark } = useTheme();

  const [report, setReport] = useState<ExpenseReportType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExpenseReport();
  }, []);

  const fetchExpenseReport = async () => {
    try {
      setLoading(true);
      const res = await ExpenseReport();

      const normalized: ExpenseReportType = {
        totalExpense: res.totalExpense,
        approvedExpense: res.approvedExpense,
        pendingExpense: res.pendingExpense,
        monthlyExpense: res.monthlyexpense,
      };

      setReport(normalized);
    } catch (error) {
      showToast("Failed to fetch expense report", "error");
    } finally {
      setLoading(false);
    }
  };



  const containerBg = isDark
    ? "bg-[#0a0e12] text-slate-100"
    : "bg-[#fafbfc] text-slate-900";

  const cardBg = isDark
    ? "bg-[#0f1419] border-gray-800"
    : "bg-white border-gray-200";

  return (
    <div className={`min-h-screen p-6 ${containerBg}`}>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Expense Report</h2>
          <NavLink
            to="/admin/finance-report"
            className="text-sm text-blue-500 hover:underline"
          >
            ← Back
          </NavLink>
        </div>

        {loading && <p>Loading expense report...</p>}

        {report && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SummaryCard
                title="Total Expense"
                value={report.totalExpense}
                isDark={isDark}
                cardBg={cardBg}
                textPrimary=""
                textSecondary=""
              />
              <SummaryCard
                title="Approved Expense"
                value={report.approvedExpense}
                isDark={isDark}
                cardBg={cardBg}
                textPrimary=""
                textSecondary=""
              />
              <SummaryCard
                title="Pending Expense"
                value={report.pendingExpense}
                isDark={isDark}
                cardBg={cardBg}
                textPrimary=""
                textSecondary=""
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Monthly Expense Bar Chart */}
              <div className={`p-6 rounded-xl border ${cardBg}`}>
                <h3 className="text-sm font-medium mb-4">
                  Monthly Expense (Bar)
                </h3>

                <RevenueBarChart
                  data={report.monthlyExpense}
                  isDark={isDark}
                />


              </div>

              {/* Expense Trend Area Chart */}
              <div className={`p-6 rounded-xl border ${cardBg}`}>
                <h3 className="text-sm font-medium mb-4">
                  Expense Trend
                </h3>

                <RevenueAreaChart
                  data={report.monthlyExpense}
                  isDark={isDark}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
