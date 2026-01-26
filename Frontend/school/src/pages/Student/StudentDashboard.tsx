import { useEffect, useState } from 'react';
import { getStudentDashboard } from '../../services/StudentDashboardService';
import { useTheme } from '../../components/layout/ThemeContext';
import { Calendar, FileText, Bell, Percent, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function StudentDashboard() {
  const { isDark } = useTheme();
  const [data, setData] = useState<import('../../services/StudentDashboardService').DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getStudentDashboard();
        console.log("result", result)
        setData(result);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 ${isDark ? 'bg-[#121A21] text-slate-100' : 'bg-[#fafbfc] text-slate-900'}`}>
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Student Dashboard
          </h1>
          <p className={`mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Welcome back! Here's your overview for today.
          </p>
        </div>
        <div className={`text-right ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <h2 className="text-2xl font-mono font-bold tracking-wide">
            {formatTime(currentTime)}
          </h2>
          <p className="text-sm font-medium opacity-80 uppercase tracking-wider">
            {formatDate(currentTime)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Attendance Card */}
        <div className={`p-6 rounded-2xl shadow-sm transition-all hover:shadow-md border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-100'}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg dark:bg-blue-900/30 dark:text-blue-400">
                <Percent size={20} />
              </div>
              Attendance
            </h2>
            <span className={`text-2xl font-bold ${(data?.attendancePercentage || 0) >= 75 ? 'text-green-500' : 'text-amber-500'}`}>
              {data?.attendancePercentage ?? 0}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5 dark:bg-slate-700">
            <div
              className={`h-2.5 rounded-full ${(data?.attendancePercentage || 0) >= 75 ? 'bg-green-500' : 'bg-amber-500'}`}
              style={{ width: `${data?.attendancePercentage ?? 0}%` }}
            ></div>
          </div>
          <p className={`mt-4 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {(data?.attendancePercentage || 0) >= 75
              ? "Great job! Keep it up."
              : "Attendance is low. Please attend more classes."}
          </p>
        </div>

        {/* Today's Classes */}
        <div className={`p-6 rounded-2xl shadow-sm transition-all hover:shadow-md border col-span-1 md:col-span-2 lg:col-span-2 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-100'}`}>
          <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg dark:bg-purple-900/30 dark:text-purple-400">
              <Calendar size={20} />
            </div>
            Today's Schedule
          </h2>
          {data?.todayClasses && data.todayClasses.length > 0 ? (
            <div className="space-y-3">
              {data.todayClasses.map((period, idx) => (
                <div key={idx} className={`p-3 rounded-xl flex items-center justify-between border ${isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg text-center min-w-[80px] ${isDark ? 'bg-slate-800 text-slate-200' : 'bg-white text-slate-700 shadow-sm'}`}>
                      <span className="block text-xs font-bold text-slate-400">START</span>
                      <span className="font-mono font-semibold">{period.startTime || '--:--'}</span>
                    </div>
                    <div>
                      <h3 className="font-bold">{period.subject || 'Subject'}</h3>
                      {/* Ideally teacher name would be populated but DTO only sends ID for now based on entity structure. */}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600'}`}>
                    In Class
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <p>No classes scheduled for today.</p>
            </div>
          )}
        </div>

        {/* Pending Assignments */}
        <div className={`p-6 rounded-2xl shadow-sm transition-all hover:shadow-md border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-100'}`}>
          <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg dark:bg-orange-900/30 dark:text-orange-400">
              <FileText size={20} />
            </div>
            Pending Assignments
          </h2>
          {data?.pendingAssignments && data.pendingAssignments.length > 0 ? (
            <div className="space-y-3">
              {data.pendingAssignments.slice(0, 3).map((assign, idx) => (
                <div key={idx} className={`p-3 rounded-xl border ${isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'}`}>
                  <h3 className="font-medium truncate">{assign.Assignment_Title || 'Untitled Assignment'}</h3>
                  <div className="flex justify-between items-center mt-2 text-xs text-slate-500">
                    <span>Due: {assign.Assignment_Due_Date ? new Date(assign.Assignment_Due_Date).toLocaleDateString() : 'N/A'}</span>
                    <span className="text-orange-500 font-medium">Pending</span>
                  </div>
                </div>
              ))}
              {data.pendingAssignments.length > 3 && (
                <button onClick={() => navigate('/student/assignments')} className="w-full text-center text-sm text-blue-500 hover:underline mt-2">
                  View all ({data.pendingAssignments.length})
                </button>
              )}
            </div>
          ) : (
            <p className="text-slate-500 text-sm">No pending assignments!</p>
          )}
        </div>

        {/* Upcoming Exams */}
        <div className={`p-6 rounded-2xl shadow-sm transition-all hover:shadow-md border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-100'}`}>
          <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg dark:bg-red-900/30 dark:text-red-400">
              <Clock size={20} />
            </div>
            Upcoming Exams
          </h2>
          {data?.upcomingExams && data.upcomingExams.length > 0 ? (
            <div className="space-y-3">
              {data.upcomingExams.slice(0, 3).map((exam, idx) => (
                <div key={idx} className={`p-3 rounded-xl border ${isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'}`}>
                  <h3 className="font-medium truncate">{exam.title} - {exam.subject}</h3>
                  <div className="flex justify-between items-center mt-2 text-xs text-slate-500">
                    <span>Date: {exam.examDate ? new Date(exam.examDate).toLocaleDateString() : 'N/A'}</span>
                    <span className="text-blue-500 font-medium">{exam.startTime || 'Time'}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-sm">No upcoming exams.</p>
          )}
        </div>

        {/* Announcements */}
        <div className={`p-6 rounded-2xl shadow-sm transition-all hover:shadow-md border col-span-1 md:col-span-2 lg:col-span-3 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-100'}`}>
          <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
            <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg dark:bg-yellow-900/30 dark:text-yellow-400">
              <Bell size={20} />
            </div>
            Recent Announcements
          </h2>
          {data?.announcements && data.announcements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.announcements.slice(0, 4).map((ann, idx) => (
                <div key={idx} className={`p-4 rounded-xl border flex flex-col ${isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-md">{ann.title}</h3>
                    <span className="text-xs px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {ann.activeTime ? new Date(ann.activeTime).toLocaleDateString() : 'Date N/A'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-3">{ann.content}</p>
                  <div className="mt-auto">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${ann.scope === 'GLOBAL' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' :
                      'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
                      }`}>
                      {ann.scope}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-sm">No recent announcements.</p>
          )}
        </div>

      </div>
    </div>
  );
}