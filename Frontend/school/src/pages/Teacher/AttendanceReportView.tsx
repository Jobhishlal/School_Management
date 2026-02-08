import React, { useState } from "react";
import { getAttendanceReport, getStudentAttendanceHistory, updateAttendance } from "../../services/authapi";
import { showToast } from "../../utils/toast";
import { useTheme } from "../../components/layout/ThemeContext";
import { Calendar, Search, FileText, User, TrendingUp, CheckCircle, XCircle, Clock, Edit } from "lucide-react";

interface AttendanceReportViewProps {
    classId: string;
    students: any[];
}

const AttendanceReportView: React.FC<AttendanceReportViewProps> = ({ classId, students }) => {
    const { isDark } = useTheme();
    const [viewMode, setViewMode] = useState<"dateRange" | "studentHistory">("dateRange");

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [rangeReport, setRangeReport] = useState<any[]>([]);
    const [rangeSummary, setRangeSummary] = useState<any>(null);
    const [rangeLoading, setRangeLoading] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [historyData, setHistoryData] = useState<any>(null);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [historyLoading, setHistoryLoading] = useState(false);

    const [editingRecord, setEditingRecord] = useState<any>(null);
    const [editStatus, setEditStatus] = useState("");
    const [updateLoading, setUpdateLoading] = useState(false);

    const handleUpdateAttendance = async () => {
        if (!editingRecord || !editStatus) return;
        setUpdateLoading(true);
        try {
            await updateAttendance(selectedStudent.id, editingRecord.date, editingRecord.session, editStatus);
            showToast("Attendance updated", "success");
            setEditingRecord(null);
            fetchStudentHistory(selectedStudent.id);
        } catch (error) {
            showToast("Failed to update", "error");
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleRangeSearch = async () => {
        if (!startDate || !endDate) return showToast("Select both dates", "warning");

        setRangeLoading(true);
        try {
            const res = await getAttendanceReport(classId, new Date(startDate), new Date(endDate));
            if (res.success) {
                setRangeReport(res.report);

                let totalPresent = 0;
                let totalAbsent = 0;
                let totalSessions = 0;
                res.report.forEach((day: any) => {
                    totalPresent += day.presentCount;
                    totalAbsent += day.absentCount;
                    totalSessions++;
                });
                const totalPossible = totalSessions * students.length;

                setRangeSummary({
                    totalPresent,
                    totalAbsent,
                    percentage: totalPossible ? Math.round((totalPresent / totalPossible) * 100) : 0
                });
            }
        } catch (error) {
            showToast("Failed to fetch report", "error");
        } finally {
            setRangeLoading(false);
        }
    };

    const handleStudentSearch = async () => {
        const student = students.find(s =>
            s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.id === searchQuery
        );

        if (!student) return showToast("Student not found", "error");

        setSelectedStudent(student);
        fetchStudentHistory(student.id);
    };

    const fetchStudentHistory = async (studentId: string) => {
        setHistoryLoading(true);
        try {
            const res = await getStudentAttendanceHistory(studentId, selectedMonth, selectedYear);
            if (res.success) {
                setHistoryData(res.history);
            }
        } catch (error) {
            showToast("Failed to fetch history", "error");
        } finally {
            setHistoryLoading(false);
        }
    };

    return (
        <div className={`mt-6 rounded-lg shadow-lg border ${isDark ? "bg-[#1a2632] border-gray-700" : "bg-white border-gray-200"
            }`}>
            {/* Header */}
            <div className={`p-6 border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                <div className={`flex items-center gap-3 mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                    <FileText className="w-6 h-6" />
                    <h2 className="text-2xl font-bold">Attendance Reports</h2>
                </div>
                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    View detailed attendance reports and student history
                </p>
            </div>

            {/* Tabs */}
            <div className={`flex flex-col sm:flex-row gap-0 sm:gap-2 px-6 pt-2 md:pt-4 border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                <button
                    className={`pb-3 pt-2 px-4 font-bold text-sm transition-colors relative text-left sm:text-center ${viewMode === 'dateRange'
                        ? isDark
                            ? 'text-blue-400'
                            : 'text-blue-600'
                        : isDark
                            ? 'text-gray-500 hover:text-gray-300'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    onClick={() => setViewMode("dateRange")}
                >
                    <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Range Report
                    </span>
                    {viewMode === 'dateRange' && (
                        <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${isDark ? "bg-blue-400" : "bg-blue-600"
                            }`} />
                    )}
                </button>
                <button
                    className={`pb-3 pt-2 px-4 font-bold text-sm transition-colors relative text-left sm:text-center ${viewMode === 'studentHistory'
                        ? isDark
                            ? 'text-blue-400'
                            : 'text-blue-600'
                        : isDark
                            ? 'text-gray-500 hover:text-gray-300'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    onClick={() => setViewMode("studentHistory")}
                >
                    <span className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Student History
                    </span>
                    {viewMode === 'studentHistory' && (
                        <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${isDark ? "bg-blue-400" : "bg-blue-600"
                            }`} />
                    )}
                </button>
            </div>

            {/* Content */}
            <div className="p-6">
                {viewMode === "dateRange" && (
                    <div className="space-y-6">
                        {/* Date Range Inputs */}
                        <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
                            <div className="w-full sm:flex-1">
                                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? "text-gray-500" : "text-gray-500"
                                    }`}>
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className={`w-full px-4 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 transition-all ${isDark
                                        ? "bg-[#0d1117] border-gray-700 text-white focus:ring-blue-500/50"
                                        : "bg-white border-gray-200 text-gray-900 focus:ring-blue-500"
                                        }`}
                                />
                            </div>
                            <div className="w-full sm:flex-1">
                                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? "text-gray-500" : "text-gray-500"
                                    }`}>
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className={`w-full px-4 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 transition-all ${isDark
                                        ? "bg-[#0d1117] border-gray-700 text-white focus:ring-blue-500/50"
                                        : "bg-white border-gray-200 text-gray-900 focus:ring-blue-500"
                                        }`}
                                />
                            </div>
                            <button
                                onClick={handleRangeSearch}
                                disabled={rangeLoading}
                                className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {rangeLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                        Loading...
                                    </>
                                ) : (
                                    <>
                                        <Search className="w-4 h-4" />
                                        Fetch Report
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Summary Cards */}
                        {rangeSummary && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                                <div className={`rounded-xl p-4 md:p-6 border ${isDark ? "bg-green-500/10 border-green-500/20" : "bg-green-50 border-green-100"
                                    }`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`text-[10px] md:text-sm font-bold uppercase tracking-wider ${isDark ? "text-green-500/70" : "text-green-600/70"
                                            }`}>
                                            Present
                                        </span>
                                        <CheckCircle className={`w-4 h-4 md:w-5 md:h-5 ${isDark ? "text-green-400" : "text-green-600"
                                            }`} />
                                    </div>
                                    <p className={`text-2xl md:text-3xl font-bold ${isDark ? "text-green-400" : "text-green-600"
                                        }`}>
                                        {rangeSummary.totalPresent}
                                    </p>
                                </div>

                                <div className={`rounded-xl p-4 md:p-6 border ${isDark ? "bg-red-500/10 border-red-500/20" : "bg-red-50 border-red-100"
                                    }`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`text-[10px] md:text-sm font-bold uppercase tracking-wider ${isDark ? "text-red-500/70" : "text-red-600/70"
                                            }`}>
                                            Absent
                                        </span>
                                        <XCircle className={`w-4 h-4 md:w-5 md:h-5 ${isDark ? "text-red-400" : "text-red-600"
                                            }`} />
                                    </div>
                                    <p className={`text-2xl md:text-3xl font-bold ${isDark ? "text-red-400" : "text-red-600"
                                        }`}>
                                        {rangeSummary.totalAbsent}
                                    </p>
                                </div>

                                <div className={`rounded-xl p-4 md:p-6 border col-span-2 md:col-span-1 border ${isDark ? "bg-blue-500/10 border-blue-500/20" : "bg-blue-50 border-blue-100"
                                    }`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`text-[10px] md:text-sm font-bold uppercase tracking-wider ${isDark ? "text-blue-500/70" : "text-blue-600/70"
                                            }`}>
                                            Rate
                                        </span>
                                        <TrendingUp className={`w-4 h-4 md:w-5 md:h-5 ${isDark ? "text-blue-400" : "text-blue-600"
                                            }`} />
                                    </div>
                                    <p className={`text-2xl md:text-3xl font-bold ${isDark ? "text-blue-400" : "text-blue-600"
                                        }`}>
                                        {rangeSummary.percentage}%
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Report Table */}
                        {rangeReport.length > 0 && (
                            <div className={`rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden ${isDark ? "border-gray-700" : "border-gray-200"
                                }`}>
                                {/* Mobile Card Layout */}
                                <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-800">
                                    {rangeReport.map((item, idx) => (
                                        <div key={idx} className="p-4 space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className={`text-sm font-bold ${isDark ? "text-gray-300" : "text-gray-900"}`}>
                                                    {new Date(item.date).toLocaleDateString()}
                                                </span>
                                                <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded ${item.session === "Morning"
                                                    ? isDark
                                                        ? "bg-yellow-900/30 text-yellow-300"
                                                        : "bg-yellow-100 text-yellow-800"
                                                    : isDark
                                                        ? "bg-purple-900/30 text-purple-300"
                                                        : "bg-purple-100 text-purple-800"
                                                    }`}>
                                                    {item.session}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="text-center">
                                                    <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>Present</p>
                                                    <p className={`text-sm font-black ${isDark ? "text-green-400" : "text-green-600"}`}>{item.presentCount}</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>Absent</p>
                                                    <p className={`text-sm font-black ${isDark ? "text-red-400" : "text-red-600"}`}>{item.absentCount}</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>Not Marked</p>
                                                    <p className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>{item.attendance.length - item.presentCount - item.absentCount}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Desktop Table View */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full">
                                        <thead className={isDark ? "bg-[#0d1117]" : "bg-gray-50"}>
                                            <tr>
                                                <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? "text-gray-300" : "text-gray-700"
                                                    }`}>
                                                    Date
                                                </th>
                                                <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? "text-gray-300" : "text-gray-700"
                                                    }`}>
                                                    Session
                                                </th>
                                                <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? "text-gray-300" : "text-gray-700"
                                                    }`}>
                                                    Present
                                                </th>
                                                <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? "text-gray-300" : "text-gray-700"
                                                    }`}>
                                                    Absent
                                                </th>
                                                <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? "text-gray-300" : "text-gray-700"
                                                    }`}>
                                                    Unmarked
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className={`divide-y ${isDark ? "divide-gray-700" : "divide-gray-200"}`}>
                                            {rangeReport.map((item, idx) => (
                                                <tr key={idx} className={`transition-colors ${isDark ? "hover:bg-[#0d1117]" : "hover:bg-gray-50"
                                                    }`}>
                                                    <td className={`px-4 py-3 ${isDark ? "text-gray-300" : "text-gray-900"}`}>
                                                        {new Date(item.date).toLocaleDateString()}
                                                    </td>
                                                    <td className={`px-4 py-3 ${isDark ? "text-gray-300" : "text-gray-900"}`}>
                                                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${item.session === "Morning"
                                                            ? isDark
                                                                ? "bg-yellow-900/30 text-yellow-300"
                                                                : "bg-yellow-100 text-yellow-800"
                                                            : isDark
                                                                ? "bg-purple-900/30 text-purple-300"
                                                                : "bg-purple-100 text-purple-800"
                                                            }`}>
                                                            {item.session}
                                                        </span>
                                                    </td>
                                                    <td className={`px-4 py-3 font-semibold ${isDark ? "text-green-400" : "text-green-600"
                                                        }`}>
                                                        {item.presentCount}
                                                    </td>
                                                    <td className={`px-4 py-3 font-semibold ${isDark ? "text-red-400" : "text-red-600"
                                                        }`}>
                                                        {item.absentCount}
                                                    </td>
                                                    <td className={`px-4 py-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                                                        {item.attendance.length - item.presentCount - item.absentCount}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {viewMode === "studentHistory" && (
                    <div className="space-y-6">
                        {/* Search Inputs */}
                        <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
                            <div className="w-full sm:flex-1">
                                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? "text-gray-500" : "text-gray-500"
                                    }`}>
                                    Student Search
                                </label>
                                <div className="relative">
                                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Name or ID..."
                                        className={`w-full pl-9 pr-4 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 transition-all ${isDark
                                            ? "bg-[#0d1117] border-gray-700 text-white placeholder-gray-600 focus:ring-blue-500/50"
                                            : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-blue-500"
                                            }`}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 w-full sm:w-auto">
                                <div className="flex-1 sm:w-36">
                                    <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? "text-gray-500" : "text-gray-500"
                                        }`}>
                                        Month
                                    </label>
                                    <select
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                        className={`w-full px-4 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 transition-all ${isDark
                                            ? "bg-[#0d1117] border-gray-700 text-white focus:ring-blue-500/50"
                                            : "bg-white border-gray-200 text-gray-900 focus:ring-blue-500"
                                            }`}
                                    >
                                        {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                            <option key={m} value={m}>
                                                {new Date(0, m - 1).toLocaleString('default', { month: 'short' })}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex-1 sm:w-24">
                                    <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? "text-gray-500" : "text-gray-500"
                                        }`}>
                                        Year
                                    </label>
                                    <input
                                        type="number"
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                                        className={`w-full px-4 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 transition-all ${isDark
                                            ? "bg-[#0d1117] border-gray-700 text-white focus:ring-blue-500/50"
                                            : "bg-white border-gray-200 text-gray-900 focus:ring-blue-500"
                                            }`}
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handleStudentSearch}
                                disabled={historyLoading}
                                className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {historyLoading ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                ) : (
                                    <Search className="w-4 h-4" />
                                )}
                                <span>Search</span>
                            </button>
                        </div>

                        {/* Student Details */}
                        {selectedStudent && historyData && (
                            <div className="space-y-6">
                                {/* Student Info Header */}
                                <div className={`rounded-lg p-6 border ${isDark ? "bg-[#0d1117] border-gray-700" : "bg-gray-50 border-gray-200"
                                    }`}>
                                    <div className="flex flex-wrap justify-between items-start gap-4">
                                        <div>
                                            <h3 className={`text-xl font-bold mb-1 ${isDark ? "text-white" : "text-gray-900"
                                                }`}>
                                                {selectedStudent.fullName}
                                            </h3>

                                        </div>
                                        {historyData.summary && (
                                            <div className={`px-4 py-2 rounded-lg font-bold ${historyData.summary.percentage >= 75
                                                ? isDark
                                                    ? "bg-green-900/30 text-green-300"
                                                    : "bg-green-100 text-green-800"
                                                : isDark
                                                    ? "bg-red-900/30 text-red-300"
                                                    : "bg-red-100 text-red-800"
                                                }`}>
                                                {historyData.summary.percentage}% Attendance
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Summary Stats */}
                                {historyData.summary && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className={`rounded-lg p-6 border ${isDark ? "bg-green-900/20 border-green-800" : "bg-green-50 border-green-200"
                                            }`}>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className={`text-sm font-medium ${isDark ? "text-green-300" : "text-green-700"
                                                    }`}>
                                                    Present
                                                </span>
                                                <CheckCircle className={`w-5 h-5 ${isDark ? "text-green-400" : "text-green-600"
                                                    }`} />
                                            </div>
                                            <p className={`text-3xl font-bold ${isDark ? "text-green-400" : "text-green-600"
                                                }`}>
                                                {historyData.summary.present}
                                            </p>
                                        </div>

                                        <div className={`rounded-lg p-6 border ${isDark ? "bg-red-900/20 border-red-800" : "bg-red-50 border-red-200"
                                            }`}>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className={`text-sm font-medium ${isDark ? "text-red-300" : "text-red-700"
                                                    }`}>
                                                    Absent
                                                </span>
                                                <XCircle className={`w-5 h-5 ${isDark ? "text-red-400" : "text-red-600"
                                                    }`} />
                                            </div>
                                            <p className={`text-3xl font-bold ${isDark ? "text-red-400" : "text-red-600"
                                                }`}>
                                                {historyData.summary.absent}
                                            </p>
                                        </div>

                                        <div className={`rounded-lg p-6 border ${isDark ? "bg-gray-700/50 border-gray-600" : "bg-gray-100 border-gray-300"
                                            }`}>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"
                                                    }`}>
                                                    Total Classes
                                                </span>
                                                <Clock className={`w-5 h-5 ${isDark ? "text-gray-400" : "text-gray-600"
                                                    }`} />
                                            </div>
                                            <p className={`text-3xl font-bold ${isDark ? "text-gray-300" : "text-gray-700"
                                                }`}>
                                                {historyData.summary.total}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Attendance History Grid */}
                                <div>
                                    <h4 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"
                                        }`}>
                                        Attendance History
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {historyData.history.map((record: any, idx: number) => {
                                            const isEditing = editingRecord?.date === record.date && editingRecord?.session === record.session;

                                            return (
                                                <div
                                                    key={idx}
                                                    className={`p-5 rounded-2xl border border-gray-100 dark:border-gray-800 transition-all ${record.status === 'Present'
                                                        ? isDark
                                                            ? "bg-green-900/20 border-green-800"
                                                            : "bg-green-50 border-green-200"
                                                        : record.status === 'Absent'
                                                            ? isDark
                                                                ? "bg-red-900/20 border-red-800"
                                                                : "bg-red-50 border-red-200"
                                                            : isDark
                                                                ? "bg-gray-700/30 border-gray-600"
                                                                : "bg-gray-50 border-gray-200"
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <div className={`text-sm font-bold ${isDark ? "text-gray-300" : "text-gray-700"
                                                                }`}>
                                                                {new Date(record.date).toLocaleDateString()}
                                                            </div>
                                                            <div className={`text-[10px] font-black uppercase tracking-widest mt-0.5 ${isDark ? "text-gray-500" : "text-gray-400"
                                                                }`}>
                                                                {record.session} Session
                                                            </div>
                                                        </div>
                                                        {!isEditing && (
                                                            <button
                                                                onClick={() => {
                                                                    setEditingRecord(record);
                                                                    setEditStatus(record.status);
                                                                }}
                                                                className={`p-2 rounded-xl transition-all ${isDark
                                                                    ? "bg-gray-800/50 hover:bg-gray-700 text-gray-400"
                                                                    : "bg-white hover:bg-gray-100 text-gray-500 border border-gray-200"
                                                                    }`}
                                                                title="Edit Attendance"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>

                                                    {isEditing ? (
                                                        <div className="space-y-3">
                                                            <select
                                                                value={editStatus}
                                                                onChange={(e) => setEditStatus(e.target.value)}
                                                                className={`w-full px-3 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 transition-all ${isDark
                                                                    ? "bg-[#0d1117] border-gray-600 text-white focus:ring-blue-500/50"
                                                                    : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
                                                                    }`}
                                                            >
                                                                <option value="Present">Present</option>
                                                                <option value="Absent">Absent</option>
                                                                <option value="Leave">Leave</option>
                                                            </select>
                                                            <div className="flex gap-2 pt-1">
                                                                <button
                                                                    onClick={handleUpdateAttendance}
                                                                    disabled={updateLoading}
                                                                    className="flex-2 px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                                                                >
                                                                    {updateLoading ? "Saving..." : "Save"}
                                                                </button>
                                                                <button
                                                                    onClick={() => setEditingRecord(null)}
                                                                    disabled={updateLoading}
                                                                    className={`flex-1 px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl border transition-all ${isDark
                                                                        ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                                                                        : "border-gray-300 text-gray-700 hover:bg-gray-50 items-center justify-center flex"
                                                                        }`}
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className={`flex items-center gap-2 mt-4 px-3 py-1.5 rounded-lg border w-fit ${record.status === 'Present'
                                                            ? isDark
                                                                ? "bg-green-500/10 border-green-500/20 text-green-400"
                                                                : "bg-green-500/10 border-green-500/20 text-green-700"
                                                            : record.status === 'Absent'
                                                                ? isDark
                                                                    ? "bg-red-500/10 border-red-500/20 text-red-400"
                                                                    : "bg-red-500/10 border-red-500/20 text-red-700"
                                                                : isDark
                                                                    ? "bg-gray-500/10 border-gray-500/20 text-gray-400"
                                                                    : "bg-gray-500/10 border-gray-500/20 text-gray-700"
                                                            }`}>
                                                            {record.status === 'Present' && <CheckCircle className="w-4 h-4" />}
                                                            {record.status === 'Absent' && <XCircle className="w-4 h-4" />}
                                                            {record.status === 'Leave' && <Clock className="w-4 h-4" />}
                                                            <span className="text-[10px] font-black uppercase tracking-widest">{record.status}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AttendanceReportView;