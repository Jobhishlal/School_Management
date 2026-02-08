import React, { useState } from "react";
import { AttendanceCreate } from "../../services/authapi";
import { showToast } from "../../utils/toast";
import { useTheme } from "../../components/layout/ThemeContext";
import { CheckCircle, XCircle, Calendar } from "lucide-react";

type AttendanceStatus = "Present" | "Absent" | "Leave";

interface Student {
  id: string;
  fullName: string;
  classId: string;
}

interface AttendanceItem {
  studentId: string;
  status: AttendanceStatus;
}

interface Props {
  students: Student[];
  teacherId: string;
  session: "Morning" | "Afternoon";
  onSuccess: () => void;
}

const TakeAttendanceForm: React.FC<Props> = ({
  students,
  teacherId,
  session,
  onSuccess,
}) => {
  const { isDark } = useTheme();
  const [attendance, setAttendance] = useState<AttendanceItem[]>([]);
  const [loading, setLoading] = useState(false);

  const markAttendance = (studentId: string, status: AttendanceStatus) => {
    setAttendance(prev => {
      const exists = prev.find(a => a.studentId === studentId);
      return exists
        ? prev.map(a => a.studentId === studentId ? { ...a, status } : a)
        : [...prev, { studentId, status }];
    });
  };

  const handleSubmit = async () => {
    if (attendance.length !== students.length)
      return showToast("Mark all students", "warning");

    try {
      setLoading(true);
      const res = await AttendanceCreate({
        date: new Date(),
        classId: students[0].classId,
        teacherId,
        session,
        attendance,
      });
      console.log("result", res)
      showToast("Attendance submitted", "success");
      setAttendance([]);
      onSuccess();
    } catch (error: any) {
      const message = error?.response?.data?.message || "Attendance submission failed";
      showToast(message, "info");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: AttendanceStatus) => {
    if (status === "Present") return isDark ? "bg-green-900 border-green-600" : "bg-green-50 border-green-500";
    if (status === "Absent") return isDark ? "bg-red-900 border-red-600" : "bg-red-50 border-red-500";
    return isDark ? "bg-yellow-900 border-yellow-600" : "bg-yellow-50 border-yellow-500";
  };

  const markedCount = attendance.length;
  const progress = (markedCount / students.length) * 100;

  return (
    <div className={`rounded-lg border ${isDark ? "bg-[#121A21] border-gray-700" : "bg-white border-gray-200"} shadow-sm`}>
      <div className={`px-6 py-4 border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
              Take Attendance
            </h3>
            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              {session} Session • {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className={`px-4 py-2 rounded-lg ${isDark ? "bg-blue-900/30 text-blue-400" : "bg-blue-50 text-blue-700"}`}>
            <Calendar className="inline-block w-5 h-5 mr-2" />
            {markedCount}/{students.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className={`h-2 rounded-full ${isDark ? "bg-gray-700" : "bg-gray-200"}`}>
            <div
              className="h-2 rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-4 max-h-[500px] overflow-y-auto">
        {students.map((student, index) => {
          const studentAttendance = attendance.find(a => a.studentId === student.id);

          return (
            <div
              key={student.id}
              className={`p-3 md:p-4 rounded-xl border transition-all ${studentAttendance
                ? getStatusColor(studentAttendance.status)
                : isDark ? "bg-gray-800/50 border-gray-700" : "bg-gray-50 border-gray-200"
                }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs font-bold ${isDark ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"
                    }`}>
                    {index + 1}
                  </div>
                  <span className={`font-semibold text-sm md:text-base ${isDark ? "text-white" : "text-gray-900"}`}>
                    {student.fullName}
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:flex gap-2">
                  <button
                    onClick={() => markAttendance(student.id, "Present")}
                    className={`flex flex-col items-center justify-center sm:flex-row px-2 sm:px-4 py-2 rounded-lg text-[10px] sm:text-sm font-bold transition-all ${studentAttendance?.status === "Present"
                      ? "bg-green-600 text-white shadow-lg"
                      : isDark
                        ? "bg-gray-700 text-gray-400 hover:bg-gray-600"
                        : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-300"
                      }`}
                  >
                    <CheckCircle className="w-4 h-4 sm:mr-1.5" />
                    <span className="mt-1 sm:mt-0">Present</span>
                  </button>

                  <button
                    onClick={() => markAttendance(student.id, "Absent")}
                    className={`flex flex-col items-center justify-center sm:flex-row px-2 sm:px-4 py-2 rounded-lg text-[10px] sm:text-sm font-bold transition-all ${studentAttendance?.status === "Absent"
                      ? "bg-red-600 text-white shadow-lg"
                      : isDark
                        ? "bg-gray-700 text-gray-400 hover:bg-gray-600"
                        : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-300"
                      }`}
                  >
                    <XCircle className="w-4 h-4 sm:mr-1.5" />
                    <span className="mt-1 sm:mt-0">Absent</span>
                  </button>

                  <button
                    onClick={() => markAttendance(student.id, "Leave")}
                    className={`flex flex-col items-center justify-center sm:flex-row px-2 sm:px-4 py-2 rounded-lg text-[10px] sm:text-sm font-bold transition-all ${studentAttendance?.status === "Leave"
                      ? "bg-yellow-600 text-white shadow-lg"
                      : isDark
                        ? "bg-gray-700 text-gray-400 hover:bg-gray-600"
                        : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-300"
                      }`}
                  >
                    <Calendar className="w-4 h-4 sm:mr-1.5" />
                    <span className="mt-1 sm:mt-0">Leave</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={`px-6 py-4 border-t ${isDark ? "border-gray-700 bg-[#1a2332]" : "border-gray-200 bg-gray-50"}`}>
        <button
          onClick={handleSubmit}
          disabled={loading || markedCount !== students.length}
          className={`w-full py-3 rounded-lg font-semibold transition-all ${loading || markedCount !== students.length
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 shadow-md"
            } text-white`}
        >
          {loading ? "Submitting..." : "Submit Attendance"}
        </button>
      </div>
    </div>
  );
};

export default TakeAttendanceForm;