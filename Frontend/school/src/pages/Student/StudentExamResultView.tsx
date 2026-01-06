import jsPDF from "jspdf";
import { toPng } from "html-to-image";
import React, { useEffect, useState, useRef } from "react";
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
    PieChart,
    Pie,
} from "recharts";
import { StudentExamResultView, getInstituteProfile, RaiseExamConcern } from "../../services/authapi";
import { StudentProfile } from "../../services/Student/StudentApi";
import { useTheme } from "../../components/layout/ThemeContext";
import { Loader2, AlertCircle, Download, AlertTriangle, CheckCircle } from "lucide-react";
import { Pagination } from "../../components/common/Pagination";
import { Modal } from "../../components/common/Modal";
import { showToast } from "../../utils/toast";

interface ExamResult {
    examId: string;
    _id?: string;
    id?: string;
    examTitle: string;
    subject: string;
    examDate: string;
    maxMarks: number;
    passMarks: number;
    marksObtained: number | null;
    percentage: number | null;
    status: "Passed" | "Failed" | "Pending";
    remarks?: string;
    concern?: string;
    concernStatus?: "Pending" | "Resolved" | "Rejected";
    concernResponse?: string;
    updatedAt?: string;
}

export const StudentExamResultsPage: React.FC = () => {
    const { isDark } = useTheme();
    const [selectedSubject, setSelectedSubject] = useState<string>("All");
    const [results, setResults] = useState<ExamResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [studentProfile, setStudentProfile] = useState<any>(null);
    const [instituteDetails, setInstituteDetails] = useState<any>(null);
    const printRef = useRef<HTMLDivElement>(null);

    // Concern State
    const [concernModalOpen, setConcernModalOpen] = useState(false);
    const [selectedExamResult, setSelectedExamResult] = useState<ExamResult | null>(null);
    const [concernText, setConcernText] = useState("");
    const [submittingConcern, setSubmittingConcern] = useState(false);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 5;

    const cardBg = isDark ? "bg-slate-800/50" : "bg-white";
    const textPrimary = isDark ? "text-slate-100" : "text-slate-900";
    const textSecondary = isDark ? "text-slate-400" : "text-slate-600";
    const border = isDark ? "border-slate-700" : "border-slate-200";

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const profileRes = await StudentProfile();
                const profileData = profileRes?.data?.data;
                const classId = profileData?.classDetails?.classId || profileData?.classId;
                setStudentProfile(profileData);

                const instituteRes = await getInstituteProfile();
                if (instituteRes?.institute?.length > 0) {
                    setInstituteDetails(instituteRes.institute[0]);
                }

                if (!classId) {
                    setError("Class information not found for this student.");
                    setLoading(false);
                    return;
                }

                const resultsRes = await StudentExamResultView(classId);
                if (resultsRes?.success) {
                    const examResults = resultsRes.data?.results || resultsRes.data || [];
                    if (Array.isArray(examResults)) {
                        setResults(examResults);
                    } else {
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

    const convertToBase64 = (url: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = url;
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.drawImage(img, 0, 0);
                    resolve(canvas.toDataURL("image/png"));
                } else {
                    reject("Canvas context not found");
                }
            };
            img.onerror = (error) => reject(error);
        })
    }

    const handleDownloadPDF = async () => {
        if (!printRef.current) return;
        try {
            const imgData = await toPng(printRef.current, {
                backgroundColor: isDark ? "#0f172a" : "#ffffff",
                filter: (node) => {
                    if (node instanceof HTMLElement && node.getAttribute("data-html2canvas-ignore")) {
                        return false;
                    }
                    return true;
                }
            });

            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            const schoolName = instituteDetails?.instituteName || "Excellence Academy";
            const studentName = studentProfile?.fullName || "Student";
            const className = studentProfile?.classDetails?.className || studentProfile?.className || "N/A";
            const division = studentProfile?.classDetails?.division || studentProfile?.division || "";
            const date = new Date().toLocaleDateString();

            let logoDataUrl = "";
            if (instituteDetails?.logo && instituteDetails.logo.length > 0 && instituteDetails.logo[0].url) {
                try {
                    logoDataUrl = await convertToBase64(instituteDetails.logo[0].url);
                } catch (e) {
                    console.warn("Failed to load institute logo, using placeholder", e);
                }
            }
            if (!logoDataUrl) {
                logoDataUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmNLR0QA/wD/AP+gvaeTAAAAB3RJTUUH5gMWEw0si8iO7gAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAACCSURBVGje7dGxCcJAEEbh/y6oYGMlWNjZ2NlY2lgIFrY2QjAIGsFKhI0oNvb4A8lK8E3y4bvLzbsF/o2pHiC160j97bTqx1O9uunXqS7d9Oulvj3V865fL/Xjqb7d9OtU12769VLfnupp16+X+vFU3276dapbN/16qW9P9bTr10t9fKoH3+1sWz+4+Y0AAAAASUVORK5CYII=";
            }

            if (logoDataUrl) {
                try {
                    pdf.addImage(logoDataUrl, "PNG", 15, 15, 20, 20);
                } catch (err) {
                    console.error("Error adding logo to PDF:", err);
                }
            }

            pdf.setFontSize(22);
            pdf.setTextColor(41, 128, 185);
            pdf.text(schoolName, 40, 25);

            pdf.setFontSize(14);
            pdf.setTextColor(100);
            pdf.text("Academic Performance Report", 40, 32);

            pdf.setDrawColor(200);
            pdf.setFillColor(245, 247, 250);
            pdf.rect(14, 45, pdfWidth - 28, 20, "F");

            pdf.setFontSize(11);
            pdf.setTextColor(50);

            pdf.text(`Student Name:`, 20, 52);
            pdf.setFont("helvetica", "bold");
            pdf.text(studentName, 50, 52);

            pdf.setFont("helvetica", "normal");
            pdf.text(`Class/Div:`, 20, 60);
            pdf.setFont("helvetica", "bold");
            pdf.text(`${className} - ${division}`, 50, 60);

            pdf.setFont("helvetica", "normal");
            pdf.text(`Report Date:`, pdfWidth - 80, 52);
            pdf.setFont("helvetica", "bold");
            pdf.text(date, pdfWidth - 50, 52);

            pdf.setFont("helvetica", "normal");
            pdf.text(`Academic Year:`, pdfWidth - 80, 60);
            pdf.setFont("helvetica", "bold");
            pdf.text(new Date().getFullYear().toString(), pdfWidth - 50, 60);

            const imgY = 75;
            const imgProps = pdf.getImageProperties(imgData);
            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
            const availableHeight = pdfHeight - imgY - 10;
            const finalImgHeight = imgHeight > availableHeight ? availableHeight : imgHeight;

            pdf.addImage(imgData, "PNG", 0, imgY, pdfWidth, finalImgHeight);
            pdf.setFontSize(9);
            pdf.setTextColor(150);
            pdf.text("Generated by Brainnix School Management", pdfWidth / 2, pdfHeight - 10, { align: "center" });

            pdf.save(`${studentName}_Exam_Report.pdf`);
        } catch (error) {
            console.error("PDF Generation Error:", error);
            alert("Failed to generate PDF. Please try again.");
        }
    };

    // Raise Concern Handlers
    const handleRaiseConcernClick = (result: ExamResult) => {
        setSelectedExamResult(result);
        setConcernText("");
        setConcernModalOpen(true);
    };

    const submitConcern = async () => {
        if (!selectedExamResult || !concernText.trim()) return;

        const examMarkId = selectedExamResult.id || selectedExamResult._id;
        if (!examMarkId) {
            showToast("Error: Exam Mark ID not found", "error");
            return;
        }

        try {
            setSubmittingConcern(true);
            await RaiseExamConcern(examMarkId, concernText);
            showToast("Concern raised successfully. Awaiting teacher review.");
            setConcernModalOpen(false);
            window.location.reload();
        } catch (error: any) {
            console.error("Error raising concern:", error);
            showToast(error.message || "Failed to raise concern", "error");
        } finally {
            setSubmittingConcern(false);
        }
    };

    // Prepare Data
    const uniqueSubjects = Array.from(new Set(results.map((r) => r.subject))).filter(Boolean);
    const filteredResults = selectedSubject === "All"
        ? results
        : results.filter((r) => r.subject === selectedSubject);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedSubject]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentResults = filteredResults.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredResults.length / itemsPerPage);

    const overallSubjectData = uniqueSubjects.map(subject => {
        const subjectExams = results.filter(r => r.subject === subject && r.percentage !== null);
        const avg = subjectExams.length > 0
            ? Math.round(subjectExams.reduce((acc, curr) => acc + (curr.percentage || 0), 0) / subjectExams.length)
            : 0;
        return { subject, average: avg };
    });

    const subjectTrendData = filteredResults
        .filter(r => r.percentage !== null)
        .sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime())
        .map(r => ({
            examTitle: r.examTitle,
            percentage: r.percentage
        }));

    const passCount = filteredResults.filter((r) => r.status === "Passed").length;
    const failCount = filteredResults.filter((r) => r.status === "Failed").length;
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
        <div className={`space-y-8 p-6 ${isDark ? "bg-[#121A21]" : "bg-slate-50"} min-h-screen`} ref={printRef}>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className={`text-2xl font-bold ${textPrimary}`}>Exam Results</h1>
                    <p className={textSecondary}>Track your academic performance</p>
                </div>
                <button
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-2 rounded-lg bg-slate-700 px-4 py-2 text-white hover:bg-slate-600 transition-colors"
                    data-html2canvas-ignore="true"
                >
                    <Download size={18} />
                    <span>Download Report</span>
                </button>
            </div>

            <div className="flex items-center gap-4" data-html2canvas-ignore="true">
                <select
                    className={`rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${isDark
                        ? "bg-slate-800 border-slate-700 text-slate-100"
                        : "bg-white border-slate-200 text-slate-900"
                        }`}
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                >
                    <option value="All">All Subjects</option>
                    {uniqueSubjects.map((subject) => (
                        <option key={subject} value={subject}>
                            {subject}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <h2 className={`mb-4 text-xl font-semibold ${textPrimary}`}>Performance Overview</h2>
                {selectedSubject === "All" ? (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <div className={`rounded-xl border ${border} ${cardBg} p-6 shadow-md`}>
                            <h3 className={`mb-4 text-sm font-medium ${textSecondary}`}>Subject Performance (Avg %)</h3>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={overallSubjectData}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                                        <XAxis dataKey="subject" axisLine={false} tickLine={false} />
                                        <YAxis hide domain={[0, 100]} />
                                        <Tooltip
                                            cursor={{ fill: 'transparent' }}
                                            contentStyle={{
                                                backgroundColor: isDark ? "#1e293b" : "#fff",
                                                borderColor: isDark ? "#334155" : "#e2e8f0",
                                                borderRadius: "8px",
                                                color: isDark ? "#f1f5f9" : "#0f172a"
                                            }}
                                        />
                                        <Bar dataKey="average" radius={[4, 4, 0, 0]}>
                                            {overallSubjectData.map((_entry, index) => (
                                                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#3b82f6" : "#60a5fa"} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className={`rounded-xl border ${border} ${cardBg} p-6 shadow-md`}>
                            <h3 className={`mb-4 text-sm font-medium ${textSecondary}`}>Exam Results Status</h3>
                            <div className="h-64 w-full flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={passFailData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {passFailData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.name === "Passed" ? "#10b981" : "#ef4444"} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: isDark ? "#1e293b" : "#fff",
                                                borderColor: isDark ? "#334155" : "#e2e8f0",
                                                borderRadius: "8px",
                                                color: isDark ? "#f1f5f9" : "#0f172a"
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex justify-center gap-4 text-sm">
                                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500"></span> Passed: {passCount}</span>
                                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500"></span> Failed: {failCount}</span>
                            </div>
                        </div>

                        <div className={`rounded-xl border ${border} ${cardBg} p-6 shadow-md col-span-1 lg:col-span-2`}>
                            <h3 className={`mb-4 text-sm font-medium ${textSecondary}`}>Exam Performance Timeline</h3>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={results.filter(r => r.percentage !== null).sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime())}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                                        <XAxis dataKey="examTitle" axisLine={false} tickLine={false} />
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
                                            stroke="#8b5cf6"
                                            strokeWidth={3}
                                            dot={{ r: 4, fill: "#8b5cf6" }}
                                            activeDot={{ r: 6, fill: "#8b5cf6", strokeWidth: 0 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={`rounded-xl border ${border} ${cardBg} p-6 shadow-md`}>
                        <h3 className={`mb-4 text-sm font-medium ${textSecondary}`}>{selectedSubject} Performance Trend</h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={subjectTrendData}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                                    <XAxis dataKey="examTitle" axisLine={false} tickLine={false} />
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
                                        dot={{ r: 4, fill: "#3b82f6" }}
                                        activeDot={{ r: 6, fill: "#3b82f6", strokeWidth: 0 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>

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
                                <th className={`p-4 font-medium ${textSecondary}`}>Marks (Max/Pass)</th>
                                <th className={`p-4 font-medium ${textSecondary}`}>Obtained</th>
                                <th className={`p-4 font-medium ${textSecondary}`}>Percentage</th>
                                <th className={`p-4 font-medium ${textSecondary}`}>Status</th>
                                <th className={`p-4 font-medium ${textSecondary}`} data-html2canvas-ignore="true">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/30">
                            {currentResults.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-slate-500">No exam results found.</td>
                                </tr>
                            ) : (
                                currentResults.map((result) => (
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
                                        <td className={`p-4 ${textSecondary}`}>
                                            <span className="font-semibold text-blue-500">{result.maxMarks}</span> / <span className="text-gray-500">{result.passMarks}</span>
                                        </td>
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
                                        <td className="p-4" data-html2canvas-ignore="true">
                                            {result.marksObtained !== null && (
                                                result.concernStatus === "Pending" ? (
                                                    <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                                                        <AlertTriangle size={14} />
                                                        <span className="text-xs font-semibold">Under Review</span>
                                                    </div>
                                                ) : result.concernStatus === "Resolved" || result.concernStatus === "Rejected" ? (
                                                    <div className="group relative inline-block">
                                                        <div className={`flex items-center gap-1 px-2 py-1 rounded-md cursor-help ${result.concernStatus === "Resolved"
                                                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                            }`}>
                                                            {result.concernStatus === "Resolved" ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                                                            <span className="text-xs font-semibold">{result.concernStatus}</span>
                                                        </div>
                                                        {result.concernResponse && (
                                                            <div className={`absolute bottom-full right-0 mb-2 w-56 p-3 rounded-lg shadow-xl text-xs z-50 hidden group-hover:block transition-opacity opacity-0 group-hover:opacity-100 ${isDark ? "bg-slate-800 border border-slate-600 text-slate-200" : "bg-white border border-gray-200 text-gray-700"
                                                                }`}>
                                                                <p className="font-bold mb-1 border-b pb-1 border-gray-200 dark:border-gray-600">Teacher's Note:</p>
                                                                <p className="leading-relaxed">{result.concernResponse}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    (() => {
                                                        const isExpired = result.updatedAt && (new Date().getTime() - new Date(result.updatedAt).getTime() > 24 * 60 * 60 * 1000);
                                                        return isExpired ? (
                                                            <span className={`text-xs italic ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                                                                Concern Closed
                                                            </span>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleRaiseConcernClick(result)}
                                                                className={`text-xs px-3 py-1.5 rounded-md border font-medium transition-colors ${isDark
                                                                    ? "border-slate-600 hover:bg-slate-700 text-slate-300 bg-slate-800"
                                                                    : "border-slate-300 hover:bg-slate-100 text-slate-600 bg-white"
                                                                    }`}
                                                            >
                                                                Raise Concern
                                                            </button>
                                                        );
                                                    })()
                                                )
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>
            {/* Concern Modal */}
            <Modal isOpen={concernModalOpen} onClose={() => setConcernModalOpen(false)} title="Raise a Concern">
                <div className="space-y-4">
                    <p className={`text-sm ${textSecondary}`}>
                        Describe your concern regarding the exam result for <strong>{selectedExamResult?.subject}</strong>.
                    </p>
                    <textarea
                        className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none ${isDark ? "bg-slate-700 border-slate-600 text-slate-100" : "bg-white border-slate-200 text-slate-900"
                            }`}
                        rows={4}
                        placeholder="Explain why you think the marks might be incorrect..."
                        value={concernText}
                        onChange={(e) => setConcernText(e.target.value)}
                    />
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            onClick={() => setConcernModalOpen(false)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${isDark ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-200 hover:bg-slate-300"}`}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={submitConcern}
                            disabled={submittingConcern || !concernText.trim()}
                            className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {submittingConcern ? "Submitting..." : "Submit Concern"}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};