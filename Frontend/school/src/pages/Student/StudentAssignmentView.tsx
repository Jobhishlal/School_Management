import React, { useEffect, useState } from "react";
import { StudentGetAssignment, StudentProfile } from "../../services/Student/StudentApi";
import { useTheme } from "../../components/layout/ThemeContext";
import { BookOpen, Calendar, Award, Users, FileText, Download, Clock, AlertCircle } from "lucide-react";

interface Attachment {
  _id: string;
  url: string;
  fileName: string;
  uploadedAt: string;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  assignmentDate: string;
  Assignment_Due_Date: string;
  maxMarks: number;
  className: string;
  division: string;
  attachments: Attachment[];
}

export const StudentAssignmentList: React.FC = () => {
  const { isDark } = useTheme();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'overdue'>('all');

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

  const filteredAssignments = assignments.filter((assignment) => {
    const daysLeft = getDaysUntilDue(assignment.Assignment_Due_Date);
    if (filter === "upcoming") return daysLeft >= 0;
    if (filter === "overdue") return daysLeft < 0;
    return true;
  });

  const pageBg = isDark ? "bg-[#121A21]" : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50";
  const cardBg = isDark ? "bg-gray-800" : "bg-white";


  if (loading) {
    return (
      <div className={`min-h-screen ${pageBg} p-6 flex items-center justify-center`}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className={`mt-4 text-gray-600 dark:text-gray-400 font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            Loading assignments...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${pageBg} p-6 flex items-center justify-center`}>
        <div className={`${cardBg} p-8 rounded-2xl shadow-xl max-w-md text-center`}>
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-800"}`}>Error Loading Assignments</h3>
          <p className={`text-gray-600 ${isDark ? "text-gray-400" : ""}`}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${pageBg} p-6 transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              My Assignments
            </h1>
          </div>
          <p className={`ml-16 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Track and manage your coursework</p>
        </div>

        {/* Filter Tabs */}
        <div className={`mb-6 flex gap-2 p-2 rounded-xl shadow-md w-fit ${isDark ? "bg-gray-800" : "bg-white"}`}>
          {["all", "upcoming", "overdue"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as 'all' | 'upcoming' | 'overdue')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                filter === f
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                  : `${isDark ? "text-gray-400 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"}`
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Assignments */}
        {filteredAssignments.length === 0 ? (
          <div className={`${cardBg} rounded-2xl shadow-xl p-12 text-center`}>
            <FileText className={`w-20 h-20 mx-auto mb-4 ${isDark ? "text-gray-600" : "text-gray-300"}`} />
            <h3 className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-800"}`}>No Assignments Found</h3>
            <p className={isDark ? "text-gray-400" : "text-gray-600"}>
              {filter === "all"
                ? "You're all caught up! Check back later for new assignments."
                : filter === "upcoming"
                ? "No upcoming assignments at the moment."
                : "No overdue assignments. Great job!"}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {filteredAssignments.map((assignment) => {
              const daysLeft = getDaysUntilDue(assignment.Assignment_Due_Date);

              return (
                <div
                  key={assignment.id}
                  className={`${cardBg} group rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border ${isDark ? "border-gray-700 hover:border-blue-600" : "border-gray-100 hover:border-blue-300"}`}
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold text-white pr-4 leading-tight">{assignment.title}</h3>
                      {getStatusBadge(assignment.Assignment_Due_Date)}
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-blue-100">
                      <BookOpen className="w-4 h-4" />
                      <span className="text-sm font-medium">{assignment.subject}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4">
                    <p className={`leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>{assignment.description}</p>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Due Date</p>
                          <p className={`font-semibold text-sm ${isDark ? "text-white" : "text-gray-800"}`}>
                            {new Date(assignment.Assignment_Due_Date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-orange-500" />
                        <div>
                          <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Time Left</p>
                          <p className={`font-semibold text-sm ${isDark ? "text-white" : "text-gray-800"}`}>
                            {daysLeft >= 0 ? `${daysLeft} days` : "Overdue"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-green-500" />
                        <div>
                          <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Max Marks</p>
                          <p className={`font-semibold text-sm ${isDark ? "text-white" : "text-gray-800"}`}>{assignment.maxMarks} points</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-purple-500" />
                        <div>
                          <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Class</p>
                          <p className={`font-semibold text-sm ${isDark ? "text-white" : "text-gray-800"}`}>
                            {assignment.className} - {assignment.division}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Attachments */}
                    {assignment.attachments?.length > 0 && (
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className={`text-sm font-semibold mb-3 flex items-center gap-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                          <FileText className="w-4 h-4" />
                          Assignment Details({assignment.attachments.length})
                        </p>
                        <div className="space-y-2">
                          {assignment.attachments.map((att) => (
                            <div
                              key={att._id}
                              className={`flex items-center justify-between p-3 rounded-xl transition-colors ${isDark ? "bg-gray-700/50 hover:bg-gray-700" : "bg-gray-50 hover:bg-gray-100"}`}
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className={`p-2 rounded-lg ${isDark ? "bg-blue-900/30" : "bg-blue-100"}`}>
                                  <FileText className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
                                </div>
                                <span className={`text-sm font-medium truncate ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                                  {att.fileName}
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <a
                                  href={att.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${isDark ? "text-blue-400 hover:bg-blue-900/20" : "text-blue-600 hover:bg-blue-50"}`}
                                >
                                  View
                                </a>
                                <a
                                  href={att.url}
                                  download={att.fileName}
                                  className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1 transition-colors ${isDark ? "text-green-400 hover:bg-green-900/20" : "text-green-600 hover:bg-green-50"}`}
                                >
                                  <Download className="w-3 h-3" />
                                  Download
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
