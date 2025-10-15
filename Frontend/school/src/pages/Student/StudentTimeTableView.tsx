








import React, { useEffect, useState } from "react";
import { StudentProfile, TimeTableview } from "../../services/Student/StudentApi";
import { useTheme } from "../../components/layout/ThemeContext";
import { Clock, BookOpen, User, Calendar, Sun, Moon } from "lucide-react";

// Interfaces
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

const StudentTimeTableView: React.FC = () => {
  const { isDark } = useTheme();
  const [student, setStudent] = useState<Student | null>(null);
  const [todaySchedule, setTodaySchedule] = useState<DaySchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchProfileAndTimetable = async () => {
      try {
        const profileRes = await StudentProfile();
        const studentApiData = profileRes?.data?.data;

        if (!studentApiData) {
          setError("Student profile not found");
          return;
        }

        const studentData: Student = {
          ...studentApiData,
          _id: studentApiData.id,
        };
        setStudent(studentData);

        const timetableRes = await TimeTableview(studentData._id);
        const timetableData: TimeTable = timetableRes?.data;

        if (!timetableRes?.success || !timetableData) {
          setError("Timetable not found for this student");
          return;
        }

        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const todayIndex = new Date().getDay();
        const today = days[todayIndex];

        const todaySchedule = timetableData.days.find(d => d.day === today) || null;
        setTodaySchedule(todaySchedule);

      } catch (err: any) {
        console.error("Error fetching timetable:", err);
        setError(err?.message || "Failed to fetch timetable");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndTimetable();
  }, []);

  const isCurrentPeriod = (startTime: string, endTime: string) => {
    const now = currentTime.getHours() * 60 + currentTime.getMinutes();
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const start = startH * 60 + startM;
    const end = endH * 60 + endM;
    return now >= start && now < end;
  };

  const isPastPeriod = (endTime: string) => {
    const now = currentTime.getHours() * 60 + currentTime.getMinutes();
    const [endH, endM] = endTime.split(':').map(Number);
    const end = endH * 60 + endM;
    return now > end;
  };

  const getSubjectColor = (index: number) => {
    const colors = [
      { light: 'from-blue-400 to-blue-600', dark: 'from-blue-500 to-blue-700', dot: 'bg-blue-500' },
      { light: 'from-purple-400 to-purple-600', dark: 'from-purple-500 to-purple-700', dot: 'bg-purple-500' },
      { light: 'from-pink-400 to-pink-600', dark: 'from-pink-500 to-pink-700', dot: 'bg-pink-500' },
      { light: 'from-orange-400 to-orange-600', dark: 'from-orange-500 to-orange-700', dot: 'bg-orange-500' },
      { light: 'from-green-400 to-green-600', dark: 'from-green-500 to-green-700', dot: 'bg-green-500' },
      { light: 'from-teal-400 to-teal-600', dark: 'from-teal-500 to-teal-700', dot: 'bg-teal-500' },
      { light: 'from-indigo-400 to-indigo-600', dark: 'from-indigo-500 to-indigo-700', dot: 'bg-indigo-500' },
      { light: 'from-rose-400 to-rose-600', dark: 'from-rose-500 to-rose-700', dot: 'bg-rose-500' },
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="text-center">
          <div className={`inline-block p-4 rounded-full ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-xl mb-4`}>
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-blue-500 border-r-purple-500 border-b-pink-500 border-l-transparent"></div>
          </div>
          <p className={`text-lg font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Loading your schedule...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className={`max-w-md w-full p-8 rounded-3xl ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white shadow-2xl'}`}>
          <div className="text-red-500 text-6xl mb-4 text-center">!</div>
          <h3 className={`text-xl font-bold mb-2 text-center ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Oops!</h3>
          <p className={`text-center ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{error}</p>
        </div>
      </div>
    );
  }

  if (!student || !todaySchedule) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className={`max-w-md w-full p-8 rounded-3xl text-center ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white shadow-2xl'}`}>
          <Calendar className={`w-20 h-20 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
          <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>No Classes Today</h3>
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>Enjoy your day off!</p>
        </div>
      </div>
    );
  }

 const bgColor = isDark ? 'bg-[#121A21]' : 'bg-slate-50';
const cardBg = isDark ? 'bg-slate-800/50' : 'bg-white';

  const timeOfDay = currentTime.getHours() < 12 ? 'Morning' : currentTime.getHours() < 17 ? 'Afternoon' : 'Evening';

  return (
    <div className={`min-h-screen ${bgColor} p-4 md:p-8 transition-colors duration-300`}>
      <div className="max-w-5xl mx-auto">
        
        {/* Compact Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {timeOfDay === 'Morning' ? <Sun className="w-5 h-5 text-amber-500" /> : 
                 timeOfDay === 'Afternoon' ? <Sun className="w-5 h-5 text-orange-500" /> : 
                 <Moon className="w-5 h-5 text-indigo-400" />}
                <span className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Good {timeOfDay}, {student.fullName.split(' ')[0]}
                </span>
              </div>
              <h1 className={`text-3xl md:text-4xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                {todaySchedule.day}'s Classes
              </h1>
            </div>
            <div className={`px-4 py-2 rounded-2xl ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white shadow-lg'}`}>
              <div className={`text-xs font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Class</div>
              <div className={`text-lg font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                {student.classDetails?.className}-{student.classDetails?.division}
              </div>
            </div>
          </div>
          
          {/* Current Time Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white shadow-md'}`}>
            <Clock className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Timeline Layout */}
        <div className="space-y-4">
          {todaySchedule.periods.map((period, index) => {
            const isCurrent = isCurrentPeriod(period.startTime, period.endTime);
            const isPast = isPastPeriod(period.endTime);
            const colors = getSubjectColor(index);

            return (
              <div key={index} className="flex gap-4 group">
                {/* Timeline Dot & Line */}
                <div className="flex flex-col items-center">
                  <div className={`w-4 h-4 rounded-full ${isCurrent ? colors.dot + ' ring-4 ring-offset-2 ' + (isDark ? 'ring-slate-900 ring-offset-slate-900' : 'ring-slate-50 ring-offset-slate-50') : isPast ? isDark ? 'bg-slate-700' : 'bg-slate-300' : colors.dot} transition-all duration-300 ${isCurrent ? 'scale-125' : ''}`}></div>
                  {index < todaySchedule.periods.length - 1 && (
                    <div className={`w-0.5 flex-1 mt-2 ${isPast ? isDark ? 'bg-slate-800' : 'bg-slate-200' : isDark ? 'bg-slate-700' : 'bg-slate-300'}`} style={{ minHeight: '60px' }}></div>
                  )}
                </div>

                {/* Period Card */}
                <div className={`flex-1 mb-6 ${cardBg} rounded-2xl p-5 shadow-lg border transition-all duration-300 ${
                  isCurrent 
                    ? isDark ? 'border-blue-500 shadow-blue-500/20 shadow-xl' : 'border-blue-400 shadow-blue-400/30 shadow-xl'
                    : isDark ? 'border-slate-700 hover:border-slate-600' : 'border-slate-200 hover:border-slate-300'
                } ${isPast ? 'opacity-60' : ''} group-hover:scale-[1.02]`}>
                  
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-xl bg-gradient-to-br ${isDark ? colors.dark : colors.light}`}>
                          <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className={`text-xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                            {period.subject}
                          </h3>
                          <span className={`text-xs font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            Period {index + 1}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {isCurrent && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-white animate-pulse">
                        NOW
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                      <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {period.startTime}
                      </span>
                      <span className={isDark ? 'text-slate-600' : 'text-slate-400'}>→</span>
                      <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {period.endTime}
                      </span>
                    </div>
                    
                    <div className={`h-4 w-px ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
                    
                    <div className="flex items-center gap-2">
                      <User className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                        {period.teacherId || "Teacher TBA"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Stats */}
        <div className={`mt-8 p-6 ${cardBg} rounded-2xl shadow-lg border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Total Classes
              </div>
              <div className={`text-3xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                {todaySchedule.periods.length}
              </div>
            </div>
            <div className={`text-right ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <div className="text-sm">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentTimeTableView;