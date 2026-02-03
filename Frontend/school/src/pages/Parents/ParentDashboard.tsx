import { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis
} from 'recharts';
import { useTheme } from '../../components/layout/ThemeContext';
import { getParentDashboardStats } from '../../services/dashboardService';
import type { DashboardStats } from '../../services/dashboardService';

// Custom Tooltip for Recharts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 p-2 rounded-lg shadow-xl">
        <p className="text-slate-200 text-sm font-medium">{`${label}: ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

function ParentDashboard() {
  const { isDark } = useTheme();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getParentDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Theme-based styles
  const cardBg = isDark ? "bg-[#1E293B]" : "bg-white";
  const mainBg = isDark ? "bg-[#121A21]" : "bg-slate-50";
  const textPrimary = isDark ? "text-white" : "text-slate-900";
  const textSecondary = isDark ? "text-slate-400" : "text-slate-600";
  const borderCol = isDark ? "border-slate-700" : "border-slate-200";

  if (loading) {
    return (
      <div className={`min-h-screen ${mainBg} flex items-center justify-center`}>
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className={`min-h-screen ${mainBg} flex items-center justify-center text-slate-400`}>
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${mainBg} text-slate-200 p-6 md:p-8 font-sans`}>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* --- Profile Header --- */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-slate-700 shadow-xl">
              <img
                src={stats.studentProfile.photo || "https://img.freepik.com/free-vector/young-woman-with-glasses-illustration_1308-174361.jpg"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="flex-1 text-center md:text-left space-y-1">
            <h1 className={`text-3xl font-bold ${textPrimary}`}>{stats.studentProfile.name}</h1>
            <div className={`flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1 text-sm ${textSecondary}`}>
              <span>Roll No: <span className="text-slate-300">{stats.studentProfile.rollNo}</span></span>
              <span className="hidden md:inline">|</span>
              <span>Class: <span className="text-slate-300">{stats.studentProfile.className}</span></span>
              <span className="hidden md:inline">|</span>
              <span>Section: <span className="text-slate-300">{stats.studentProfile.section}</span></span>
            </div>
            <div className={`flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1 text-sm ${textSecondary}`}>
              <span>Age : <span className="text-slate-300">{stats.studentProfile.age}</span></span>
              <span className="hidden md:inline">|</span>

            </div>
          </div>
        </div>

        {/* --- Attendance Summary --- */}
        <div className="space-y-4">
          <h2 className={`text-xl font-semibold ${textPrimary}`}>Attendance Summary</h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Classes', value: stats.attendance.totalClasses },
              { label: 'Present', value: stats.attendance.present },
              { label: 'Absent', value: stats.attendance.absent },
              { label: 'Leave', value: stats.attendance.leave },
            ].map((stat, idx) => (
              <div key={idx} className={`${cardBg} border ${borderCol} rounded-xl p-5 flex flex-col justify-between h-28`}>
                <span className={`text-sm font-medium ${textSecondary}`}>{stat.label}</span>
                <span className={`text-3xl font-bold ${textPrimary}`}>{stat.value}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <span className={`text-sm font-medium ${textPrimary}`}>Attendance Percentage</span>
              <span className={`text-sm font-bold ${textSecondary}`}>{stats.attendance.percentage}%</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${Math.min(stats.attendance.percentage, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* --- Exam Overview --- */}
        <div className="space-y-4">
          <h2 className={`text-xl font-semibold ${textPrimary}`}>Exam OverView</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Chart 1: Marks Trend */}
            <div className={`${cardBg} border ${borderCol} rounded-xl p-6 h-80 flex flex-col`}>
              <div className="mb-6">
                <h3 className={`text-sm font-medium ${textSecondary}`}>Current Year Performance</h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className={`text-3xl font-bold ${textPrimary}`}>
                    {stats.examStats.marksTrend.length > 0 ? stats.examStats.marksTrend[stats.examStats.marksTrend.length - 1].value : 0}%
                  </span>
                  <span className="text-xs font-medium text-green-500">Latest</span>
                </div>
              </div>
              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.examStats.marksTrend}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorValue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex justify-between text-xs text-slate-500 px-2">
                <span>Start</span>
                <span>End</span>
              </div>
            </div>

            {/* Chart 2: Subject Comparison */}
            <div className={`${cardBg} border ${borderCol} rounded-xl p-6 h-80 flex flex-col`}>
              <div className="mb-6">
                <h3 className={`text-sm font-medium ${textSecondary}`}>Subject Comparison</h3>
                <div className="flex items-baseline gap-2 mt-1">
                  {/* <span className={`text-3xl font-bold ${textPrimary}`}>92%</span> */}
                </div>
              </div>
              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.examStats.subjectComparison} barSize={40}>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill: 'transparent' }} content={<CustomTooltip />} />
                    <Bar dataKey="value" fill="#334155" radius={[4, 4, 0, 0]}>
                      {
                        stats.examStats.subjectComparison.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3B82F6' : '#334155'} />
                        ))
                      }
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 grid grid-cols-3 text-center text-xs text-slate-500">
                {/* labels handled by chart tooltip generally, or map keys if static names known */}
              </div>
            </div>

            {/* Chart 3: Pass/Fail Ratio */}
            <div className={`${cardBg} border ${borderCol} rounded-xl p-6 h-80 flex flex-col`}>
              <div className="mb-6">
                <h3 className={`text-sm font-medium ${textSecondary}`}>Pass/Fail Ratio</h3>
              </div>
              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.examStats.passFailRatio} barSize={40}>
                    <Tooltip cursor={{ fill: 'transparent' }} content={<CustomTooltip />} />
                    <Bar dataKey="value" fill="#334155" radius={[4, 4, 0, 0]}>
                      {
                        stats.examStats.passFailRatio.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))
                      }
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 grid grid-cols-2 text-center text-xs text-slate-500 px-8">
                <span>Passed</span>
                <span>Failed</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default ParentDashboard;