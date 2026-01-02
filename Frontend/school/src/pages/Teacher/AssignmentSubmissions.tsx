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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                    Assignment Submissions
                </h1>
                <button
                    onClick={() => navigate(-1)}
                    className={`px-4 py-2 rounded-lg transition-colors ${isDark ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-white hover:bg-gray-100 text-gray-700 shadow-sm"
                        }`}
                >
                    Back
                </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {submissions.map((sub) => (
                    <div
                        key={sub.studentId}
                        className={`p-5 rounded-xl border shadow-sm relative ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                            }`}
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-semibold text-lg">{sub.studentName}</h3>
                                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>{sub.admissionNumber}</p>
                            </div>
                            <span
                                className={`px-2 py-1 text-xs rounded-full font-medium ${sub.status === "Graded"
                                    ? "bg-green-100 text-green-700"
                                    : sub.submitted
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {sub.status}
                            </span>
                        </div>

                        {sub.submitted && sub.fileUrl ? (
                            <div className="mb-4">
                                <a
                                    href={`${import.meta.env.VITE_BACKEND_URL}/${sub.fileUrl}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline text-sm flex items-center gap-1"
                                >
                                    📄 View Submission ({sub.fileName})
                                </a>
                                {sub.submissionDate && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Submitted: {new Date(sub.submissionDate).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 italic mb-4">No file submitted</p>
                        )}

                        {(sub.grade !== undefined || sub.badge) && (
                            <div className={`mt-2 p-3 rounded-lg ${isDark ? "bg-gray-700/50" : "bg-gray-50"}`}>
                                {sub.grade !== undefined && <p className="text-sm"><strong>Grade:</strong> {sub.grade}</p>}
                                {sub.badge && <p className="text-sm"><strong>Badge:</strong> {sub.badge}</p>}
                                {sub.feedback && <p className="text-sm mt-1 text-gray-500">"{sub.feedback}"</p>}
                            </div>
                        )}

                        {sub.submitted && (
                            <button
                                onClick={() => handleValidateClick(sub)}
                                className="mt-4 w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
                            >
                                {sub.status === 'Graded' ? 'Update Grade' : 'Validate / Grade'}
                            </button>
                        )}

                        {!sub.submitted && (
                            <button
                                onClick={() => handleValidateClick(sub)}
                                className={`mt-4 w-full py-2 rounded-lg transition-all text-sm font-medium border ${isDark ? "border-gray-600 hover:bg-gray-700" : "border-gray-300 hover:bg-gray-100"
                                    }`}
                            >
                                Mark as Graded (Manual)
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

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Grade / Marks</label>
                                <input
                                    type="number"
                                    value={grade}
                                    onChange={(e) => setGrade(e.target.value)}
                                    className={`w-full p-2 rounded-lg border ${isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                                        }`}
                                    placeholder="Enter marks"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Feedback</label>
                                <textarea
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    className={`w-full p-2 rounded-lg border h-24 resize-none ${isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                                        }`}
                                    placeholder="Write feedback..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Badge</label>
                                <div className="flex gap-2">
                                    {["🏆 Gold", "🥈 Silver", "🥉 Bronze", "⭐ Star"].map((b) => (
                                        <button
                                            key={b}
                                            onClick={() => setBadge(badge === b ? "" : b)}
                                            className={`px-3 py-1.5 rounded-full text-sm border transition-all ${badge === b
                                                ? "bg-blue-100 border-blue-500 text-blue-700"
                                                : isDark
                                                    ? "border-gray-600 hover:bg-gray-700"
                                                    : "border-gray-200 hover:bg-gray-50"
                                                }`}
                                        >
                                            {b}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setSelectedSubmission(null)}
                                className="px-4 py-2 rounded-lg text-sm hover:underline"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    /* logic for resubmit */
                                    if (!selectedSubmission || !id) return;
                                    // Custom handler to set status to 'Resubmit'
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
                                className={`px-4 py-2 border rounded-lg text-sm font-medium ${isDark ? "border-yellow-600 text-yellow-500 hover:bg-yellow-900/20" : "border-yellow-400 text-yellow-700 hover:bg-yellow-50"}`}
                            >
                                Request Resubmit
                            </button>
                            <button
                                onClick={handleSubmitValidation}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                            >
                                Save (Grade)
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
