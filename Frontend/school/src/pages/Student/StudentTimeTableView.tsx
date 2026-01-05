import React, { useEffect, useState } from "react";
import { StudentProfile, TimeTableview } from "../../services/Student/StudentApi";
import { useTheme } from "../../components/layout/ThemeContext";
import { Loader2, Calendar, Clock, User, BookOpen, Coffee } from "lucide-react";

interface Period {
  startTime: string;
  endTime: string;
  subject: string;
  teacherId?: string;
}

interface Break {
  startTime: string;
  endTime: string;
  name?: string;
}

interface DaySchedule {
  day: string;
  periods: Period[];
  breaks?: Break[];
}

interface TimeTable {
  classId: {
    _id: string;
    className: string;
    division: string;
  };
  days: DaySchedule[];
}

const DAYS_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const StudentTimeTableView: React.FC = () => {
  const { isDark } = useTheme();
  const [timetable, setTimetable] = useState<TimeTable | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 900);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Helpers for styling
  const bgPrimary = isDark ? "bg-[#121A21]" : "bg-slate-50";
  const cardBg = isDark ? "bg-slate-800/50" : "bg-white";
  const textPrimary = isDark ? "text-slate-100" : "text-slate-900";
  const textSecondary = isDark ? "text-slate-400" : "text-slate-600";
  const border = isDark ? "border-slate-700" : "border-slate-200";
  const headerBg = isDark ? "bg-slate-900/80" : "bg-gradient-to-r from-blue-500 to-indigo-600";

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
        console.log("Full Timetable API Response:", res);

        if (res?.success && res.data) {
          console.log("Timetable Data Days:", res.data.days);
          res.data.days.forEach((d: any, i: number) => {
            console.log(`Day ${i} breaks:`, d.breaks);
          });
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
      <div className={`min-h-screen ${bgPrimary} flex items-center justify-center p-4`}>
        <div className={`${cardBg} rounded-xl shadow-lg p-8 border ${border}`}>
          <Loader2 className="w-10 h-10 animate-spin text-blue-500 mx-auto mb-3" />
          <p className={`${textSecondary} text-sm`}>Loading your timetable...</p>
        </div>
      </div>
    );
  }

  if (error || !timetable) {
    return (
      <div className={`min-h-screen ${bgPrimary} flex items-center justify-center p-4`}>
        <div className={`${cardBg} rounded-xl shadow-lg p-8 border ${border} max-w-md text-center`}>
          <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className={`${textPrimary} text-lg font-semibold mb-2`}>No Timetable Found</h3>
          <p className={`${textSecondary} text-sm`}>{error || "Please check back later."}</p>
        </div>
      </div>
    );
  }

  // Pre-process days to merge periods and breaks
  const processedDays = DAYS_ORDER.map(day => {
    const schedule = timetable.days.find(d => d.day === day);
    const periods = (schedule?.periods || []).map(p => ({ ...p, type: 'period' as const }));
    const breaks = (schedule?.breaks || []).map(b => ({
      ...b,
      subject: b.name || "Break",
      type: 'break' as const
    }));

    // Inject Lunch Break if a period ends at 12:00 and no explicit break exists at 12:00
    const hasPeriodEndingAt12 = periods.some(p => {
      const [h, m] = p.endTime.split(':').map(Number);
      return h === 12 && (m === 0 || isNaN(m));
    });

    const hasExplicitBreakAt12 = breaks.some(b => {
      const [h, m] = b.startTime.split(':').map(Number);
      return h === 12 && (m === 0 || isNaN(m));
    });

    if (hasPeriodEndingAt12 && !hasExplicitBreakAt12) {
      breaks.push({
        startTime: "12:00",
        endTime: "13:00",
        subject: "Lunch Break",
        type: 'break' as const,
        name: "Lunch Break"
      });
    }

    const allEvents = [...periods, ...breaks].sort((a, b) => {
      const timeA = parseInt(a.startTime.replace(':', ''));
      const timeB = parseInt(b.startTime.replace(':', ''));
      return timeA - timeB;
    });

    return { dayName: day, events: allEvents };
  });

  // Calculate max rows needed
  const maxEvents = Math.max(...processedDays.map(d => d.events.length), 0);
  const rowsArray = Array.from({ length: maxEvents }, (_, i) => i);

  return (
    <div className={`min-h-screen ${bgPrimary} p-4 md:p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Compact Header */}
        <div className={`${headerBg} rounded-xl shadow-lg p-4 mb-4 border border-white/20`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white text-xl font-bold">Class Timetable</h1>
              <p className="text-white/90 text-sm">
                {timetable.classId?.className} - {timetable.classId?.division}
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Card View */}
        {isMobile ? (
          <div className="space-y-4">
            {processedDays.map((day) => (
              <div key={day.dayName} className={`${cardBg} rounded-xl shadow-lg border ${border} overflow-hidden`}>
                <div className={`${isDark ? 'bg-slate-900/50' : 'bg-slate-100'} px-4 py-3 border-b ${border}`}>
                  <h3 className={`${textPrimary} font-semibold text-sm uppercase flex items-center gap-2`}>
                    <Calendar className="w-4 h-4" />
                    {day.dayName}
                  </h3>
                </div>
                <div className="p-3 space-y-3">
                  {day.events.length > 0 ? (
                    day.events.map((event, index) => {
                      const isBreak = event?.type === 'break';
                      return (
                        <div
                          key={index}
                          className={`
                            rounded-lg p-3 transition-all
                            ${isBreak
                              ? isDark 
                                ? 'bg-amber-900/20 border border-amber-700/30' 
                                : 'bg-amber-50 border border-amber-200'
                              : isDark
                                ? 'bg-blue-900/20 border border-blue-700/30'
                                : 'bg-blue-50 border border-blue-200'
                            }
                          `}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <div className={`
                                w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0
                                ${isBreak ? 'bg-amber-500' : 'bg-blue-500'}
                              `}>
                                {isBreak ? (
                                  <Coffee className="w-3.5 h-3.5 text-white" />
                                ) : (
                                  <BookOpen className="w-3.5 h-3.5 text-white" />
                                )}
                              </div>
                              <h4 className={`${textPrimary} font-semibold text-sm`}>
                                {event.subject}
                              </h4>
                            </div>
                            <span className={`${textSecondary} text-xs font-medium px-2 py-1 rounded ${isDark ? 'bg-slate-700' : 'bg-white'}`}>
                              Period {index + 1}
                            </span>
                          </div>
                          <div className={`flex items-center gap-1 ${textSecondary} text-xs mb-1`}>
                            <Clock className="w-3 h-3" />
                            <span>{event.startTime} - {event.endTime}</span>
                          </div>
                          {!isBreak && (event as Period).teacherId && (
                            <div className={`flex items-center gap-1 ${textSecondary} text-xs`}>
                              <User className="w-3 h-3" />
                              <span>{(event as Period).teacherId}</span>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8">
                      <p className={`${textSecondary} text-xs`}>No classes scheduled</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Desktop Table View */
          <div className={`${cardBg} rounded-xl shadow-lg overflow-hidden border ${border}`}>
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full min-w-[800px]">
              <thead>
                <tr className={isDark ? "bg-slate-900/50" : "bg-slate-100"}>
                  <th className={`${textPrimary} px-3 py-3 text-left text-xs font-semibold uppercase border-b ${border} sticky left-0 z-10 ${isDark ? "bg-slate-900/50" : "bg-slate-100"}`}>
                    #
                  </th>
                  {processedDays.map(d => (
                    <th
                      key={d.dayName}
                      className={`${textPrimary} px-3 py-3 text-center text-xs font-semibold uppercase border-b ${border}`}
                    >
                      {d.dayName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rowsArray.map((rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={`${isDark ? 'hover:bg-slate-700/30' : 'hover:bg-blue-50/50'} transition-colors`}
                  >
                    <td className={`px-3 py-2 ${textSecondary} text-sm font-medium border-b ${border} sticky left-0 z-10 ${isDark ? "bg-slate-800/50" : "bg-white"}`}>
                      {rowIndex + 1}
                    </td>
                    {processedDays.map((day) => {
                      const event = day.events[rowIndex];
                      const isBreak = event?.type === 'break';

                      return (
                        <td
                          key={day.dayName}
                          className={`px-2 py-2 border-b ${border}`}
                        >
                          {event ? (
                            <div
                              className={`
                                rounded-lg p-3 transition-all hover:shadow-md
                                ${isBreak
                                  ? isDark 
                                    ? 'bg-amber-900/20 border border-amber-700/30' 
                                    : 'bg-amber-50 border border-amber-200'
                                  : isDark
                                    ? 'bg-blue-900/20 border border-blue-700/30'
                                    : 'bg-blue-50 border border-blue-200'
                                }
                              `}
                            >
                              <div className="flex items-start gap-2 mb-2">
                                <div className={`
                                  w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0
                                  ${isBreak 
                                    ? 'bg-amber-500' 
                                    : 'bg-blue-500'
                                  }
                                `}>
                                  {isBreak ? (
                                    <Coffee className="w-3.5 h-3.5 text-white" />
                                  ) : (
                                    <BookOpen className="w-3.5 h-3.5 text-white" />
                                  )}
                                </div>
                                <h4 className={`${textPrimary} font-semibold text-sm leading-tight`}>
                                  {event.subject}
                                </h4>
                              </div>
                              <div className={`flex items-center gap-1 ${textSecondary} text-xs mb-1`}>
                                <Clock className="w-3 h-3" />
                                <span>{event.startTime} - {event.endTime}</span>
                              </div>
                              {!isBreak && (event as Period).teacherId && (
                                <div className={`flex items-center gap-1 ${textSecondary} text-xs`}>
                                  <User className="w-3 h-3" />
                                  <span className="truncate">{(event as Period).teacherId}</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className={`
                              flex items-center justify-center py-4
                              rounded-lg border border-dashed ${border}
                              ${isDark ? 'bg-slate-800/20' : 'bg-slate-50'}
                            `}>
                              <span className={`${textSecondary} text-xs`}>-</span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                {rowsArray.length === 0 && (
                  <tr>
                    <td colSpan={processedDays.length + 1} className="text-center py-12">
                      <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                      <p className={`${textSecondary} text-sm`}>No schedule available.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        )}
      </div>

      <style>{`
        .scrollbar-thin::-webkit-scrollbar {
          height: 8px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: ${isDark ? '#1e293b' : '#f1f5f9'};
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: ${isDark ? '#475569' : '#cbd5e1'};
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: ${isDark ? '#64748b' : '#94a3b8'};
        }
      `}</style>
    </div>
  );
};

export default StudentTimeTableView;