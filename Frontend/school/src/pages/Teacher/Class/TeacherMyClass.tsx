import React, { useEffect, useState } from 'react';
import * as authapi from '../../../services/authapi';
import { Users, Search } from 'lucide-react';
import { StudentPerformanceModal } from '../../../components/common/Teacher/StudentPerformanceModal';
import { Pagination } from '../../../components/common/Pagination';
import { useTheme } from '../../../components/layout/ThemeContext';
import { useDebounce } from '../../../hooks/useDebounce';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar
} from 'recharts';

interface Student {
    id: string;
    fullName: string;
    studentId: string;
    photos: { url: string }[];
    attendancePercentage: number;
}

interface ClassData {
    classInfo: {
        className: string;
        division: string;
        department?: string;
    };
    students: Student[];
    totalStudents: number;
    teacherName?: string;
    totalCount: number;
    stats: {
        attendance: { percentage: number, trend: number };
        performance: { average: number, trend: number };
        schoolAverage: number;
        history: Array<{ month: string, avg: number }>;
        topStudents: Array<{ _id: string, fullName: string, studentId: string, avgMarks: number }>;
        weakStudents: Array<{ _id: string, fullName: string, studentId: string, avgMarks: number }>;
    }
}

const TeacherMyClass: React.FC = () => {
    const { isDark } = useTheme();
    const [classData, setClassData] = useState<ClassData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Search & Pagination State
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const [currentPage, setCurrentPage] = useState(1);
    const studentsPerPage = 5;

    const pageBg = isDark ? "bg-[#121A21]" : "bg-slate-50";
    const cardBg = isDark ? "bg-slate-800/50" : "bg-white";
    const borderColor = isDark ? "border-slate-700" : "border-slate-200";

    useEffect(() => {
        fetchClassData();
    }, [debouncedSearchTerm, currentPage]);

    const fetchClassData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await authapi.getTeacherClass(debouncedSearchTerm, currentPage, studentsPerPage);
            if (response.success) {
                setClassData(response.data);
            } else {
                setError("Failed to load class details.");
            }
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || "Error loading class details.");
        } finally {
            setLoading(false);
        }
    };

    const handleStudentClick = (student: Student) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
    };

    const performanceData = classData?.stats.history || [];

    const attendanceData = [
        { name: 'Class Avg', present: classData?.stats.attendance.percentage || 0 },
        { name: 'Target', present: 95 }, // Static target
    ];

    const topStudents = classData?.stats.topStudents || [];
    const supportStudents = classData?.stats.weakStudents || [];

    const totalPages = classData ? Math.ceil(classData.totalCount / studentsPerPage) : 1;

    if (loading) {
        return (
            <div className={`flex items-center justify-center min-h-screen ${pageBg}`}>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`flex flex-col items-center justify-center min-h-screen ${pageBg} p-4`}>
                <div className="text-red-500 font-semibold text-lg mb-2">Unavailable</div>
                <p className={`${isDark ? "text-slate-400" : "text-slate-600"}`}>{error}</p>
            </div>
        );
    }

    if (!classData) return null;

    return (
        <div className={`p-6 max-w-7xl mx-auto space-y-8 min-h-screen ${pageBg} transition-colors duration-300`}>
            {/* Header Section */}
            <div className={`${cardBg} p-4 md:p-6 rounded-2xl shadow-sm border ${borderColor} flex flex-col md:flex-row justify-between items-start md:items-center gap-4`}>
                <div className="w-full md:w-auto">
                    <h1 className={`text-2xl md:text-3xl font-bold mb-1 md:mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                        {classData.classInfo.className} - {classData.classInfo.division}
                    </h1>
                    <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>View and manage details for this class</p>
                </div>
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-200 dark:border-slate-700">
                    <div>
                        <p className={`text-[10px] md:text-sm uppercase tracking-wider ${isDark ? "text-slate-500" : "text-slate-400"}`}>Class Teacher</p>
                        <p className={`font-semibold text-base md:text-lg ${isDark ? "text-white" : "text-slate-800"}`}>
                            {classData.teacherName || "Unknown"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div className={`${cardBg} p-5 md:p-6 rounded-xl shadow-sm border ${borderColor}`}>
                    <p className="text-xs md:text-sm text-slate-500 mb-1 font-medium">Total Students</p>
                    <div className="flex items-end gap-2">
                        <p className={`text-2xl md:text-3xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{classData.totalStudents}</p>
                        <p className="text-xs text-slate-400 mb-1.5">Enrolled</p>
                    </div>
                    <div className={`mt-4 w-full rounded-full h-1.5 ${isDark ? "bg-slate-700" : "bg-slate-100"}`}>
                        <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 gap-8">

                {/* Student List Section (Full Width) */}
                <div className={`${cardBg} rounded-2xl shadow-sm border ${borderColor} overflow-hidden`}>
                    <div className={`p-4 md:p-6 border-b ${borderColor} flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4`}>
                        <h2 className={`text-lg md:text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Student List</h2>
                        <div className="relative w-full sm:w-auto">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search students..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                className={`pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64 border ${isDark
                                    ? "bg-slate-900 border-slate-700 text-white"
                                    : "bg-slate-50 border-slate-200 text-slate-900"}`}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className={`${isDark ? "bg-slate-900/50 text-slate-400" : "bg-slate-50 text-slate-500"} text-xs uppercase font-semibold`}>
                                <tr>
                                    <th className="px-6 py-4">Name/Marks/Roll No.</th>
                                    <th className="px-6 py-4">Attendance %</th>
                                    <th className="px-6 py-4">Parent Contact</th>
                                    <th className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${isDark ? "divide-slate-700" : "divide-slate-100"}`}>
                                {classData.students.map((student) => (
                                    <tr key={student.id} className={`transition-colors ${isDark ? "hover:bg-slate-700/50" : "hover:bg-slate-50"}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full overflow-hidden shrink-0 ${isDark ? "bg-slate-700" : "bg-slate-200"}`}>
                                                    {student.photos?.[0] ? (
                                                        <img src={student.photos[0].url} alt={student.fullName} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Users size={20} className="m-auto mt-2.5 text-slate-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className={`text-sm font-medium ${isDark ? "text-white" : "text-slate-900"}`}>{student.fullName}</p>
                                                    <p className="text-xs text-slate-500">{student.studentId}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {/* Logic to show student's specific attendance if available */}
                                            <div className="flex items-center gap-2">
                                                <div className={`w-24 rounded-full h-1.5 ${isDark ? "bg-slate-700" : "bg-slate-100"}`}>
                                                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${student.attendancePercentage || 0}%` }}></div>
                                                </div>
                                                <span className={`text-xs font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>{student.attendancePercentage || 0}%</span>
                                            </div>
                                        </td>
                                        <td className={`px-6 py-4 text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                                            Contacted
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleStudentClick(student)}
                                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                            >
                                                View Student
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {classData.students.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                            No students found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className={`p-4 border-t ${borderColor}`}>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </div>

                {/* Analytics Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Performance Chart */}
                    <div className={`${cardBg} p-5 md:p-6 rounded-2xl shadow-sm border ${borderColor}`}>
                        <div className="mb-6">
                            <h2 className={`text-base md:text-lg font-bold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>Performance Chart</h2>
                            <div className="flex items-center gap-2">
                                <span className={`text-2xl md:text-3xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{classData.stats.performance.average}%</span>
                                <span className="text-xs md:text-sm text-green-500 font-medium">Avg Marks</span>
                            </div>
                        </div>
                        <div className="h-48 md:h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={performanceData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#e2e8f0"} vertical={false} />
                                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis hide />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', background: isDark ? '#1e293b' : '#fff', color: isDark ? '#fff' : '#000' }} />
                                    <Line type="monotone" dataKey="avg" stroke="#3b82f6" strokeWidth={3} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Class Analytics (Attendance Graph) */}
                    <div className={`${cardBg} p-5 md:p-6 rounded-2xl shadow-sm border ${borderColor}`}>
                        <div className="mb-6">
                            <h2 className={`text-base md:text-lg font-bold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>Attendance Graph</h2>
                            <div className="flex items-center gap-2">
                                <span className={`text-2xl md:text-3xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{classData.stats.attendance.percentage}%</span>
                                <span className="text-xs md:text-sm text-green-500 font-medium">Class Avg</span>
                            </div>
                        </div>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={attendanceData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#334155" : "#e2e8f0"} />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', background: isDark ? '#1e293b' : '#fff', color: isDark ? '#fff' : '#000' }} />
                                    <Bar dataKey="present" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Avg Marks vs School */}
                    <div className={`${cardBg} p-5 md:p-6 rounded-2xl shadow-sm border ${borderColor}`}>
                        <div className="mb-6">
                            <h2 className={`text-base md:text-lg font-bold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>Avg. Marks vs School</h2>
                            <div className="flex items-center gap-2">
                                <span className={`text-2xl md:text-3xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{classData.stats.performance.average}%</span>
                                <span className="text-xs md:text-sm text-green-500 font-medium">Class Avg</span>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-[10px] md:text-xs text-slate-500 mb-2">
                                    <span className="font-medium uppercase tracking-wider">Class Avg</span>
                                    <span className="font-bold">{classData.stats.performance.average}%</span>
                                </div>
                                <div className={`w-full rounded-full h-6 overflow-hidden ${isDark ? "bg-slate-700/50" : "bg-slate-100"}`}>
                                    <div className="bg-blue-600/20 h-full rounded-r-lg border-r-4 border-blue-500 relative transition-all duration-1000 ease-out" style={{ width: `${classData.stats.performance.average}%` }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[10px] md:text-xs text-slate-500 mb-2">
                                    <span className="font-medium uppercase tracking-wider">School Average</span>
                                    <span className="font-bold">{classData.stats.schoolAverage}%</span>
                                </div>
                                <div className={`w-full rounded-full h-6 overflow-hidden ${isDark ? "bg-slate-700/50" : "bg-slate-100"}`}>
                                    <div className="bg-slate-400/20 h-full rounded-r-lg border-r-4 border-slate-400 relative transition-all duration-1000 ease-out" style={{ width: `${classData.stats.schoolAverage}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Row: Top Students & Support (Moved from Sidebar) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Top Students */}
                    <div className={`${cardBg} p-6 rounded-2xl shadow-sm border ${borderColor}`}>
                        <h3 className={`font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>Top Students</h3>
                        <div className="space-y-4">
                            {topStudents.map(student => (
                                <div key={student._id} className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full overflow-hidden ${isDark ? "bg-slate-700" : "bg-slate-200"}`}>
                                        <Users size={20} className="m-auto mt-2.5 text-slate-400" />
                                    </div>
                                    <div>
                                        <p className={`text-sm font-medium ${isDark ? "text-white" : "text-slate-900"}`}>{student.fullName}</p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-1.5 bg-slate-200 rounded-full dark:bg-slate-700">
                                                <div className="h-full bg-green-500 rounded-full" style={{ width: `${student.avgMarks}%` }}></div>
                                            </div>
                                            <p className="text-xs text-green-500 font-medium">{Math.round(student.avgMarks)}%</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {topStudents.length === 0 && <p className="text-sm text-slate-500">No data available.</p>}
                        </div>
                    </div>

                    {/* Students Needing Support */}
                    <div className={`${cardBg} p-6 rounded-2xl shadow-sm border ${borderColor}`}>
                        <h3 className={`font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>Students Needing Support</h3>
                        <div className="space-y-4">
                            {supportStudents.map(student => (
                                <div key={student._id} className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full overflow-hidden ${isDark ? "bg-slate-700" : "bg-slate-200"}`}>
                                        <Users size={20} className="m-auto mt-2.5 text-slate-400" />
                                    </div>
                                    <div>
                                        <p className={`text-sm font-medium ${isDark ? "text-white" : "text-slate-900"}`}>{student.fullName}</p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-1.5 bg-slate-200 rounded-full dark:bg-slate-700">
                                                <div className="h-full bg-red-500 rounded-full" style={{ width: `${student.avgMarks}%` }}></div>
                                            </div>
                                            <p className="text-xs text-red-500 font-medium">{Math.round(student.avgMarks)}%</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {supportStudents.length === 0 && <p className="text-sm text-slate-500">No data available.</p>}
                        </div>
                    </div>
                </div>

            </div>

            {selectedStudent && (
                <StudentPerformanceModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    studentId={selectedStudent.id}
                    studentName={selectedStudent.fullName}
                />
            )}
        </div>
    );
};

export default TeacherMyClass;
