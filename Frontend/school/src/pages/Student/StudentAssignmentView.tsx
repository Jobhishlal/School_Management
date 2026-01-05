import React, { useEffect, useState } from "react";
import { StudentGetAssignment, StudentProfile, StudentSubmitAssignment } from "../../services/Student/StudentApi";
import { useTheme } from "../../components/layout/ThemeContext";
import { BookOpen, Calendar, Award, Users, FileText, Clock, AlertCircle, Upload, X } from "lucide-react";
import { showToast } from "../../utils/toast";
import { Pagination } from "../../components/common/Pagination";

interface Attachment {
  _id: string;
  url: string;
  fileName: string;
  uploadedAt: string;
}

interface SubmittedFile {
  _id: string;
  url: string;
  fileName: string;
  uploadedAt: string;
  studentDescription?: string;
  grade?: number;
  feedback?: string;
  badge?: string;
  status?: string;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  Assignment_date: string;
  Assignment_Due_Date: string;
  maxMarks: number;
  className: string;
  division: string;
  attachments: Attachment[];
  assignmentSubmitFile?: SubmittedFile[];
}

export const StudentAssignmentList: React.FC = () => {
  const { isDark } = useTheme();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'overdue'>('all');
  const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File[] }>({});
  const [studentDescription, setStudentDescription] = useState<{ [key: string]: string }>({});
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [expandedAssignment, setExpandedAssignment] = useState<string | null>(null);

  // Subject Filter State
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const uniqueSubjects = Array.from(new Set(assignments.map(a => a.subject)));

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchProfileAndAssignments = async () => {
      try {
        setLoading(true);
        setError(null);

        const profileRes = await StudentProfile();
        const studentData = profileRes?.data?.data;

        const studentId = studentData?.id || studentData?._id;
        if (!studentId) {
          setError("Student profile not found");
          setLoading(false);
          return;
        }

        const assignmentsRes = await StudentGetAssignment(studentId);
        const assignmentsArray = Array.isArray(assignmentsRes) ? assignmentsRes : assignmentsRes?.data || [];

        setAssignments(assignmentsArray);
      } catch (err: any) {
        console.error("Error fetching assignments:", err);
        setError(err?.message || "Failed to load assignments");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndAssignments();
  }, []);

  const pageBg = isDark ? "bg-[#121A21]" : "bg-slate-50";
  const cardBg = isDark ? "bg-slate-800/50" : "bg-white";
  const borderColor = isDark ? "border-slate-700" : "border-slate-200";

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatusBadge = (dueDate: string) => {
    const daysLeft = getDaysUntilDue(dueDate);

    if (daysLeft < 0) {
      return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Overdue</span>;
    } else if (daysLeft <= 3) {
      return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">Due Soon</span>;
    } else {
      return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Active</span>;
    }
  };

  const filteredAssignments = assignments
    .filter((assignment) => {
      const daysLeft = getDaysUntilDue(assignment.Assignment_Due_Date);
      const matchesSubject = selectedSubject === "all" || assignment.subject === selectedSubject;

      if (!matchesSubject) return false;

      if (filter === "upcoming") return daysLeft >= 0;
      if (filter === "overdue") return daysLeft < 0;
      return true;
    })
    .sort((a, b) => new Date(b.Assignment_date).getTime() - new Date(a.Assignment_date).getTime());

  // Pagination Logic
  const totalPages = Math.ceil(filteredAssignments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAssignments = filteredAssignments.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFileChange = (assignmentId: string, files: FileList | null) => {
    if (files) {
      setSelectedFiles(prev => ({
        ...prev,
        [assignmentId]: Array.from(files)
      }));
    }
  };

  const removeFile = (assignmentId: string, index: number) => {
    setSelectedFiles(prev => ({
      ...prev,
      [assignmentId]: prev[assignmentId].filter((_, i) => i !== index)
    }));
  };

  const handleSubmitAssignment = async (assignmentId: string) => {
    try {
      const profileRes = await StudentProfile();
      const studentId = profileRes?.data?.data?.id || profileRes?.data?.data?._id;
      if (!studentId) {
        showToast("Student profile not found", "error");
        return;
      }

      const files = selectedFiles[assignmentId] || [];
      if (files.length === 0) {
        showToast("Please select at least one file", "error");
        return;
      }

      setSubmittingId(assignmentId);

      const description = studentDescription[assignmentId] || "";
      await StudentSubmitAssignment(studentId, assignmentId, files, description);

      showToast("Assignment submitted successfully!", "success");

      setSelectedFiles(prev => ({ ...prev, [assignmentId]: [] }));
      setStudentDescription(prev => ({ ...prev, [assignmentId]: "" }));
      setSubmittingId(null);

      const assignmentsRes = await StudentGetAssignment(studentId);
      const assignmentsArray = Array.isArray(assignmentsRes) ? assignmentsRes : assignmentsRes?.data || [];
      setAssignments(assignmentsArray);
    } catch (err) {
      console.error(err);
      showToast("Submission failed!", "error");
      setSubmittingId(null);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${pageBg} p-6 flex items-center justify-center`}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className={`mt-4 font-medium ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            Loading assignments...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${pageBg} p-6 flex items-center justify-center`}>
        <div className={`${cardBg} p-8 rounded-xl shadow-xl max-w-md text-center border ${borderColor}`}>
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-800"}`}>Error Loading Assignments</h3>
          <p className={isDark ? "text-slate-400" : "text-slate-600"}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${pageBg} p-4 sm:p-8 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className={`text-3xl font-bold mb-1 ${isDark ? "text-slate-100" : "text-slate-900"}`}>
            Assignment Management
          </h2>
          <p className={isDark ? "text-slate-400" : "text-slate-600"}>
            Track and manage your coursework
          </p>
        </div>

        {/* Filters Container */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          {/* Status Filter Tabs */}
          <div className={`flex border-b ${borderColor} w-full md:w-auto`}>
            {["all", "upcoming", "overdue"].map((f) => (
              <button
                key={f}
                onClick={() => {
                  setFilter(f as 'all' | 'upcoming' | 'overdue');
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 font-medium transition-all ${filter === f
                  ? `border-b-2 border-blue-500 ${isDark ? "text-blue-400" : "text-blue-600"}`
                  : isDark ? "text-slate-400 hover:text-slate-300" : "text-slate-600 hover:text-slate-800"
                  }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Subject Filter Dropdown */}
          <div className="w-full md:w-64">
            <select
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                setCurrentPage(1);
              }}
              className={`w-full px-4 py-2 rounded-lg border appearance-none cursor-pointer ${isDark
                ? "bg-slate-800 border-slate-700 text-slate-200 focus:border-blue-500"
                : "bg-white border-slate-300 text-slate-700 focus:border-blue-500"
                } focus:outline-none focus:ring-1 focus:ring-blue-500`}
            >
              <option value="all">All Subjects</option>
              {uniqueSubjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Assignments */}
        {filteredAssignments.length === 0 ? (
          <div className={`${cardBg} rounded-xl shadow-xl p-12 text-center border ${borderColor}`}>
            <FileText className={`w-20 h-20 mx-auto mb-4 ${isDark ? "text-slate-600" : "text-slate-300"}`} />
            <h3 className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-800"}`}>No Assignments Found</h3>
            <p className={isDark ? "text-slate-400" : "text-slate-600"}>
              {filter === "all"
                ? "You're all caught up! Check back later for new assignments."
                : filter === "upcoming"
                  ? "No upcoming assignments at the moment."
                  : "No overdue assignments. Great job!"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentAssignments.map((assignment) => {
              const daysLeft = getDaysUntilDue(assignment.Assignment_Due_Date);
              const isExpanded = expandedAssignment === assignment.id;
              const assignmentFiles = selectedFiles[assignment.id] || [];
              const hasSubmission = assignment.assignmentSubmitFile && assignment.assignmentSubmitFile.length > 0;
              const needsResubmit = assignment.assignmentSubmitFile?.some(f => f.status === 'Resubmit');

              return (
                <div
                  key={assignment.id}
                  className={`${cardBg} rounded-xl shadow-lg border ${borderColor} overflow-hidden transition-all duration-300`}
                >
                  {/* Assignment Header */}
                  <div
                    className={`p-6 cursor-pointer ${isDark ? "hover:bg-slate-700/50" : "hover:bg-slate-50"}`}
                    onClick={() => setExpandedAssignment(isExpanded ? null : assignment.id)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-2">
                          <div className={`p-2 rounded-lg ${isDark ? "bg-blue-900/30" : "bg-blue-100"}`}>
                            <BookOpen className={`w-5 h-5 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
                          </div>
                          <div className="flex-1">
                            <h3 className={`text-xl font-bold mb-1 ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                              {assignment.title}
                            </h3>
                            <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                              {assignment.subject}
                            </p>
                          </div>
                        </div>
                      </div>
                      {getStatusBadge(assignment.Assignment_Due_Date)}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className={`w-4 h-4 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
                        <div>
                          <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-500"}`}>Due Date</p>
                          <p className={`font-semibold text-sm ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                            {new Date(assignment.Assignment_Due_Date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className={`w-4 h-4 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
                        <div>
                          <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-500"}`}>Time Left</p>
                          <p className={`font-semibold text-sm ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                            {daysLeft >= 0 ? `${daysLeft} days` : "Overdue"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Award className={`w-4 h-4 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
                        <div>
                          <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-500"}`}>Max Marks</p>
                          <p className={`font-semibold text-sm ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                            {assignment.maxMarks} pts
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Users className={`w-4 h-4 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
                        <div>
                          <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-500"}`}>Class</p>
                          <p className={`font-semibold text-sm ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                            {assignment.className}-{assignment.division}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className={`border-t ${borderColor} p-6 space-y-6`}>
                      {/* Assignment Information */}
                      <div>
                        <h4 className={`text-lg font-semibold mb-3 ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                          Assignment Information
                        </h4>
                        <p className={`leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                          {assignment.description}
                        </p>
                      </div>

                      {/* Assignment Details (Attachments) */}
                      {assignment.attachments?.length > 0 && (
                        <div>
                          <h4 className={`text-lg font-semibold mb-3 ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                            Assignment Details
                          </h4>
                          <div className="space-y-2">
                            {assignment.attachments.map((att) => (
                              <div
                                key={att._id}
                                className={`flex items-center justify-between p-3 rounded-lg ${isDark ? "bg-slate-700/50" : "bg-slate-50"}`}
                              >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <FileText className={`w-5 h-5 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
                                  <span className={`text-sm font-medium truncate ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                                    {att.fileName}
                                  </span>
                                </div>
                                <div className="flex gap-2">
                                  <a
                                    href={att.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${isDark
                                      ? "text-slate-300 hover:bg-slate-600"
                                      : "text-slate-700 hover:bg-slate-200"
                                      }`}
                                  >
                                    Download File
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Submission Form */}
                      {(!hasSubmission || needsResubmit) && (
                        <div className={`border-t ${borderColor} pt-6`}>
                          <h4 className={`text-lg font-semibold mb-4 ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                            Submission Form
                          </h4>

                          {/* File Upload */}
                          <div className="mb-4">
                            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                              File Upload
                            </label>
                            <div className={`border-2 border-dashed rounded-lg p-6 text-center ${isDark ? "border-slate-600 bg-slate-700/30" : "border-slate-300 bg-slate-50"}`}>
                              <input
                                type="file"
                                id={`file-upload-${assignment.id}`}
                                multiple
                                onChange={(e) => handleFileChange(assignment.id, e.target.files)}
                                className="hidden"
                              />
                              <label
                                htmlFor={`file-upload-${assignment.id}`}
                                className="cursor-pointer"
                              >
                                <Upload className={`w-8 h-8 mx-auto mb-2 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
                                <p className={`text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                                  Choose File
                                </p>
                                <p className={`text-xs mt-1 ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                                  or drag and drop files here
                                </p>
                              </label>
                            </div>

                            {/* Selected Files */}
                            {assignmentFiles.length > 0 && (
                              <div className="mt-3 space-y-2">
                                {assignmentFiles.map((file, index) => (
                                  <div
                                    key={index}
                                    className={`flex items-center justify-between p-2 rounded ${isDark ? "bg-slate-700/50" : "bg-slate-100"}`}
                                  >
                                    <span className={`text-sm truncate flex-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                                      {file.name}
                                    </span>
                                    <button
                                      onClick={() => removeFile(assignment.id, index)}
                                      className={`p-1 rounded hover:bg-red-500/20 ${isDark ? "text-red-400" : "text-red-600"}`}
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Notes/Comments */}
                          <div className="mb-4">
                            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                              Notes/Comments
                            </label>
                            <textarea
                              value={studentDescription[assignment.id] || ""}
                              onChange={(e) => setStudentDescription(prev => ({
                                ...prev,
                                [assignment.id]: e.target.value
                              }))}
                              rows={4}
                              placeholder="Add any notes or comments about your submission..."
                              className={`w-full px-3 py-2 rounded-lg border ${isDark
                                ? "bg-slate-700/50 border-slate-600 text-slate-200 placeholder-slate-500"
                                : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                          </div>

                          {/* Submit Button */}
                          <div className="flex gap-3">
                            <button
                              onClick={() => setExpandedAssignment(null)}
                              className={`px-4 py-2 rounded-lg font-medium transition-colors ${isDark
                                ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                                }`}
                            >
                              Resubmit
                            </button>
                            <button
                              onClick={() => handleSubmitAssignment(assignment.id)}
                              disabled={submittingId === assignment.id || assignmentFiles.length === 0}
                              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${submittingId === assignment.id || assignmentFiles.length === 0
                                ? isDark ? "bg-slate-700 text-slate-500 cursor-not-allowed" : "bg-slate-200 text-slate-400 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                                }`}
                            >
                              {submittingId === assignment.id ? "Submitting..." : "Submit"}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Status & Feedback */}
                      {hasSubmission && (
                        <div className={`border-t ${borderColor} pt-6`}>
                          <h4 className={`text-lg font-semibold mb-4 ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                            Status & Feedback
                          </h4>

                          {assignment.assignmentSubmitFile?.map((file, idx) => (
                            <div
                              key={idx}
                              className={`p-4 rounded-lg border mb-3 ${isDark ? "bg-slate-700/30 border-slate-600" : "bg-slate-50 border-slate-200"
                                }`}
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                  <FileText className={`w-5 h-5 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
                                  <div>
                                    <p className={`font-medium text-sm ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                                      {file.fileName}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span
                                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${file.status === 'Graded'
                                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                          : file.status === 'Resubmit'
                                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                          }`}
                                      >
                                        {file.status || 'Submitted'}
                                      </span>
                                      <span className={`text-xs ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                                        {new Date(file.uploadedAt).toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <a
                                  href={`${import.meta.env.VITE_BACKEND_URL}/${file.url}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${isDark
                                    ? "bg-slate-700 hover:bg-slate-600 text-slate-300"
                                    : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200"
                                    }`}
                                >
                                  Download File
                                </a>
                              </div>

                              {(file.grade !== undefined || file.badge || file.feedback) && (
                                <div className={`mt-3 pt-3 border-t ${isDark ? "border-slate-600" : "border-slate-200"}`}>
                                  <div className="flex flex-wrap gap-4 mb-2">
                                    {file.badge && (
                                      <div className="flex items-center gap-1.5">
                                        <Award className="w-4 h-4 text-yellow-500" />
                                        <span className={`text-sm font-medium ${isDark ? "text-yellow-400" : "text-yellow-700"}`}>
                                          {file.badge} Badge
                                        </span>
                                      </div>
                                    )}
                                    {file.grade !== undefined && (
                                      <div className="flex items-center gap-1.5">
                                        <Award className="w-4 h-4 text-green-500" />
                                        <span className={`text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                                          Grade: <span className="font-bold">{file.grade}</span>/{assignment.maxMarks}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  {file.feedback && (
                                    <div className={`mt-2`}>
                                      <p className={`text-sm font-semibold mb-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                                        Feedback:
                                      </p>
                                      <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                                        {file.feedback}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Pagination */}
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};