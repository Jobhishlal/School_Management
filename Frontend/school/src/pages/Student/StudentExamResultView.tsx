import React, { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
} from "recharts";
import { StudentExamResultView } from "../../services/authapi";
import { StudentProfile } from "../../services/Student/StudentApi";
import { useTheme } from "../../components/layout/ThemeContext";
import { Loader2, AlertCircle, Download } from "lucide-react";

interface ExamResult {
    examId: string;
    examTitle: string;
    subject: string;
    examDate: string;
    maxMarks: number;
    marksObtained: number | null;
    percentage: number | null;
    status: "Passed" | "Failed" | "Pending";
    remarks?: string;
}

export const StudentExamResultsPage: React.FC = () => {
    const { isDark } = useTheme();
    const [results, setResults] = useState<ExamResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const cardBg = isDark ? "bg-slate-800/50" : "bg-white";
    const textPrimary = isDark ? "text-slate-100" : "text-slate-900";
    const textSecondary = isDark ? "text-slate-400" : "text-slate-600";
    const border = isDark ? "border-slate-700" : "border-slate-200";

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // 1. Get Student Profile to get Class ID
                const profileRes = await StudentProfile();
                const classId = profileRes?.data?.data?.classDetails?.classId || profileRes?.data?.data?.classId;

                if (!classId) {
                    setError("Class information not found for this student.");
                    setLoading(false);
                    return;
                }

                // 2. Get Exam Results
                const resultsRes = await StudentExamResultView(classId);
                console.log("API Response:", resultsRes);

                if (resultsRes?.success) {
                    // Fix: Access results from nested data.results structure
                    const examResults = resultsRes.data?.results || resultsRes.data || [];
                    
                    // Ensure it's an array
                    if (Array.isArray(examResults)) {
                        setResults(examResults);
                    } else {
                        console.error("Results is not an array:", examResults);
                        setResults([]);
                    }
                } else {
                    setError("Failed to fetch exam results.");
                }
            } catch (err: any) {
                console.error("Error fetching results:", err);
                setError(err.message || "An error occurred while loading data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // --- Prepare Chart Data ---

    // 1. Marks Trend (Line Chart)
    const trendData = results
        .filter((r) => r.percentage !== null && r.percentage !== undefined)
        .map((r) => ({
            name: r.examTitle,
            percentage: r.percentage,
        }));

    // 2. Subject Comparison (Bar Chart)
    const subjectData = results
        .filter((r) => r.percentage !== null && r.percentage !== undefined)
        .map((r) => ({
            name: r.subject || r.examTitle,
            marks: r.percentage || 0,
        }));

    // 3. Pass/Fail Ratio
    const passCount = results.filter((r) => r.status === "Passed").length;
    const failCount = results.filter((r) => r.status === "Failed").length;
    const pendingCount = results.filter((r) => r.status === "Pending").length;
    
    const passFailData = [
        { name: "Passed", value: passCount },
        { name: "Failed", value: failCount },
    ];

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-[80vh] flex-col items-center justify-center gap-4 text-red-500">
                <AlertCircle size={48} />
                <p className="text-lg font-medium">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className={`space-y-8 p-6 ${isDark ? "bg-[#121A21]" : "bg-slate-50"} min-h-screen`}>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className={`text-2xl font-bold ${textPrimary}`}>Exam Results</h1>
                    <p className={textSecondary}>Track your academic performance</p>
                </div>
                <button className="flex items-center gap-2 rounded-lg bg-slate-700 px-4 py-2 text-white hover:bg-slate-600 transition-colors">
                    <Download size={18} />
                    <span>Download Report</span>
                </button>
            </div>

            {/* --- Performance Overview (Graphs) --- */}
            <div>
                <h2 className={`mb-4 text-xl font-semibold ${textPrimary}`}>Performance Overview</h2>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                    {/* Marks Trend */}
                    <div className={`rounded-xl border ${border} ${cardBg} p-6 shadow-md`}>
                        <h3 className={`mb-4 text-sm font-medium ${textSecondary}`}>Marks Trend</h3>
                        <div className={`mb-2 text-3xl font-bold ${textPrimary}`}>
                            {trendData.length > 0
                                ? `${Math.round(
                                    trendData.reduce((acc, curr) => acc + (curr.percentage || 0), 0) / trendData.length
                                )}%`
                                : "N/A"}
                            <span className="text-sm font-normal text-slate-500 ml-2">Avg.</span>
                        </div>

                        {trendData.length > 0 ? (
                            <>
                                <div className="h-48 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={trendData}>
                                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                                            <XAxis
                                                dataKey="name"
                                                hide
                                                axisLine={false}
                                                tickLine={false}
                                            />
                                            <YAxis hide domain={[0, 100]} />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: isDark ? "#1e293b" : "#fff",
                                                    borderColor: isDark ? "#334155" : "#e2e8f0",
                                                    borderRadius: "8px",
                                                    color: isDark ? "#f1f5f9" : "#0f172a"
                                                }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="percentage"
                                                stroke="#3b82f6"
                                                strokeWidth={3}
                                                dot={false}
                                                activeDot={{ r: 6, fill: "#3b82f6", strokeWidth: 0 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-2 flex justify-between text-xs text-slate-500">
                                    {trendData.slice(0, 3).map((d, i) => <span key={i}>{d.name.slice(0, 10)}...</span>)}
                                </div>
                            </>
                        ) : (
                            <div className="h-48 flex items-center justify-center text-slate-500">
                                No graded exams yet
                            </div>
                        )}
                    </div>

                    {/* Subject Comparison */}
                    <div className={`rounded-xl border ${border} ${cardBg} p-6 shadow-md`}>
                        <h3 className={`mb-4 text-sm font-medium ${textSecondary}`}>Subject Comparison</h3>
                        <div className={`mb-2 text-3xl font-bold ${textPrimary}`}>
                            {results.length} <span className="text-sm font-normal text-slate-500">Exams</span>
                        </div>
                        {subjectData.length > 0 ? (
                            <>
                                <div className="h-48 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={subjectData}>
                                            <Bar dataKey="marks" radius={[4, 4, 0, 0]}>
                                                {subjectData.map((_entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#3b82f6" : "#60a5fa"} />
                                                ))}
                                            </Bar>
                                            <Tooltip
                                                cursor={{ fill: 'transparent' }}
                                                contentStyle={{
                                                    backgroundColor: isDark ? "#1e293b" : "#fff",
                                                    borderColor: isDark ? "#334155" : "#e2e8f0",
                                                    borderRadius: "8px",
                                                    color: isDark ? "#f1f5f9" : "#0f172a"
                                                }}
                                            />
                                            <XAxis dataKey="name" hide />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-2 text-xs text-slate-500 text-center">
                                    Performance across different subjects
                                </div>
                            </>
                        ) : (
                            <div className="h-48 flex items-center justify-center text-slate-500">
                                No graded exams yet
                            </div>
                        )}
                    </div>

                    {/* Pass/Fail Ratio */}
                    <div className={`rounded-xl border ${border} ${cardBg} p-6 shadow-md`}>
                        <h3 className={`mb-4 text-sm font-medium ${textSecondary}`}>Pass/Fail Ratio</h3>
                        <div className={`mb-2 text-3xl font-bold ${textPrimary}`}>
                            {(passCount + failCount) > 0 ?
                                Math.round((passCount / (passCount + failCount)) * 100)
                                : 0}%
                            <span className="text-sm font-normal text-green-500 ml-2">Pass Rate</span>
                        </div>
                        {(passCount + failCount) > 0 ? (
                            <>
                                <div className="h-48 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={passFailData} layout="vertical" barSize={20}>
                                            <XAxis type="number" hide domain={[0, 'dataMax']} />
                                            <YAxis type="category" dataKey="name" hide />
                                            <Tooltip
                                                cursor={{ fill: 'transparent' }}
                                                contentStyle={{
                                                    backgroundColor: isDark ? "#1e293b" : "#fff",
                                                    borderColor: isDark ? "#334155" : "#e2e8f0",
                                                    borderRadius: "8px",
                                                    color: isDark ? "#f1f5f9" : "#0f172a"
                                                }}
                                            />
                                            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                                <Cell fill="#10b981" /> {/* Green for Pass */}
                                                <Cell fill="#ef4444" /> {/* Red for Fail */}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-2 flex justify-around text-xs text-slate-500">
                                    <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div> 
                                        Passed: {passCount}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-red-500"></div> 
                                        Failed: {failCount}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="h-48 flex items-center justify-center text-slate-500">
                                <div className="text-center">
                                    <p>No graded exams yet</p>
                                    {pendingCount > 0 && (
                                        <p className="text-xs mt-2">{pendingCount} exam(s) pending</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* --- Exam List Table --- */}
            <div className={`rounded-xl border ${border} ${cardBg} shadow-md overflow-hidden`}>
                <div className="p-6 border-b border-slate-700/50">
                    <h3 className={`text-lg font-semibold ${textPrimary}`}>Detailed Results</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className={`border-b ${border} ${isDark ? "bg-slate-900/50" : "bg-slate-100"}`}>
                            <tr>
                                <th className={`p-4 font-medium ${textSecondary}`}>Exam Title</th>
                                <th className={`p-4 font-medium ${textSecondary}`}>Date</th>
                                <th className={`p-4 font-medium ${textSecondary}`}>Subject</th>
                                <th className={`p-4 font-medium ${textSecondary}`}>Max Marks</th>
                                <th className={`p-4 font-medium ${textSecondary}`}>Obtained</th>
                                <th className={`p-4 font-medium ${textSecondary}`}>Percentage</th>
                                <th className={`p-4 font-medium ${textSecondary}`}>Status</th>
                                <th className={`p-4 font-medium ${textSecondary}`}>Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/30">
                            {results.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-slate-500">No exam results found.</td>
                                </tr>
                            ) : (
                                results.map((result) => (
                                    <tr
                                        key={result.examId}
                                        className={`group transition-colors ${isDark ? "hover:bg-slate-700/30" : "hover:bg-slate-50"
                                            }`}
                                    >
                                        <td className={`p-4 font-medium ${textPrimary}`}>{result.examTitle}</td>
                                        <td className={`p-4 ${textSecondary}`}>
                                            {new Date(result.examDate).toLocaleDateString()}
                                        </td>
                                        <td className={`p-4 ${textSecondary}`}>{result.subject}</td>
                                        <td className={`p-4 ${textSecondary}`}>{result.maxMarks}</td>
                                        <td className={`p-4 font-semibold ${textPrimary}`}>
                                            {result.marksObtained !== null ? result.marksObtained : "-"}
                                        </td>
                                        <td className={`p-4 ${textSecondary}`}>
                                            {result.percentage !== null ? `${result.percentage}%` : "-"}
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${result.status === "Passed"
                                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                                    : result.status === "Failed"
                                                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                                    }`}
                                            >
                                                {result.status}
                                            </span>
                                        </td>
                                       
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};