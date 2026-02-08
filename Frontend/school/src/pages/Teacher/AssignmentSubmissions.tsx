import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAssignmentSubmissions, validateAssignment } from "../../services/authapi";
import { useTheme } from "../../components/layout/ThemeContext";
import { toast } from "react-toastify";

interface Submission {
    studentId: string;
    studentName: string;
    admissionNumber: string;
    submitted: boolean;
    submissionDate?: string;
    fileUrl?: string;
    fileName?: string;
    grade?: number;
    feedback?: string;
    badge?: string;
    status: string;
}

export default function AssignmentSubmissions() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

    // Validation Form State
    const [grade, setGrade] = useState<number | string>("");
    const [feedback, setFeedback] = useState("");
    const [badge, setBadge] = useState("");

    useEffect(() => {
        fetchSubmissions();
    }, [id]);

    const fetchSubmissions = async () => {
        try {
            setLoading(true);
            if (id) {
                const res = await getAssignmentSubmissions(id);
                setSubmissions(res.data);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch submissions");
        } finally {
            setLoading(false);
        }
    };

    const handleValidateClick = (sub: Submission) => {
        setSelectedSubmission(sub);
        setGrade(sub.grade || "");
        setFeedback(sub.feedback || "");
        setBadge(sub.badge || "");
    };

    const handleSubmitValidation = async () => {
        if (!selectedSubmission || !id) return;

        try {
            await validateAssignment({
                assignmentId: id,
                studentId: selectedSubmission.studentId,
                grade: Number(grade),
                feedback,
                badge,
            });
            toast.success("Assignment validated successfully");
            setSelectedSubmission(null);
            fetchSubmissions();
        } catch (error) {
            console.error(error);
            toast.error("Failed to validate assignment");
        }
    };

    if (loading) return <div className="p-8 text-center">Loading submissions...</div>;

    return (
        <div className={`min-h-screen p-6 ${isDark ? "bg-[#121A21] text-white" : "bg-gray-50 text-gray-900"}`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-1">
                        Submissions
                    </h1>
                    <p className={`text-sm font-medium ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                        Track and Grade Student Assignments
                    </p>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className={`w-full sm:w-auto px-6 py-2.5 rounded-xl transition-all font-bold text-sm shadow-sm flex items-center justify-center gap-2 ${isDark ? "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700" : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"
                        }`}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to List
                </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {submissions.map((sub) => (
                    <div
                        key={sub.studentId}
                        className={`p-5 rounded-xl border shadow-sm relative ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                            }`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg leading-tight">{sub.studentName}</h3>
                                <p className={`text-xs font-bold uppercase tracking-wider mt-0.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}>{sub.admissionNumber}</p>
                            </div>
                            <span
                                className={`px-2.5 py-1 text-[10px] rounded-full font-bold uppercase tracking-wider ${sub.status === "Graded"
                                    ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                                    : sub.submitted
                                        ? "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                                        : "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                                    }`}
                            >
                                {sub.status}
                            </span>
                        </div>

                        {sub.submitted && sub.fileUrl ? (
                            <div className="mb-5">
                                <a
                                    href={`${import.meta.env.VITE_BACKEND_URL}/${sub.fileUrl}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`p-3 rounded-lg border flex items-center gap-3 transition-all ${isDark ? "bg-gray-700/30 border-gray-600 hover:bg-gray-700/50" : "bg-blue-50/50 border-blue-100 hover:bg-blue-50"}`}
                                >
                                    <div className={`p-2 rounded-lg ${isDark ? "bg-blue-500/10" : "bg-blue-100"}`}>
                                        <svg className={`w-5 h-5 ${isDark ? "text-blue-400" : "text-blue-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold truncate underline decoration-blue-500/30">View {sub.fileName}</p>
                                        {sub.submissionDate && (
                                            <p className={`text-[10px] font-medium ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                                                Submitted {new Date(sub.submissionDate).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                </a>
                            </div>
                        ) : (
                            <div className={`mb-5 p-3 rounded-lg border border-dashed flex items-center gap-3 ${isDark ? "bg-red-500/5 border-red-900/30 text-red-400/50" : "bg-red-50/30 border-red-100 text-red-400"}`}>
                                <svg className="w-5 h-5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                <p className="text-xs font-bold uppercase tracking-widest">Pending Submission</p>
                            </div>
                        )}

                        {(sub.grade !== undefined || sub.badge) && (
                            <div className={`mt-2 p-4 rounded-xl border ${isDark ? "bg-gray-700/20 border-gray-700" : "bg-gray-50 border-gray-100"}`}>
                                <div className="flex flex-wrap gap-4">
                                    {sub.grade !== undefined && (
                                        <div>
                                            <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}>Grade</p>
                                            <p className="text-sm font-bold">{sub.grade}</p>
                                        </div>
                                    )}
                                    {sub.badge && (
                                        <div>
                                            <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}>Badge</p>
                                            <p className="text-sm font-bold">{sub.badge}</p>
                                        </div>
                                    )}
                                </div>
                                {sub.feedback && (
                                    <div className="mt-3">
                                        <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>Feedback</p>
                                        <p className={`text-xs italic leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}>"{sub.feedback}"</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {sub.submitted && (
                            <button
                                onClick={() => handleValidateClick(sub)}
                                className="mt-6 w-full py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all text-sm font-bold"
                            >
                                {sub.status === 'Graded' ? 'Update Grade' : 'Grade Submission'}
                            </button>
                        )}

                        {!sub.submitted && (
                            <button
                                onClick={() => handleValidateClick(sub)}
                                className={`mt-6 w-full py-2.5 rounded-xl transition-all text-sm font-bold border ${isDark ? "border-gray-700 hover:bg-gray-800 text-gray-400" : "border-gray-200 hover:bg-gray-50 text-gray-500"
                                    }`}
                            >
                                Manual Grade
                            </button>
                        )}

                    </div>
                ))}
            </div>

            {selectedSubmission && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div
                        className={`w-full max-w-md rounded-2xl p-6 shadow-2xl ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                            }`}
                    >
                        <h2 className="text-xl font-bold mb-4">Validate {selectedSubmission.studentName}</h2>

                        <div className="space-y-6">
                            <div>
                                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? "text-gray-500" : "text-gray-500"}`}>Grade / Marks</label>
                                <input
                                    type="number"
                                    value={grade}
                                    onChange={(e) => setGrade(e.target.value)}
                                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all ${isDark ? "bg-gray-700/50 border-gray-600 text-white focus:ring-blue-500/50" : "bg-gray-50 border-gray-200 text-gray-900 focus:ring-blue-500"
                                        }`}
                                    placeholder="Enter marks"
                                />
                            </div>

                            <div>
                                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? "text-gray-500" : "text-gray-500"}`}>Feedback</label>
                                <textarea
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    className={`w-full px-4 py-3 rounded-xl border h-32 resize-none focus:outline-none focus:ring-2 transition-all ${isDark ? "bg-gray-700/50 border-gray-600 text-white focus:ring-blue-500/50" : "bg-gray-50 border-gray-200 text-gray-900 focus:ring-blue-500"
                                        }`}
                                    placeholder="Provide detailed feedback..."
                                />
                            </div>

                            <div>
                                <label className={`block text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? "text-gray-500" : "text-gray-500"}`}>Badge Award</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {["🏆 Gold", "🥈 Silver", "🥉 Bronze", "⭐ Star"].map((b) => (
                                        <button
                                            key={b}
                                            onClick={() => setBadge(badge === b ? "" : b)}
                                            className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-all ${badge === b
                                                ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20"
                                                : isDark
                                                    ? "bg-gray-700/50 border-gray-600 text-gray-400 hover:bg-gray-700"
                                                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                                                }`}
                                        >
                                            {b}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 mt-8">
                            <button
                                onClick={handleSubmitValidation}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all"
                            >
                                Save Assessment
                            </button>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        /* logic for resubmit */
                                        if (!selectedSubmission || !id) return;
                                        validateAssignment({
                                            assignmentId: id,
                                            studentId: selectedSubmission.studentId,
                                            grade: Number(grade),
                                            feedback,
                                            badge,
                                            status: 'Resubmit'
                                        }).then(() => {
                                            toast.success("Resubmission requested");
                                            setSelectedSubmission(null);
                                            fetchSubmissions();
                                        }).catch((err) => {
                                            console.error(err);
                                            toast.error("Failed to request resubmission");
                                        });
                                    }}
                                    className={`flex-1 py-2.5 border rounded-xl text-xs font-bold transition-all ${isDark ? "border-yellow-600/50 text-yellow-500 hover:bg-yellow-600/10" : "border-yellow-400 text-yellow-700 hover:bg-yellow-50"}`}
                                >
                                    Request Resubmit
                                </button>
                                <button
                                    onClick={() => setSelectedSubmission(null)}
                                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${isDark ? "bg-gray-700 text-gray-400 hover:bg-gray-600" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
