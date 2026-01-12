import React, { useEffect, useState } from "react";
import { getTeacherSchedule } from "../../services/authapi";
import { useTheme } from "../../components/layout/ThemeContext";
import { Loader2, Calendar, Clock, User, BookOpen, Coffee, Armchair } from "lucide-react";

interface ScheduleItem {
    day: string;
    startTime: string;
    endTime: string;
    subject: string;
    className?: string;
    division?: string;
    type: 'class' | 'break' | 'rest';
}

interface DaySchedule {
    dayName: string;
    events: ScheduleItem[];
}

const DAYS_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const TeacherScheduleView: React.FC = () => {
    const { isDark } = useTheme();
    const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
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

    // Styling
    const bgPrimary = isDark ? "bg-[#121A21]" : "bg-slate-50";
    const cardBg = isDark ? "bg-slate-800/50" : "bg-white";
    const textPrimary = isDark ? "text-slate-100" : "text-slate-900";
    const textSecondary = isDark ? "text-slate-400" : "text-slate-600";
    const border = isDark ? "border-slate-700" : "border-slate-200";
    const headerBg = isDark ? "bg-slate-900/80" : "bg-gradient-to-r from-teal-500 to-emerald-600";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getTeacherSchedule();
                console.log("Teacher Schedule Response:", response);

                // Handle both wrapped { success: true, data: [...] } and direct array [...]
                const schedule = response.data || response;

                if (Array.isArray(schedule)) {
                    setScheduleData(schedule);
                } else {
                    // If data is still not an array
                    console.error("Unexpected data format", response);
                    setScheduleData([]);
                }
            } catch (err: any) {
                console.error("Error fetching teacher schedule", err);
                setError(err.message || "Failed to load schedule.");
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
                    <Loader2 className="w-10 h-10 animate-spin text-teal-500 mx-auto mb-3" />
                    <p className={`${textSecondary} text-sm`}>Loading your schedule...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`min-h-screen ${bgPrimary} flex items-center justify-center p-4`}>
                <div className={`${cardBg} rounded-xl shadow-lg p-8 border ${border} max-w-md text-center`}>
                    <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <h3 className={`${textPrimary} text-lg font-semibold mb-2`}>Schedule Not Available</h3>
                    <p className={`${textSecondary} text-sm`}>{error}</p>
                </div>
            </div>
        );
    }

    // Group by Day
    const processedDays: DaySchedule[] = DAYS_ORDER.map(day => {
        const dayEvents = scheduleData.filter(item => item.day === day);
        // Sort by time
        dayEvents.sort((a, b) => a.startTime.localeCompare(b.startTime));
        return { dayName: day, events: dayEvents };
    });

    // Calculate rows for desktop table
    const maxEvents = Math.max(...processedDays.map(d => d.events.length), 0);
    const rowsArray = Array.from({ length: maxEvents }, (_, i) => i);

    const getEventStyle = (type: ScheduleItem['type']) => {
        switch (type) {
            case 'class':
                return isDark
                    ? 'bg-teal-900/20 border-teal-700/30'
                    : 'bg-teal-50 border-teal-200';
            case 'break':
                return isDark
                    ? 'bg-amber-900/20 border-amber-700/30'
                    : 'bg-amber-50 border-amber-200';
            case 'rest':
                return isDark
                    ? 'bg-slate-800/40 border-slate-700/50 opacity-60'
                    : 'bg-slate-100 border-slate-200 opacity-80';
            default:
                return '';
        }
    };

    const getEventIcon = (type: ScheduleItem['type']) => {
        switch (type) {
            case 'class': return <BookOpen className="w-3.5 h-3.5 text-white" />;
            case 'break': return <Coffee className="w-3.5 h-3.5 text-white" />;
            case 'rest': return <Armchair className="w-3.5 h-3.5 text-white" />;
        }
    };

    const getIconBg = (type: ScheduleItem['type']) => {
        switch (type) {
            case 'class': return 'bg-teal-500';
            case 'break': return 'bg-amber-500';
            case 'rest': return 'bg-slate-400';
        }
    }

    return (
        <div className={`min-h-screen ${bgPrimary} p-4 md:p-6`}>
            <div className="max-w-7xl mx-auto">
                <div className={`${headerBg} rounded-xl shadow-lg p-6 mb-6 border border-white/10`}>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                            <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-white text-2xl font-bold">My Schedule</h1>
                            <p className="text-teal-50 text-sm mt-1">
                                View your daily classes, breaks, and free periods.
                            </p>
                        </div>
                    </div>
                </div>

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
                                            return (
                                                <div
                                                    key={index}
                                                    className={`
                             rounded-lg p-3 transition-all border
                             ${getEventStyle(event.type)}
                           `}
                                                >
                                                    <div className="flex items-start justify-between gap-2 mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`
                                 w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0
                                 ${getIconBg(event.type)}
                               `}>
                                                                {getEventIcon(event.type)}
                                                            </div>
                                                            <h4 className={`${textPrimary} font-semibold text-sm`}>
                                                                {event.subject}
                                                            </h4>
                                                        </div>
                                                    </div>
                                                    <div className={`flex items-center gap-1 ${textSecondary} text-xs mb-1 ml-8`}>
                                                        <Clock className="w-3 h-3" />
                                                        <span>{event.startTime} - {event.endTime}</span>
                                                    </div>
                                                    {event.type === 'class' && (
                                                        <div className={`flex items-center gap-1 ${textSecondary} text-xs ml-8`}>
                                                            <User className="w-3 h-3" />
                                                            <span>{event.className} - {event.division}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-center py-6">
                                            <p className={`${textSecondary} text-xs`}>No schedule for this day.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={`${cardBg} rounded-xl shadow-lg overflow-hidden border ${border}`}>
                        <div className="overflow-x-auto scrollbar-thin">
                            <table className="w-full min-w-[800px]">
                                <thead>
                                    <tr className={isDark ? "bg-slate-900/50" : "bg-slate-100"}>
                                        <th className={`${textPrimary} px-3 py-4 text-left text-xs font-semibold uppercase border-b ${border} sticky left-0 z-10 ${isDark ? "bg-slate-900/50" : "bg-slate-100"}`}>
                                            Time
                                        </th>
                                        {processedDays.map(d => (
                                            <th
                                                key={d.dayName}
                                                className={`${textPrimary} px-3 py-4 text-center text-xs font-semibold uppercase border-b ${border}`}
                                            >
                                                {d.dayName}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Get all unique start times to define standard rows */}
                                    {Array.from(new Set(scheduleData.map(s => s.startTime)))
                                        .sort() // String sort works for "09:00", "10:00" etc.
                                        .map((time, rowIndex) => (
                                            <tr
                                                key={time}
                                                className={`${isDark ? 'hover:bg-slate-700/30' : 'hover:bg-teal-50/50'} transition-colors`}
                                            >
                                                <td className={`px-3 py-2 ${textSecondary} text-sm font-medium border-b ${border} sticky left-0 z-10 ${isDark ? "bg-slate-800/90" : "bg-white"}`}>
                                                    {time}
                                                </td>
                                                {processedDays.map((day) => {
                                                    // Find event for this day at this time
                                                    const event = day.events.find(e => e.startTime === time);

                                                    return (
                                                        <td
                                                            key={`${day.dayName}-${time}`}
                                                            className={`px-2 py-2 border-b ${border}`}
                                                        >
                                                            {event ? (
                                                                <div
                                                                    className={`
                                                                        rounded-lg p-3 transition-all hover:shadow-md border
                                                                        ${getEventStyle(event.type)}
                                                                    `}
                                                                >
                                                                    <div className="flex items-start gap-2 mb-2">
                                                                        <div className={`
                                                                            w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0
                                                                            ${getIconBg(event.type)}
                                                                        `}>
                                                                            {getEventIcon(event.type)}
                                                                        </div>
                                                                        <h4 className={`${textPrimary} font-semibold text-sm leading-tight`}>
                                                                            {event.subject}
                                                                        </h4>
                                                                    </div>
                                                                    <div className={`flex items-center gap-1 ${textSecondary} text-xs mb-1`}>
                                                                        <Clock className="w-3 h-3" />
                                                                        <span>{event.startTime} - {event.endTime}</span>
                                                                    </div>
                                                                    {event.type === 'class' && (
                                                                        <div className={`flex items-center gap-1 ${textSecondary} text-xs`}>
                                                                            <User className="w-3 h-3" />
                                                                            <span className="truncate">{event.className} {event.division}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                // Render implied Rest period if no event exists for this time slot
                                                                <div className={`
                                                                    rounded-lg p-3 transition-all border opacity-60
                                                                    ${isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-slate-100 border-slate-200'}
                                                                `}>
                                                                    <div className="flex items-start gap-2 mb-2">
                                                                        <div className={`
                                                                            w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 bg-slate-400
                                                                        `}>
                                                                            <Armchair className="w-3.5 h-3.5 text-white" />
                                                                        </div>
                                                                        <h4 className={`${textPrimary} font-semibold text-sm leading-tight`}>
                                                                            Rest
                                                                        </h4>
                                                                    </div>
                                                                    <div className={`flex items-center gap-1 ${textSecondary} text-xs mb-1`}>
                                                                        <Clock className="w-3 h-3" />
                                                                        <span>{time}</span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherScheduleView;
