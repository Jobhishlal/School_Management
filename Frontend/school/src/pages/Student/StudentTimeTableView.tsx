import React, { useEffect, useState } from "react";
import { StudentProfile, TimeTableview } from "../../services/Student/StudentApi";
import { useTheme } from "../../components/layout/ThemeContext";
import { Loader2, Calendar, Clock, User } from "lucide-react";

interface Period {
  startTime: string;
  endTime: string;
  subject: string;
  teacherId?: string;
}

interface DaySchedule {
  day: string;
  periods: Period[];
}

interface TimeTable {
  classId: {
    _id: string;
    className: string;
    division: string;
  };
  days: DaySchedule[];
}

interface Student {
  _id: string;
  fullName: string;
  classId: string;
  classDetails?: {
    className: string;
    division: string;
  };
}

const DAYS_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const StudentTimeTableView: React.FC = () => {
  const { isDark } = useTheme();
  const [timetable, setTimetable] = useState<TimeTable | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helpers for styling
  const bgPrimary = isDark ? "bg-[#121A21]" : "bg-slate-50";
  const cardBg = isDark ? "bg-slate-800/50" : "bg-white";
  const textPrimary = isDark ? "text-slate-100" : "text-slate-900";
  const textSecondary = isDark ? "text-slate-400" : "text-slate-600";
  const border = isDark ? "border-slate-700" : "border-slate-200";
  const headerBg = isDark ? "bg-slate-900/80" : "bg-slate-100/80";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await StudentProfile();
        const studentData = profileRes?.data?.data;
        const studentId = studentData?.id || studentData?._id;

        if (!studentId) {
          setError("Student profile not found.");
          setLoading(false);
          return;
        }

        const res = await TimeTableview(studentId);
        if (res?.success && res.data) {
          setTimetable(res.data);
        } else {
          setError("Timetable not available.");
        }
      } catch (err: any) {
        console.error("Error fetching timetable", err);
        setError(err.message || "Failed to load timetable.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className={`flex h-screen items-center justify-center ${bgPrimary}`}>
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !timetable) {
    return (
      <div className={`flex h-screen flex-col items-center justify-center text-center ${bgPrimary} ${textSecondary}`}>
        <Calendar size={48} className="mb-4 text-slate-400" />
        <h2 className={`text-xl font-semibold ${textPrimary}`}>No Timetable Found</h2>
        <p>{error || "Please check back later."}</p>
      </div>
    );
  }

  // Prepare Grid Data
  // We need to know the max number of periods to generate rows.
  const maxPeriods = Math.max(...timetable.days.map(d => d.periods.length), 0);
  const periodsArray = Array.from({ length: maxPeriods }, (_, i) => i);

  // Sort days according to DAYS_ORDER
  const sortedDays = DAYS_ORDER.map(day => {
    const schedule = timetable.days.find(d => d.day === day);
    return {
      dayName: day,
      periods: schedule?.periods || []
    };
  });

  return (
    <div className={`min-h-screen p-6 ${bgPrimary}`}>
      <div className="mb-8">
        <h1 className={`text-2xl font-bold ${textPrimary}`}>Class Timetable</h1>
        <p className={textSecondary}>
          {timetable.classId?.className} - {timetable.classId?.division}
        </p>
      </div>

      <div className={`overflow-hidden rounded-xl border ${border} ${cardBg} shadow-sm`}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className={`${headerBg} text-left`}>
                <th className={`border-b border-r ${border} p-4 font-semibold ${textPrimary} min-w-[100px]`}>
                  Period
                </th>
                {sortedDays.map(d => (
                  <th key={d.dayName} className={`border-b ${border} p-4 font-semibold ${textPrimary} min-w-[180px]`}>
                    {d.dayName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {periodsArray.map((periodIndex) => (
                <tr key={periodIndex} className={isDark ? "hover:bg-slate-700/20" : "hover:bg-slate-50"}>
                  <td className={`border-r ${border} p-4 text-center font-medium ${textSecondary}`}>
                    <div className="flex flex-col items-center justify-center gap-1">
                      <span className={`text-lg font-bold ${textPrimary}`}>{periodIndex + 1}</span>
                      {/* Optional: Show time if consistent across days? 
                                                Since time can vary, we might show it inside the cell or check consistency. 
                                                For now, let's just show index.
                                            */}
                    </div>
                  </td>
                  {sortedDays.map((day) => {
                    const period = day.periods[periodIndex];
                    return (
                      <td key={`${day.dayName}-${periodIndex}`} className={`p-2 border-l ${border} align-top`}>
                        {period ? (
                          <div className={`h-full w-full rounded-lg p-3 ${isDark ? "bg-slate-700/40" : "bg-blue-50/50"} border border-transparent hover:border-blue-500/30 transition-colors`}>
                            <div className={`font-semibold ${textPrimary} mb-1`}>
                              {period.subject}
                            </div>
                            <div className="flex flex-col gap-1 text-xs text-slate-500">
                              <div className="flex items-center gap-1.5">
                                <Clock size={12} />
                                <span>{period.startTime} - {period.endTime}</span>
                              </div>
                              {period.teacherId && (
                                <div className="flex items-center gap-1.5">
                                  <User size={12} />
                                  <span>{period.teacherId}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="flex h-full min-h-[80px] items-center justify-center text-slate-500/30">
                            -
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {periodsArray.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No schedule available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentTimeTableView;