import { useEffect, useState } from "react";
import {
  GetStudentsByTeacher,
} from "../../services/authapi";
import AttendanceReportView from "./AttendanceReportView";
import TodayAttendanceSummary from "./TodayAttendanceSummary";
import TakeAttendanceForm from "./AttendanceCreate";
import { getDecodedToken } from "../../utils/DecodeToken";
import { useTheme } from "../../components/layout/ThemeContext";

import { Calendar, AlertCircle } from "lucide-react";

const AttendanceCreatePage = () => {
  const { isDark } = useTheme();
  const [students, setStudents] = useState<any[]>([]);

  const [session, setSession] = useState<"Morning" | "Afternoon" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const teacherId = getDecodedToken()?.id;

  const getCurrentSession = (): "Morning" | "Afternoon" | null => {
    const hour = new Date().getHours();
    if (hour >= 8 && hour < 12) return "Morning";
    if (hour >= 12 && hour < 24) return "Afternoon";
    return null;
  };



  useEffect(() => {
    const init = async () => {
      try {
        setError(null);
        setLoading(true);
        const detectedSession = getCurrentSession();
        setSession(detectedSession);

        const res = await GetStudentsByTeacher();
        console.log("afkkan", res)


        if (res.success) {
          setStudents(res.students);

        }
      } catch (error: any) {
        console.error(error);
        if (error.response && error.response.status === 404) {
          setError(error.response.data.message || "No class assigned to you yet.");
        } else {
          setError("Something went wrong. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const className = students?.[0]?.classDetails?.className;
  const division = students?.[0]?.classDetails?.division;

  if (loading) {
    return (
      <div className={`min-h-screen p-6 ${isDark ? "bg-[#121A21]" : "bg-gray-50"}`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen p-6 ${isDark ? "bg-[#121A21]" : "bg-gray-50"}`}>
        <div className="max-w-6xl mx-auto">
          <div className={`mb-6 flex items-center gap-3 ${isDark ? "text-white" : "text-gray-900"}`}>
            <Calendar className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Attendance Management</h1>
          </div>

          <div className={`rounded-lg border p-8 text-center ${isDark
            ? "bg-yellow-900/20 border-yellow-800"
            : "bg-yellow-50 border-yellow-200"
            }`}>
            <AlertCircle className={`w-16 h-16 mx-auto mb-4 ${isDark ? "text-yellow-400" : "text-yellow-600"
              }`} />
            <h2 className={`text-xl font-semibold mb-2 ${isDark ? "text-yellow-400" : "text-yellow-800"
              }`}>
              No Class Assigned
            </h2>
            <p className={isDark ? "text-yellow-300" : "text-yellow-700"}>
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 md:p-6 ${isDark ? "bg-[#121A21]" : "bg-gray-50"}`}>
      <div className="max-w-6xl mx-auto space-y-6">

        <div>
          <div className={`flex flex-col sm:flex-row sm:items-center gap-3 mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 md:w-8 md:h-8" />
              <h1 className="text-2xl md:text-3xl font-bold">Attendance</h1>
            </div>
            {className && division && (
              <div className={`text-sm md:text-base font-semibold px-3 py-1 rounded-full ${isDark ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-700"}`}>
                {className} — {division}
              </div>
            )}
          </div>

          <p className={`text-xs md:text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Manage and track student attendance efficiently
          </p>
        </div>


        <div className={`p-4 rounded-xl border ${isDark ? "bg-[#1a2332] border-gray-700" : "bg-white border-gray-200 shadow-sm"}`}>
          <label className={`text-xs md:text-sm font-medium mb-3 block ${isDark ? "text-gray-400" : "text-gray-600 uppercase tracking-wider"}`}>
            Select Current Session
          </label>
          <div className="flex bg-gray-100 p-1.5 rounded-xl dark:bg-gray-800">
            <button
              onClick={() => setSession("Morning")}
              className={`flex-1 py-2 md:py-2.5 text-sm font-semibold rounded-lg transition-all ${session === "Morning"
                ? "bg-white text-blue-600 shadow-md dark:bg-gray-700 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                }`}
            >
              Morning
            </button>
            <button
              onClick={() => setSession("Afternoon")}
              className={`flex-1 py-2 md:py-2.5 text-sm font-semibold rounded-lg transition-all ${session === "Afternoon"
                ? "bg-white text-blue-600 shadow-md dark:bg-gray-700 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                }`}
            >
              Afternoon
            </button>
          </div>
        </div>

        {session && teacherId && students.length > 0 && (
          <div className="mb-6">
            <TakeAttendanceForm
              students={students}
              teacherId={teacherId}
              session={session}
              onSuccess={() => { }}
            />
          </div>
        )}


        {students.length > 0 && (
          <TodayAttendanceSummary classId={students[0].classId} />
        )}

        {students.length > 0 && (
          <AttendanceReportView classId={students[0].classId} students={students} />
        )}
      </div>
    </div>
  );
};

export default AttendanceCreatePage;