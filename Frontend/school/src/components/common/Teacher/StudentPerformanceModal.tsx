import React, { useEffect, useState } from 'react';
import { X, User, Award, Percent, BookOpen } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import * as authapi from '../../../services/authapi';

interface StudentPerformanceModalProps {
    studentId: string;
    isOpen: boolean;
    onClose: () => void;
    studentName: string;
}

interface PerformanceData {
    attendancePercentage: number;
    overallGrade: string;
    examPerformance: {
        examName: string;
        subject: string;
        marksObtained: number;
        maxMarks: number;
        grade: string;
    }[];
}

export const StudentPerformanceModal: React.FC<StudentPerformanceModalProps> = ({
    studentId,
    isOpen,
    onClose,
    studentName
}) => {
    const [data, setData] = useState<PerformanceData | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && studentId) {
            fetchPerformance();
        }
    }, [isOpen, studentId]);

    const fetchPerformance = async () => {
        setLoading(true);
        try {
            const response = await authapi.getStudentPerformance(studentId);
            if (response && (response as any).success) {
                setData((response as any).data);
            }
        } catch (error) {
            console.error("Failed to fetch performance", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const chartData = data?.examPerformance.map(e => ({
        name: `${e.subject} (${e.examName})`,
        marks: e.marksObtained,
        max: e.maxMarks,
        percentage: (e.marksObtained / e.maxMarks) * 100
    })) || [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-700">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <User size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{studentName}</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Performance Overview</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
                    >
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : !data ? (
                    <div className="p-8 text-center text-slate-500">No performance data found.</div>
                ) : (
                    <div className="p-6 space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Attendance Card */}
                            <div className="bg-amber-50 dark:bg-amber-900/10 p-5 rounded-xl border border-amber-100 dark:border-amber-900/20">
                                <div className="flex items-center gap-3 mb-2">
                                    <Percent className="text-amber-600" size={20} />
                                    <h3 className="font-semibold text-amber-900 dark:text-amber-100">Attendance</h3>
                                </div>
                                <div className="flex items-end gap-2">
                                    <span className="text-3xl font-bold text-amber-700 dark:text-amber-400">{data.attendancePercentage}%</span>
                                    <span className="text-sm text-amber-600/80 mb-1">Present</span>
                                </div>
                                <div className="w-full bg-amber-200/50 rounded-full h-2 mt-3">
                                    <div
                                        className="bg-amber-500 h-2 rounded-full transition-all duration-1000"
                                        style={{ width: `${data.attendancePercentage}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Grade Card */}
                            <div className="bg-emerald-50 dark:bg-emerald-900/10 p-5 rounded-xl border border-emerald-100 dark:border-emerald-900/20">
                                <div className="flex items-center gap-3 mb-2">
                                    <Award className="text-emerald-600" size={20} />
                                    <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">Overall Grade</h3>
                                </div>
                                <div className="flex items-end gap-2">
                                    <span className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">{data.overallGrade}</span>
                                </div>
                                <p className="text-xs text-emerald-600/80 mt-2">Based on all completed exams</p>
                            </div>

                            {/* Total Exams Card */}
                            <div className="bg-purple-50 dark:bg-purple-900/10 p-5 rounded-xl border border-purple-100 dark:border-purple-900/20">
                                <div className="flex items-center gap-3 mb-2">
                                    <BookOpen className="text-purple-600" size={20} />
                                    <h3 className="font-semibold text-purple-900 dark:text-purple-100">Exams Taken</h3>
                                </div>
                                <div className="flex items-end gap-2">
                                    <span className="text-3xl font-bold text-purple-700 dark:text-purple-400">{data.examPerformance.length}</span>
                                    <span className="text-sm text-purple-600/80 mb-1">Subjects</span>
                                </div>
                            </div>
                        </div>

                        {/* Chart Section */}
                        <div className="bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                            <h3 className="text-lg font-bold mb-6 text-slate-800 dark:text-slate-100">Exam Performance History</h3>
                            <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                        <XAxis
                                            dataKey="name"
                                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                                            axisLine={false}
                                            tickLine={false}
                                            domain={[0, 100]}
                                        />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            cursor={{ fill: 'transparent' }}
                                        />
                                        <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.percentage >= 70 ? '#10b981' : entry.percentage >= 40 ? '#f59e0b' : '#ef4444'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};
