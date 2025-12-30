import React, { useEffect, useState } from "react";
import { fetchTodayAttendanceSummary, updateAttendance } from "../../services/authapi";
import { useTheme } from "../../components/layout/ThemeContext";
import { showToast } from "../../utils/toast";
import { Clock, Users, CheckCircle, XCircle, AlertCircle, Sun, Moon } from "lucide-react";

type AttendanceStatus = "Present" | "Absent" | "Leave" | "Not Marked";

export interface TodayAttendanceItem {
  studentId: string;
  studentName: string;
  Morning?: AttendanceStatus;
  Afternoon?: AttendanceStatus;
}

interface Props {
  classId: string;
}

const TodayAttendanceSummary: React.FC<Props> = ({ classId }) => {
  const { isDark } = useTheme();
  const [summary, setSummary] = useState<TodayAttendanceItem[]>([]);
  const [loading, setLoading] = useState(false);

  // edit state
  const [edit, setEdit] = useState<{
    studentId: string;
    session: "Morning" | "Afternoon";
    status: AttendanceStatus;
  } | null>(null);

  const loadSummary = async () => {
    try {
      setLoading(true);
      const data = await fetchTodayAttendanceSummary(classId);
      setSummary(data);
    } catch (error) {
      console.error("Failed to fetch summary", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (classId) loadSummary();
  }, [classId]);


  // ---------- UPDATE HANDLER ----------
  const handleUpdate = async () => {
    if (!edit) return;

    try {
      await updateAttendance(
        edit.studentId,
        new Date(),
        edit.session,
        edit.status === "Not Marked" ? "Absent" : edit.status
      );

      showToast("Attendance updated successfully", "success");
      setEdit(null);
      loadSummary();
    } catch (error: any) {
      showToast(error?.response?.data?.message || "Failed to update attendance", "error");
    }
  };


  const getStatusBadge = (
    status?: AttendanceStatus,
    onEdit?: () => void
  ) => {
    const common =
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium cursor-pointer";

    if (!status || status === "Not Marked") {
      return (
        <span
          className={`${common} ${
            isDark
              ? "bg-gray-700 text-gray-400"
              : "bg-gray-100 text-gray-600"
          }`}
          onClick={onEdit}
        >
          <AlertCircle className="w-3 h-3 mr-1" />
          Not Marked
        </span>
      );
    }

    if (status === "Present") {
      return (
        <span
          className={`${common} ${
            isDark
              ? "bg-green-900/30 text-green-400"
              : "bg-green-100 text-green-800"
          }`}
          onClick={onEdit}
        >
          <CheckCircle className="w-3 h-3 mr-1" />
          Present
        </span>
      );
    }

    if (status === "Absent") {
      return (
        <span
          className={`${common} ${
            isDark
              ? "bg-red-900/30 text-red-400"
              : "bg-red-100 text-red-800"
          }`}
          onClick={onEdit}
        >
          <XCircle className="w-3 h-3 mr-1" />
          Absent
        </span>
      );
    }

    return (
      <span
        className={`${common} ${
          isDark
            ? "bg-yellow-900/30 text-yellow-400"
            : "bg-yellow-100 text-yellow-800"
        }`}
        onClick={onEdit}
      >
        <AlertCircle className="w-3 h-3 mr-1" />
        Leave
      </span>
    );
  };


  const calculateStats = () => {
    let morningPresent = 0;
    let morningAbsent = 0;
    let morningLeave = 0;
    let afternoonPresent = 0;
    let afternoonAbsent = 0;
    let afternoonLeave = 0;

    summary.forEach(item => {
      if (item.Morning === "Present") morningPresent++;
      if (item.Morning === "Absent") morningAbsent++;
      if (item.Morning === "Leave") morningLeave++;
      if (item.Afternoon === "Present") afternoonPresent++;
      if (item.Afternoon === "Absent") afternoonAbsent++;
      if (item.Afternoon === "Leave") afternoonLeave++;
    });

    return {
      morning: { present: morningPresent, absent: morningAbsent, leave: morningLeave },
      afternoon: { present: afternoonPresent, absent: afternoonAbsent, leave: afternoonLeave }
    };
  };


  if (loading) {
    return (
      <div className={`rounded-lg border mt-6 p-8 ${isDark ? "bg-[#1a2332] border-gray-700" : "bg-white border-gray-200"}`}>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const stats = summary.length > 0 ? calculateStats() : null;


  return (
    <div className={`rounded-lg border mt-6 ${isDark ? "bg-[#1a2332] border-gray-700" : "bg-white border-gray-200"} shadow-sm`}>

      {/* HEADER */}
      <div className={`px-6 py-4 border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
        <div className="flex items-center justify-between">
          <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
            <Clock className="inline-block w-5 h-5 mr-2" />
            Today's Attendance Summary
          </h3>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            isDark ? "bg-blue-900/30 text-blue-400" : "bg-blue-100 text-blue-700"
          }`}>
            {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>


      {/* STUDENT TABLE */}
      <div className="p-6">
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full">
            <thead className={isDark ? "bg-gray-800" : "bg-gray-50"}>
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">#</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Student</th>
                <th className="px-6 py-3 text-center text-sm font-semibold">Morning</th>
                <th className="px-6 py-3 text-center text-sm font-semibold">Afternoon</th>
              </tr>
            </thead>

            <tbody>
              {summary.map((s, i) => (
                <tr key={s.studentId} className="border-t">
                  <td className="px-6 py-3">{i + 1}</td>
                  <td className="px-6 py-3 font-medium">{s.studentName}</td>

                  <td className="px-6 py-3 text-center">
                    {getStatusBadge(s.Morning, () =>
                      setEdit({ studentId: s.studentId, session: "Morning", status: s.Morning || "Not Marked" })
                    )}
                  </td>

                  <td className="px-6 py-3 text-center">
                    {getStatusBadge(s.Afternoon, () =>
                      setEdit({ studentId: s.studentId, session: "Afternoon", status: s.Afternoon || "Not Marked" })
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      {/* EDIT MODAL */}
      {edit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className={`p-6 rounded-xl shadow-lg w-96 ${isDark ? "bg-gray-900" : "bg-white"}`}>
            <h4 className="font-semibold mb-3">
              Update {edit.session} Attendance
            </h4>

            <select
              className="border p-2 rounded w-full"
              value={edit.status}
              onChange={e =>
                setEdit({ ...edit, status: e.target.value as AttendanceStatus })
              }
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Leave">Leave</option>
            </select>

            <div className="flex gap-2 mt-4">
              <button
                onClick={handleUpdate}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setEdit(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TodayAttendanceSummary;
