import React, { useState } from "react";
import { FinanceReportRevenue } from "../../../services/authapi";
import type { RevenueReport } from "../../../types/FinanceReport.types";
import { showToast } from "../../../utils/toast";
import { useTheme } from "../../../components/layout/ThemeContext";
import { NavLink } from "react-router-dom";


import RevenueAreaChart from "../../../components/FinanceReport/RevenueAreaChart";
import RevenueBarChart from "../../../components/FinanceReport/RevenueBarChart";
import { SummaryCard } from "../../../components/FinanceReport/SummaryCard";
import { ExpenseReletedReport } from "./ExpenseGenarateReport";


const RevenueGenerateReport: React.FC = () => {
  const { isDark } = useTheme();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<RevenueReport | null>(null);

  const generateReport = async () => {
    if (!startDate || !endDate) {
      showToast("Please select date range", "error");
      return;
    }

    try {
      setLoading(true);
      const res = await FinanceReportRevenue(startDate, endDate);
      setReport(res);
    } catch (err: any) {
      showToast(
        err?.response?.data?.message || "Failed to load report",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // 🎨 Theme styles
  const containerBg = isDark
    ? "bg -green text-slate-100"
    : "bg-blue text-slate-900";

  const cardBg = isDark
    ? "bg-[#0f1419] border-gray-800"
    : "bg-white border-gray-200";

  const inputBg = isDark
    ? "bg-slate-800 border-gray-700 text-slate-100"
    : "bg-white border-gray-300 text-slate-900";

  const buttonPrimary =
    "bg-blue-600 hover:bg-blue-700 text-white";

   
  const textSecondary = isDark ? "text-slate-400" : "text-gray-600";

  return (
    <div className={`min-h-screen p-6 ${containerBg}`}>


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
            to='/finance-report'
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
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">
          Finance Revenue Report
        </h2>

        {/* 📅 Date Range */}
        <div className="flex gap-4 mb-8">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={`p-3 rounded-lg border ${inputBg}`}
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={`p-3 rounded-lg border ${inputBg}`}
          />

          <button
            onClick={generateReport}
            className={`px-6 py-3 rounded-lg ${buttonPrimary}`}
          >
            Generate Report
          </button>
        </div>

        {loading && <p className="text-gray-400">Loading report...</p>}

        {/* 📊 Charts */}
        {report && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Fee Collection Trends */}
            <div className={`rounded-2xl border p-6 ${cardBg}`}>
              <h3 className="text-sm text-gray-400 mb-4">
                Fee Collection Trends
              </h3>

               <RevenueAreaChart
                 key={isDark ? "dark" : "light"}
                data={report.monthlyRevenue}
                isDark={isDark}
                  />
            </div>

            {/* Monthly Income */}
            <div className={`rounded-2xl border p-6 ${cardBg}`}>
              <h3 className="text-sm text-gray-400 mb-4">
                Monthly Income
              </h3>

              <RevenueBarChart
                data={report.monthlyRevenue}
                isDark={isDark}
              />
            </div>
          </div>
        )}

        
        {report && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <SummaryCard
              title="Total Revenue"
              value={report.totalRevenue}
            />
            <SummaryCard
              title="Paid Revenue"
              value={report.paidRevenue}
            />
            <SummaryCard
              title="Pending Revenue"
              value={report.pendingRevenue}
            />
            <SummaryCard
              title="Net Profit"
              value={report.paidRevenue - report.pendingRevenue}
            />
          </div>
        )}
      </div>
      <ExpenseReletedReport/>
    </div>
  );
};

export default RevenueGenerateReport;
