
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
import { StudentAttendanceList, studentAttendanceDateFilter } from "../../services/authapi";

import { useTheme } from "../../components/layout/ThemeContext";
import { Pagination } from "../../components/common/Pagination";
import { showToast } from "../../utils/toast";

// Interface definitions (reused from ParentAttendance or defined here)
interface AttendanceLog {
    date: string;
    session: string;
    status: string;
    remark?: string;
}

interface DashboardData {
    student: {
        id: string;
        name: string;
        photo?: string;
        classId: string;
    };
    summary: {
        totalClasses: number;
        present: number;
        absent: number;
        leave: number;
        percentage: number;
    };
    today: {
        Morning: string;
        Afternoon: string;
    };
    calendar: {
        date: string;
        status: string;
    }[];
    logs: AttendanceLog[];
}

export const StudentAttendanceView: React.FC = () => {
    const { isDark } = useTheme();

    const [dashboard, setDashboard] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

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
            try {
                setLoading(true);
                const res = await StudentAttendanceList();

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
    }, []);

    /* ---------------- DATE FILTER FETCH ---------------- */
    const fetchFilteredAttendance = async () => {
        try {
            setLoading(true);
            const res = await studentAttendanceDateFilter(
                startDate,
                endDate
            );

            if (res?.result) {
                // Only update logs/summary if structure matches, or partial update?
                // Parent implementation replaced the whole dashboard state with result?
                // ParentAttendance API returns "result" which seems to match DashboardData structure or at least parts of it.
                // Let's assume backend returns full dashboard structure or similar enough to display.
                // Actually backend Controller findAttendanceByDateRange returns { result: ... } which is ParentAttendanceHistory.
                // ParentAttendanceHistory has student, summary, logs. It is missing 'today' and 'calendar' (maybe?).
                // Let's check backend repo getStudentOwnAttendanceByDateRange. Yes, returns ParentAttendanceHistory.
                // DashboardData has 'today', 'calendar'. 
                // So we might lose 'today' and 'calendar' if we overwrite dashboard.
                // But for filter view, usually today/calendar is less relevant or we keep old.
                // Let's merge or just accept it might be missing.
                setDashboard(prev => ({
                    ...prev!,
                    ...res.result
                }));
                setError("");
            } else {
                setError("No records found for selected date range");
            }
        } catch (err: any) {
            showToast(err.response?.data?.message || err.message || "Something went wrong", "error");
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

        // Sort logs by date ascending for chart if needed, but here we aggregate by month.
        dashboard.logs.forEach((log) => {
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
        <div className={`min-h-screen p-6 transition-colors duration-300 ${pageBg}`}>
            <div className="max-w-7xl mx-auto space-y-6">

                {/* HEADER */}
                <div className={`rounded-xl p-6 border shadow ${cardBg}`}>
                    <div className="flex items-center gap-4">
                        {student.photo ? (
                            <img
                                src={student.photo}
                                alt={student.name}
                                className="w-16 h-16 rounded-full border-2 border-blue-500 object-cover"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-2xl">
                                {student.name.charAt(0)}
                            </div>
                        )}

                        <div>
                            <h2 className="text-xl font-bold">{student.name}</h2>
                            <p className={`text-sm font-medium ${mutedText} mb-1`}>
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                            {today && (
                                <p className={`text-sm mt-1 ${mutedText}`}>
                                    Morning:
                                    <span className="text-green-500 font-medium">
                                        {" "}
                                        {today.Morning ?? "Not Marked"}
                                    </span>{" "}
                                    | Afternoon:
                                    <span className="text-green-500 font-medium">
                                        {" "}
                                        {today.Afternoon ?? "Not Marked"}
                                    </span>
                                </p>
                            )}
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
                                max={new Date().toISOString().split("T")[0]}
                                onChange={(e) => setStartDate(e.target.value)}
                                className={`border rounded px-3 py-2 ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                            />
                        </div>

                        <div>
                            <p className="text-sm mb-1">End Date</p>
                            <input
                                type="date"
                                value={endDate}
                                max={new Date().toISOString().split("T")[0]}
                                onChange={(e) => setEndDate(e.target.value)}
                                className={`border rounded px-3 py-2 ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                            />
                        </div>

                        <button
                            onClick={fetchFilteredAttendance}
                            className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition-colors"
                            disabled={!startDate || !endDate}
                        >
                            Apply Filter
                        </button>

                        {(startDate || endDate) && (
                            <button
                                onClick={() => {
                                    setStartDate("");
                                    setEndDate("");
                                    // re-fetch initial
                                    setLoading(true);
                                    StudentAttendanceList().then(res => {
                                        if (res.success) setDashboard(res.data);
                                        setLoading(false);
                                    }).catch(() => setLoading(false));
                                }}
                                className="px-4 py-2 bg-gray-500 text-white rounded shadow hover:bg-gray-600 transition-colors"
                            >
                                Reset
                            </button>
                        )}
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
                    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 transition-all duration-500"
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
                                    <Tooltip
                                        contentStyle={{ backgroundColor: isDark ? '#1f2937' : '#fff', borderColor: isDark ? '#374151' : '#e5e7eb', color: isDark ? '#fff' : '#000' }}
                                    />
                                    <Bar dataKey="present" fill="#3b82f6" name="Present" />
                                </BarChart>
                            </ResponsiveContainer>

                            <ResponsiveContainer width="100%" height={220}>
                                <LineChart data={trendData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: isDark ? '#1f2937' : '#fff', borderColor: isDark ? '#374151' : '#e5e7eb', color: isDark ? '#fff' : '#000' }}
                                    />
                                    <Line dataKey="present" stroke="#22c55e" name="Present" strokeWidth={2} />
                                    <Line dataKey="absent" stroke="#ef4444" name="Absent" strokeWidth={2} />
                                    <Line dataKey="leave" stroke="#f59e0b" name="Leave" strokeWidth={2} />
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
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm item-center">
                                    <thead>
                                        <tr className={`border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                                            <th className="text-left py-3 px-2">Date</th>
                                            <th className="text-left py-3 px-2">Session</th>
                                            <th className="text-left py-3 px-2">Status</th>
                                            <th className="text-left py-3 px-2">Remark</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {logs
                                            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                            .map((log, idx) => (
                                                <tr key={idx} className={`border-b ${isDark ? "border-gray-700 hover:bg-gray-700/50" : "border-gray-200 hover:bg-gray-50"} transition-colors`}>
                                                    <td className="py-3 px-2">{log.date}</td>
                                                    <td className="py-3 px-2">{log.session}</td>
                                                    <td className="py-3 px-2">
                                                        <span className={`px-2 py-1 rounded text-xs font-semibold
                                    ${log.status === 'Present' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : ''}
                                    ${log.status === 'Absent' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : ''}
                                    ${log.status === 'Leave' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
                                `}>
                                                            {log.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-2">{log.remark || "-"}</td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-4">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={Math.ceil((logs.length || 0) / itemsPerPage)}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        </>
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
            className={`rounded-xl p-4 border shadow transition-colors duration-300
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
