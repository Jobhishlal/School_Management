import React, { useEffect, useState } from "react";
import type { AdminDashboardDTO } from "../../types/AdminDashboardDTO";
import { getAdminDashboardStats } from "../../services/dashboardService";
import { useTheme } from "../../components/layout/ThemeContext";
import {
    Users,
    UserCheck,
    GraduationCap,
    School,
    DollarSign,
    TrendingDown,
    TrendingUp,
    AlertCircle,
    Clock,
    Calendar,
    CheckCircle,
    BarChart3,
    RefreshCw,
} from "lucide-react";

const AdminDashboard: React.FC = () => {
    const { isDark } = useTheme();
    const [data, setData] = useState<AdminDashboardDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async (isRefresh = false) => {
        try {
            if (isRefresh) setRefreshing(true);
            const stats = await getAdminDashboardStats();
            setData(stats);
            setError(null);
        } catch (err) {
            setError("Failed to load dashboard data");
            console.error(err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const theme = {
        bg: isDark ? "bg-[#121A21]" : "bg-slate-50",
        textPrimary: isDark ? "text-slate-100" : "text-slate-900",
        textSecondary: isDark ? "text-slate-400" : "text-slate-600",
        cardBg: isDark ? "bg-[#1E293B]" : "bg-white",
        cardBorder: isDark ? "border-slate-700/50" : "border-slate-200",
        iconBg: isDark ? "bg-slate-700/50" : "bg-slate-100",
    };

    if (loading) {
        return (
            <div className={`min-h-screen ${theme.bg} flex items-center justify-center`}>
                <div className="text-center space-y-4">
                    <div className="relative w-20 h-20 mx-auto">
                        <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <p className={`text-lg font-medium ${theme.textPrimary}`}>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className={`min-h-screen ${theme.bg} flex items-center justify-center p-6`}>
                <div className={`${theme.cardBg} rounded-2xl shadow-xl p-8 max-w-md w-full text-center space-y-4 border ${theme.cardBorder}`}>
                    <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto">
                        <AlertCircle className="w-8 h-8 text-rose-600" />
                    </div>
                    <h3 className={`text-xl font-semibold ${theme.textPrimary}`}>Error Loading Data</h3>
                    <p className={`${theme.textSecondary}`}>{error || "No data available"}</p>
                    <button
                        onClick={() => {
                            setLoading(true);
                            fetchData();
                        }}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const totalPending =
        (data.pendingActions?.blockedStudents || 0) +
        (data.pendingActions?.blockedStaff || 0) +
        (data.pendingActions?.leaveRequests || 0) +
        (data.pendingActions?.complaints || 0);

    return (
        <div className={`min-h-screen ${theme.bg}`}>
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className={`text-3xl font-bold ${theme.textPrimary} mb-2`}>Admin Dashboard</h1>
                        <p className={`${theme.textSecondary} flex items-center gap-2`}>
                            <BarChart3 className="w-4 h-4" />
                            Overview of school performance and activities
                        </p>
                    </div>
                    <button
                        onClick={() => fetchData(true)}
                        disabled={refreshing}
                        className={`inline-flex items-center gap-2 px-4 py-2 ${theme.cardBg} border ${theme.cardBorder} rounded-lg font-medium ${theme.textPrimary} hover:opacity-90 transition-all disabled:opacity-50 shadow-sm`}
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                        {refreshing ? "Refreshing..." : "Refresh"}
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        icon={<Users className="w-6 h-6 text-indigo-600" />}
                        label="Total Students"
                        value={data.counts.students}
                        gradient="from-indigo-500 to-indigo-600"
                        bgColor="bg-indigo-50"
                        theme={theme}
                    />
                    <StatCard
                        icon={<GraduationCap className="w-6 h-6 text-emerald-600" />}
                        label="Total Teachers"
                        value={data.counts.teachers}
                        gradient="from-emerald-500 to-emerald-600"
                        bgColor="bg-emerald-50"
                        theme={theme}
                    />
                    <StatCard
                        icon={<UserCheck className="w-6 h-6 text-blue-600" />}
                        label="Sub Admins"
                        value={data.counts.admins}
                        gradient="from-blue-500 to-blue-600"
                        bgColor="bg-blue-50"
                        theme={theme}
                    />
                    <StatCard
                        icon={<School className="w-6 h-6 text-purple-600" />}
                        label="Total Classes"
                        value={data.counts.classes}
                        gradient="from-purple-500 to-purple-600"
                        bgColor="bg-purple-50"
                        theme={theme}
                    />
                </div>

                {/* Financial Overview & Pending Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Financial Overview */}
                    <div className={`${theme.cardBg} rounded-2xl shadow-lg border ${theme.cardBorder} overflow-hidden`}>
                        <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4">
                            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                <DollarSign className="w-5 h-5" />
                                Financial Overview
                            </h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <FinanceCard
                                label="Total Collected"
                                amount={data.finance.totalCollected}
                                type="success"
                                icon={<TrendingUp className="w-5 h-5" />}
                                theme={theme}
                            />
                            <FinanceCard
                                label="Total Expenses"
                                amount={data.finance.totalExpenses}
                                type="danger"
                                icon={<TrendingDown className="w-5 h-5" />}
                                theme={theme}
                            />
                            <FinanceCard
                                label="Pending Fees"
                                amount={data.finance.pendingFees}
                                type="warning"
                                icon={<Clock className="w-5 h-5" />}
                                theme={theme}
                            />
                        </div>
                    </div>

                    {/* Pending Actions */}
                    <div className={`${theme.cardBg} rounded-2xl shadow-lg border ${theme.cardBorder} overflow-hidden`}>
                        <div className="bg-gradient-to-r from-rose-600 to-rose-700 px-6 py-4">
                            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                <AlertCircle className="w-5 h-5" />
                                Pending Actions
                                {totalPending > 0 && (
                                    <span className="ml-auto bg-white text-rose-600 text-sm font-bold px-3 py-1 rounded-full">
                                        {totalPending}
                                    </span>
                                )}
                            </h2>
                        </div>
                        <div className="p-6 space-y-3">
                            {data.pendingActions && (
                                <>
                                    <ActionItem
                                        label="Blocked Students"
                                        count={data.pendingActions.blockedStudents || 0}
                                        icon={<Users className="w-4 h-4" />}
                                        theme={theme}
                                    />
                                    <ActionItem
                                        label="Blocked Staff"
                                        count={data.pendingActions.blockedStaff || 0}
                                        icon={<GraduationCap className="w-4 h-4" />}
                                        theme={theme}
                                    />
                                    <ActionItem
                                        label="Leave Requests"
                                        count={data.pendingActions.leaveRequests || 0}
                                        icon={<Calendar className="w-4 h-4" />}
                                        theme={theme}
                                    />
                                    <ActionItem
                                        label="Complaints"
                                        count={data.pendingActions.complaints || 0}
                                        icon={<AlertCircle className="w-4 h-4" />}
                                        theme={theme}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Attendance & Announcements */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Attendance */}
                    <div className={`${theme.cardBg} rounded-2xl shadow-lg border ${theme.cardBorder} overflow-hidden`}>
                        <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4">
                            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" />
                                Today's Attendance
                            </h2>
                        </div>
                        <div className="p-6 space-y-4">
                            {data.attendance && (
                                <>
                                    <AttendanceBar
                                        label="Students Present"
                                        percentage={data.attendance.studentPercentage}
                                        color="bg-teal-500"
                                        icon={<Users className="w-4 h-4" />}
                                        theme={theme}
                                    />
                                    <AttendanceBar
                                        label="Staff Present"
                                        percentage={data.attendance.staffPercentage}
                                        color="bg-blue-500"
                                        icon={<GraduationCap className="w-4 h-4" />}
                                        theme={theme}
                                    />
                                </>
                            )}
                        </div>
                    </div>

                    {/* Recent Announcements */}
                    <div className={`${theme.cardBg} rounded-2xl shadow-lg border ${theme.cardBorder} overflow-hidden`}>
                        <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-4">
                            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                Recent Announcements
                            </h2>
                        </div>
                        <div className="p-6">
                            {data.recentAnnouncements && data.recentAnnouncements.length > 0 ? (
                                <div className="space-y-3 max-h-64 overflow-y-auto">
                                    {data.recentAnnouncements.map((announcement, index) => (
                                        <div
                                            key={index}
                                            className={`p-4 bg-gradient-to-r ${theme.iconBg} border ${theme.cardBorder} rounded-lg hover:shadow-md transition-shadow`}
                                        >
                                            <h4 className={`font-semibold ${theme.textPrimary} mb-1`}>
                                                {announcement.title}
                                            </h4>
                                            <p className={`text-sm ${theme.textSecondary} mb-2`}>
                                                {announcement.description}
                                            </p>
                                            <div className={`flex items-center gap-2 text-xs ${theme.textSecondary}`}>
                                                <Calendar className="w-3 h-3" />
                                                {new Date(announcement.date).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className={`w-16 h-16 ${theme.iconBg} rounded-full flex items-center justify-center mx-auto mb-3`}>
                                        <Calendar className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <p className={`${theme.textSecondary}`}>No recent announcements</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({
    icon,
    label,
    value,
    gradient,
    bgColor,
    theme
}: {
    icon: React.ReactNode;
    label: string;
    value: number;
    gradient: string;
    bgColor: string;
    theme: any;
}) => (
    <div className={`${theme.cardBg} rounded-2xl shadow-lg border ${theme.cardBorder} overflow-hidden hover:shadow-xl transition-all duration-300 group`}>
        <div className="p-6">
            <div className="flex items-start justify-between mb-4">
                <div className={`${bgColor} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
            </div>
            <h3 className={`text-sm font-medium ${theme.textSecondary} mb-1`}>{label}</h3>
            <p className={`text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                {value.toLocaleString()}
            </p>
        </div>
        <div className={`h-1 bg-gradient-to-r ${gradient}`}></div>
    </div>
);

const FinanceCard = ({
    label,
    amount,
    type,
    icon,
    theme
}: {
    label: string;
    amount: number;
    type: "success" | "warning" | "danger";
    icon: React.ReactNode;
    theme: any;
}) => {
    const colors = {
        success: {
            bg: "bg-emerald-50/50",
            text: "text-emerald-500",
            border: "border-emerald-200/20",
            icon: "text-emerald-500",
        },
        warning: {
            bg: "bg-amber-50/50",
            text: "text-amber-500",
            border: "border-amber-200/20",
            icon: "text-amber-500",
        },
        danger: {
            bg: "bg-rose-50/50",
            text: "text-rose-500",
            border: "border-rose-200/20",
            icon: "text-rose-500",
        },
    };

    const color = colors[type];

    return (
        <div className={`${color.bg} border ${color.border} rounded-xl p-4 hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${theme.textSecondary}`}>{label}</span>
                <div className={color.icon}>{icon}</div>
            </div>
            <p className={`text-2xl font-bold ${color.text}`}>₹{amount.toLocaleString()}</p>
        </div>
    );
};

const ActionItem = ({
    label,
    count,
    icon,
    theme
}: {
    label: string;
    count: number;
    icon: React.ReactNode;
    theme: any;
}) => (
    <div className={`flex items-center justify-between p-4 ${theme.iconBg} rounded-lg hover:opacity-90 transition-colors border ${theme.cardBorder}`}>
        <div className="flex items-center gap-3">
            <div className={`${theme.textSecondary}`}>{icon}</div>
            <span className={`font-medium ${theme.textPrimary}`}>{label}</span>
        </div>
        <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${count > 0
                ? "bg-rose-100 text-rose-700 border border-rose-300"
                : "bg-emerald-100 text-emerald-700 border border-emerald-300"
                }`}
        >
            {count}
        </span>
    </div>
);

const AttendanceBar = ({
    label,
    percentage,
    color,
    icon,
    theme
}: {
    label: string;
    percentage: number;
    color: string;
    icon: React.ReactNode;
    theme: any;
}) => (
    <div>
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
                <div className={`${theme.textSecondary}`}>{icon}</div>
                <span className={`text-sm font-medium ${theme.textSecondary}`}>{label}</span>
            </div>
            <span className={`text-sm font-bold ${theme.textPrimary}`}>{percentage}%</span>
        </div>
        <div className={`w-full ${theme.iconBg} rounded-full h-3 overflow-hidden`}>
            <div
                className={`${color} h-full rounded-full transition-all duration-500 ease-out shadow-sm`}
                style={{ width: `${percentage}%` }}
            ></div>
        </div>
    </div>
);

export default AdminDashboard;