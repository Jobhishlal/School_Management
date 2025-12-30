import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ParentAttendanceList, attendacedatebasefilterparents } from "../../services/authapi";

import { getDecodedToken } from "../../utils/DecodeToken";
import type { DashboardData } from "../../types/ParentsattendanceList";
import { useTheme } from "../../components/layout/ThemeContext";

const ParentAttendance: React.FC = () => {
  const { isDark } = useTheme();

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const parentId = getDecodedToken()?.id;

  const pageBg = isDark
    ? "bg-[#121A21] text-white"
    : "bg-gray-100 text-gray-900";

  const cardBg = isDark
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-200";

  const mutedText = isDark ? "text-gray-400" : "text-gray-600";

  /* ---------------- INITIAL LOAD ---------------- */
  useEffect(() => {
    const fetchAttendance = async () => {
      if (!parentId) {
        setError("Parent not logged in");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await ParentAttendanceList(parentId);

        if (res.success) {
          setDashboard(res.data);
        } else {
          setError("Failed to fetch attendance");
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [parentId]);

  /* ---------------- DATE FILTER FETCH ---------------- */
  const fetchFilteredAttendance = async () => {
    try {
      setLoading(true);
      const res = await attendacedatebasefilterparents(

        startDate,
        endDate
      );
      console.log("result")

      if (res?.result) {
        setDashboard(res.result);
        setError("");
      } else {
        setError("No records found for selected date range");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- TREND DATA ---------------- */
  const generateTrendData = () => {
    if (!dashboard?.logs) return [];

    const monthly: Record<
      string,
      { present: number; absent: number; leave: number }
    > = {};

    dashboard.logs?.forEach((log) => {
      const month = new Date(log.date).toLocaleDateString("en-US", {
        month: "short",
      });

      if (!monthly[month]) {
        monthly[month] = { present: 0, absent: 0, leave: 0 };
      }

      if (log.status === "Present") monthly[month].present++;
      if (log.status === "Absent") monthly[month].absent++;
      if (log.status === "Leave") monthly[month].leave++;
    });

    return Object.entries(monthly).map(([month, data]) => ({
      month,
      ...data,
    }));
  };

  /* ---------------- UI STATES ---------------- */
  if (loading) {
    return (
      <div className={`flex items-center justify-center h-screen ${pageBg}`}>
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Loading attendance...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center h-screen ${pageBg}`}>
        <div className="border border-red-500 bg-red-500/10 rounded-lg p-6">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className={`flex items-center justify-center h-screen ${pageBg}`}>
        <p>No attendance data available</p>
      </div>
    );
  }

  const { student, summary, today, logs } = dashboard;
  const trendData = generateTrendData();

  /* ---------------- MAIN UI ---------------- */
  return (
    <div className={`min-h-screen p-6 ${pageBg}`}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className={`rounded-xl p-6 border shadow ${cardBg}`}>
          <div className="flex items-center gap-4">
            <img
              src={student.photo}
              alt={student.name}
              className="w-16 h-16 rounded-full border-2 border-blue-500"
            />
            <div>
              <h2 className="text-xl font-bold">{student.name}</h2>
              <p className={`text-sm mt-1 ${mutedText}`}>
                Morning:
                <span className="text-green-500 font-medium">
                  {" "}
                  {today?.Morning ?? "Not Marked"}
                </span>{" "}
                | Afternoon:
                <span className="text-green-500 font-medium">
                  {" "}
                  {today?.Afternoon ?? "Not Marked"}
                </span>
              </p>

            </div>
          </div>
        </div>

        {/* DATE FILTER */}
        <div className={`rounded-xl p-6 border shadow ${cardBg}`}>
          <h3 className="font-semibold mb-4">Filter Attendance by Date</h3>

          <div className="flex gap-4 items-end flex-wrap">
            <div>
              <p className="text-sm mb-1">Start Date</p>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded px-3 py-2"
              />
            </div>

            <div>
              <p className="text-sm mb-1">End Date</p>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded px-3 py-2"
              />
            </div>

            <button
              onClick={fetchFilteredAttendance}
              className="px-4 py-2 bg-blue-500 text-white rounded shadow"
              disabled={!startDate || !endDate}
            >
              Apply Filter
            </button>
          </div>
        </div>

        {/* SUMMARY */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Attendance Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Classes" value={summary?.totalClasses || 0} />
            <StatCard label="Present" value={summary?.present || 0} color="text-green-500" />
            <StatCard label="Absent" value={summary?.absent || 0} color="text-red-500" />
            <StatCard label="Leave" value={summary?.leave || 0} color="text-yellow-500" />
          </div>
        </div>

        {/* PERCENTAGE */}
        <div className={`rounded-xl p-6 border shadow ${cardBg}`}>
          <div className="flex justify-between mb-2">
            <h3 className="font-semibold">Attendance Percentage</h3>
            <span className="text-xl font-bold text-blue-500">
              {summary?.percentage || 0}%
            </span>
          </div>
          <div className="h-3 bg-gray-300 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500"
              style={{ width: `${summary.percentage}%` }}
            />
          </div>
        </div>

        {/* TREND CHARTS */}
        {trendData.length > 0 && (
          <div className={`rounded-xl p-6 border shadow ${cardBg}`}>
            <h3 className="font-semibold mb-4">Attendance Trend</h3>

            <div className="grid md:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="present" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>

              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line dataKey="present" stroke="#22c55e" />
                  <Line dataKey="absent" stroke="#ef4444" />
                  <Line dataKey="leave" stroke="#f59e0b" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* LOGS */}
        <div className={`rounded-xl p-6 border shadow ${cardBg}`}>
          <h3 className="font-semibold mb-4">Attendance Logs</h3>

          {(!logs || logs.length === 0) ? (
            <p className={mutedText}>No attendance records found</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Session</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Remark</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-2">{log.date}</td>
                    <td className="py-2">{log.session}</td>
                    <td className="py-2">{log.status}</td>
                    <td className="py-2">{log.remark || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
};

/* ---------------- STAT CARD ---------------- */
const StatCard = ({
  label,
  value,
  color = "text-inherit",
}: {
  label: string;
  value: number;
  color?: string;
}) => {
  const { isDark } = useTheme();

  return (
    <div
      className={`rounded-xl p-4 border shadow
        ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}
      `}
    >
      <p className={`text-sm mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
        {label}
      </p>
      <h3 className={`text-3xl font-bold ${color}`}>{value}</h3>
    </div>
  );
};

export default ParentAttendance;
