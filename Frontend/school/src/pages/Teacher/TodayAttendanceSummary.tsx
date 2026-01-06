import React, { useEffect, useState } from "react";
import { fetchTodayAttendanceSummary, updateAttendance } from "../../services/authapi";
import { useTheme } from "../../components/layout/ThemeContext";
import { showToast } from "../../utils/toast";
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
  BarChart3,
  Search,
  ChevronDown,
  Edit
} from "lucide-react";

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
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  // Update State
  const [edit, setEdit] = useState<{
    studentId: string;
    session: "Morning" | "Afternoon";
    status: AttendanceStatus;
  } | null>(null);

  const loadSummary = async () => {
    try {
      setLoading(true);
      const data = await fetchTodayAttendanceSummary(classId, filterStatus);
      setSummary(data);
    } catch (error) {
      console.error("Failed to fetch summary", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (classId) loadSummary();
  }, [classId, filterStatus]);

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

  const calculateStats = () => {
    let present = 0;
    let absent = 0;
    let leave = 0;
    let notMarked = 0;

    summary.forEach((item) => {
      // Counting both sessions for total perspective
      // or you can just split by session if needed
      [item.Morning, item.Afternoon].forEach(status => {
        if (status === "Present") present++;
        else if (status === "Absent") absent++;
        else if (status === "Leave") leave++;
        else notMarked++;
      });
    });

    const total = present + absent + leave + notMarked;
    return { present, absent, leave, notMarked, total };
  };

  const stats = calculateStats();
  const filteredStudents = summary.filter(s =>
    s.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const StatusBadge = ({ status, onClick }: { status?: string, onClick?: () => void }) => {
    const base = "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all duration-200 border";

    const EditIcon = () => <Edit size={12} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />;

    if (status === "Present") {
      return (
        <span onClick={onClick} className={`${base} ${isDark ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20" : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"} group`}>
          <CheckCircle2 size={14} /> Present <EditIcon />
        </span>
      );
    }
    if (status === "Absent") {
      return (
        <span onClick={onClick} className={`${base} ${isDark ? "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20" : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"} group`}>
          <XCircle size={14} /> Absent <EditIcon />
        </span>
      );
    }
    if (status === "Leave") {
      return (
        <span onClick={onClick} className={`${base} ${isDark ? "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20" : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"} group`}>
          <Clock size={14} /> Leave <EditIcon />
        </span>
      );
    }
    return (
      <span onClick={onClick} className={`${base} ${isDark ? "bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700" : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"} group`}>
        <AlertCircle size={14} /> Not Marked <EditIcon />
      </span>
    );
  };

  const StatCard = ({ title, value, icon: Icon, colorClass, borderClass }: any) => (
    <div className={`p-4 rounded-xl border ${isDark ? "bg-[#121A21]" : "bg-white border-gray-100"} flex items-center justify-between shadow-sm`}>
      <div>
        <p className={`text-sm font-medium ${isDark ? "text-zinc-400" : "text-gray-500"}`}>{title}</p>
        <h4 className={`text-2xl font-bold mt-1 ${isDark ? "text-white" : "text-gray-900"}`}>{value}</h4>
      </div>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
        <Icon size={20} className={borderClass} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Present"
          value={stats.present}
          icon={CheckCircle2}
          colorClass={isDark ? "bg-emerald-500/10" : "bg-emerald-50"}
          borderClass={isDark ? "text-emerald-400" : "text-emerald-600"}
        />
        <StatCard
          title="Absent"
          value={stats.absent}
          icon={XCircle}
          colorClass={isDark ? "bg-rose-500/10" : "bg-rose-50"}
          borderClass={isDark ? "text-rose-400" : "text-rose-600"}
        />
        <StatCard
          title="On Leave"
          value={stats.leave}
          icon={Clock}
          colorClass={isDark ? "bg-amber-500/10" : "bg-amber-50"}
          borderClass={isDark ? "text-amber-400" : "text-amber-600"}
        />
        <StatCard
          title="Total Sessions"
          value={stats.total}
          icon={BarChart3}
          colorClass={isDark ? "bg-blue-500/10" : "bg-blue-50"}
          borderClass={isDark ? "text-blue-400" : "text-blue-600"}
        />
      </div>

      <div className={`rounded-xl border shadow-sm overflow-hidden ${isDark ? "bg-[#121A21]" : "bg-white border-gray-200"}`}>

        {/* HEADER TOOLBAR */}
        <div className={`p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isDark ? "border-zinc-800" : "border-gray-100"}`}>
          <div className="flex items-center gap-2">
            <h3 className={`font-semibold text-lg ${isDark ? "text-white" : "text-gray-900"}`}>Attendance Log</h3>
            <span className={`text-xs px-2 py-1 rounded-md ${isDark ? "bg-zinc-800 text-zinc-400" : "bg-gray-100 text-gray-500"}`}>
              {new Date().toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-zinc-500" : "text-gray-400"}`} />
              <input
                type="text"
                placeholder="Search student..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-9 pr-4 py-2 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 outline-none transition-all w-full sm:w-64 ${isDark
                  ? "bg-zinc-800 border-zinc-700 text-white placeholder:text-white-600 focus:border-blue-500/50"
                  : "bg-gray-50 border-gray-200 text-white-900 placeholder:text-gray-400 focus:border-blue-500"
                  }`}
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <select
                className={`appearance-none pl-9 pr-8 py-2 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/20 outline-none cursor-pointer transition-all ${isDark
                  ? "bg-zinc-800 border-zinc-700 text-white focus:border-blue-500/50"
                  : "bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500"
                  }`}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Leave">Leave</option>
              </select>
              <Filter className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-zinc-500" : "text-gray-400"}`} />
              <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-zinc-500" : "text-gray-400"}`} />
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b text-xs uppercase tracking-wider ${isDark ? "border-zinc-800 bg-zinc-900/50 text-zinc-400" : "border-gray-100 bg-gray-50/50 text-gray-500"}`}>
                  <th className="px-6 py-4 font-medium w-16">#</th>
                  <th className="px-6 py-4 font-medium">Student Name</th>
                  <th className="px-6 py-4 font-medium text-center">Morning Session</th>
                  <th className="px-6 py-4 font-medium text-center">Afternoon Session</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? "divide-zinc-800" : "divide-gray-100"}`}>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((s, i) => (
                    <tr key={s.studentId} className={`group transition-colors ${isDark ? "hover:bg-zinc-800/50" : "hover:bg-gray-50/80"}`}>
                      <td className={`px-6 py-4 text-sm ${isDark ? "text-zinc-500" : "text-gray-400"}`}>
                        {String(i + 1).padStart(2, '0')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isDark ? "bg-blue-500/10 text-blue-400" : "bg-blue-100 text-blue-700"
                            }`}>
                            {s.studentName.charAt(0)}
                          </div>
                          <span className={`font-medium ${isDark ? "text-zinc-200" : "text-gray-700"}`}>
                            {s.studentName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusBadge
                          status={s.Morning}
                          onClick={() => setEdit({ studentId: s.studentId, session: "Morning", status: s.Morning || "Not Marked" })}
                        />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusBadge
                          status={s.Afternoon}
                          onClick={() => setEdit({ studentId: s.studentId, session: "Afternoon", status: s.Afternoon || "Not Marked" })}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className={`flex flex-col items-center gap-2 ${isDark ? "text-zinc-500" : "text-gray-400"}`}>
                        <Search size={32} strokeWidth={1.5} />
                        <p className="text-sm">No students found matching your search</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* EDIT MODAL */}
      {edit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`w-full max-w-sm rounded-2xl shadow-2xl p-6 transform transition-all scale-100 ${isDark ? "bg-zinc-900 border border-zinc-800" : "bg-white"}`}>
            <h4 className={`text-lg font-semibold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>Update Status</h4>
            <p className={`text-sm mb-6 ${isDark ? "text-zinc-400" : "text-gray-500"}`}>
              Change attendance for <span className="font-medium text-blue-500">{edit.session}</span> session
            </p>

            <div className="space-y-3">
              {["Present", "Absent", "Leave"].map((status) => (
                <button
                  key={status}
                  onClick={() => setEdit({ ...edit, status: status as AttendanceStatus })}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${edit.status === status
                    ? "border-blue-500 bg-blue-500/10 text-blue-500 ring-1 ring-blue-500"
                    : isDark
                      ? "border-zinc-800 hover:bg-zinc-800 text-zinc-300"
                      : "border-gray-200 hover:bg-gray-50 text-gray-700"
                    }`}
                >
                  <span className="font-medium">{status}</span>
                  {edit.status === status && <CheckCircle2 size={16} />}
                </button>
              ))}
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setEdit(null)}
                className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-colors ${isDark
                  ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="flex-1 py-2.5 rounded-lg font-medium text-sm bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodayAttendanceSummary;
