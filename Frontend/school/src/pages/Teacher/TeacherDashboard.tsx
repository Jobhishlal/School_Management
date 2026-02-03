import React, { useEffect, useState } from 'react';
import { getTeacherDashboardStats, type TeacherDashboardDTO } from '../../services/dashboardService';
import { BookOpen, ClipboardList } from 'lucide-react';
import { useTheme } from '../../components/layout/ThemeContext';

const TeacherDashboard: React.FC = () => {
  const { isDark } = useTheme();
  const [stats, setStats] = useState<TeacherDashboardDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getTeacherDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const theme = {
    bg: isDark ? "bg-[#121A21]" : "bg-slate-50",
    textPrimary: isDark ? "text-slate-100" : "text-slate-900",
    textSecondary: isDark ? "text-slate-400" : "text-slate-600",
    cardBg: isDark ? "bg-[#1E293B]" : "bg-white", // Adjusted card bg for contrast against #121A21 or slate-50
    cardBorder: isDark ? "border-slate-700/50" : "border-slate-200",
    iconBg: isDark ? "bg-slate-700/50" : "bg-slate-100",
  };

  if (loading) return <div className={`p-8 ${theme.textPrimary}`}>Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  if (!stats) return null;

  return (
    <div className={`p-6 min-h-screen ${theme.bg} ${theme.textPrimary}`}>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Quick Overview */}
      <div className="mb-8">
        <h2 className={`text-lg font-semibold mb-4 ${theme.textSecondary}`}>Quick Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`${theme.cardBg} p-4 rounded-lg border ${theme.cardBorder}`}>
            <div className={`${theme.textSecondary} text-sm mb-1`}>Total Class Students</div>
            <div className="text-3xl font-bold">{stats.totalClassStudents}</div>
          </div>
          <div className={`${theme.cardBg} p-4 rounded-lg border ${theme.cardBorder}`}>
            <div className={`${theme.textSecondary} text-sm mb-1`}>Total School Students</div>
            <div className="text-3xl font-bold">{stats.totalSchoolStudents}</div>
          </div>
          <div className={`${theme.cardBg} p-4 rounded-lg border ${theme.cardBorder}`}>
            <div className={`${theme.textSecondary} text-sm mb-1`}>Active Assignments</div>
            <div className="text-3xl font-bold">{stats.activeAssignmentCount}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Schedule */}
        <div>
          <h2 className={`text-lg font-semibold mb-4 ${theme.textSecondary}`}>Today's Schedule</h2>
          <div className="space-y-3">
            {stats.todaysSchedule && stats.todaysSchedule.length > 0 ? (
              stats.todaysSchedule.filter(s => s.type !== 'break' && s.type !== 'rest').map((item, index) => (
                <div key={index} className={`flex items-center ${theme.cardBg} p-4 rounded-lg border ${theme.cardBorder}`}>
                  <div className={`${theme.iconBg} p-2 rounded mr-4`}>
                    <BookOpen size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <div className="font-semibold">{item.subject}</div>
                    <div className={`text-sm ${theme.textSecondary}`}>
                      {item.startTime} - {item.endTime} {item.className && `| ${item.className} ${item.division}`}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className={`${theme.textSecondary}`}>No classes scheduled for today.</div>
            )}
          </div>
        </div>

        {/* Upcoming Exams */}
        <div>
          <h2 className={`text-lg font-semibold mb-4 ${theme.textSecondary}`}>Upcoming Exams</h2>
          <div className="space-y-3">
            {stats.upcomingExams && stats.upcomingExams.length > 0 ? (
              stats.upcomingExams.map((exam, index) => (
                <div key={index} className={`flex items-center ${theme.cardBg} p-4 rounded-lg border ${theme.cardBorder}`}>
                  <div className={`${theme.iconBg} p-2 rounded mr-4`}>
                    <ClipboardList size={20} className="text-purple-400" />
                  </div>
                  <div>
                    <div className="font-semibold">{exam.subject} Exam</div>
                    <div className={`text-sm ${theme.textSecondary}`}>
                      {new Date(exam.examDate).toLocaleDateString()} | {exam.startTime} - {exam.endTime}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className={`${theme.textSecondary}`}>No upcoming exams.</div>
            )}
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="mt-8">
        <h2 className={`text-lg font-semibold mb-4 ${theme.textSecondary}`}>Best performers in my class</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.topStudents && stats.topStudents.length > 0 ? (
            stats.topStudents.map((student, index) => (
              <div key={index} className={`flex items-center ${theme.cardBg} p-4 rounded-lg border ${theme.cardBorder}`}>
                <div className="mr-4">
                  {student.photoUrl ? (
                    <img src={student.photoUrl} alt={student.fullName} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className={`w-12 h-12 rounded-full ${theme.iconBg} flex items-center justify-center text-xl font-bold`}>
                      {student.fullName.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-semibold">{student.fullName}</div>
                  <div className={`text-sm ${theme.textSecondary}`}>{student.className}</div>
                  <div className="text-xs text-green-400 font-semibold">{student.avgMarks}% Avg</div>
                </div>
              </div>
            ))
          ) : (
            <div className={`${theme.textSecondary}`}>No performance data available.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;