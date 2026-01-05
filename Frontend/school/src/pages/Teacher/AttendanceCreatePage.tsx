import React, { useEffect, useState } from "react";
import {
  GetStudentsByTeacher,
  fetchTodayAttendanceSummary
} from "../../services/authapi";
import AttendanceReportView from "./AttendanceReportView";
import TodayAttendanceSummary from "./TodayAttendanceSummary";
import TakeAttendanceForm from "./AttendanceCreate";
import { getDecodedToken } from "../../utils/DecodeToken";
import { useTheme } from "../../components/layout/ThemeContext";
import type { TodayAttendanceItem } from "./TodayAttendanceSummary";
import { Calendar, AlertCircle } from "lucide-react";

const AttendanceCreatePage = () => {
  const { isDark } = useTheme();
  const [students, setStudents] = useState<any[]>([]);
  const [summary, setSummary] = useState<TodayAttendanceItem[]>([]);
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

  const loadSummary = async (classId: string) => {
    try {
      const res = await fetchTodayAttendanceSummary(classId);
      setSummary(res.attendance?.attendance || []);
    } catch (err) {
      console.error("Failed to load summary", err);
    }
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
          if (res.students.length > 0) {
            loadSummary(res.students[0].classId);
          }
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
    <div className={`min-h-screen p-6 ${isDark ? "bg-[#121A21]" : "bg-gray-50"}`}>
      <div className="max-w-6xl mx-auto">

        <div className="mb-6">
          <div className={`flex items-center gap-3 mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
            <Calendar className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Attendance Management</h1>
          </div>

          {className && division && (
            <p className={`text-base font-semibold ${isDark ? "text-gray-300" : "text-gray-800"}`}>
              Class: {className} — Division: {division}
            </p>
          )}

          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Manage and track student attendance efficiently
          </p>
        </div>


        <div className="flex items-center gap-4 mb-6">
          <div className={`p-4 rounded-xl border flex-1 ${isDark ? "bg-[#1a2332] border-gray-700" : "bg-white border-gray-200"}`}>
            <label className={`text-sm font-medium mb-2 block ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Select Session
            </label>
            <div className="flex bg-gray-100 p-1 rounded-lg dark:bg-gray-800">
              <button
                onClick={() => setSession("Morning")}
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${session === "Morning"
                  ? "bg-white text-blue-600 shadow-sm dark:bg-gray-700 dark:text-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                  }`}
              >
                Morning
              </button>
              <button
                onClick={() => setSession("Afternoon")}
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${session === "Afternoon"
                  ? "bg-white text-blue-600 shadow-sm dark:bg-gray-700 dark:text-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                  }`}
              >
                Afternoon
              </button>
            </div>
          </div>
        </div>

        {session && teacherId && students.length > 0 && (
          <div className="mb-6">
            <TakeAttendanceForm
              students={students}
              teacherId={teacherId}
              session={session}
              onSuccess={() => loadSummary(students[0].classId)}
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