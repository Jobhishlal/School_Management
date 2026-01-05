import React, { useEffect, useState } from "react";
import type { CreateExamDTO } from "../../../types/ExamCreateDTO";
import type { UpdateExamDTO } from "../../../types/UpdateExam";
import {
  ExamCreate,
  GetAllClass,
  GetAllteacher,
  updateExam,
  GetTeacherExams
} from "../../../services/authapi";
import { getDecodedToken } from "../../../utils/DecodeToken";
import { useTheme } from "../../../components/layout/ThemeContext";
import { showToast } from "../../../utils/toast";
import { Modal } from "../../../components/common/Modal";
import { Plus, Edit, Calendar, Clock, BookOpen, FileText, Eye } from "lucide-react";
import { Pagination } from "../../../components/common/Pagination";
import TakeMarks from "./ExamMarkListOut";

const generateExamId = (): string => {
  const prefix = "EX";
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 9000 + 1000);
  return `${prefix}${timestamp}${randomNum}`;
};

type ExamType = "UNIT_TEST" | "MIDTERM" | "FINAL";

interface Class {
  _id: string;
  className: string;
  division: string;
}

interface Subject {
  _id?: string;
  name: string;
  code?: string;
}

interface Teacher {
  id?: string;
  _id?: string;
  name: string;
  email?: string;
  phone?: string;
  department?: string;
  subjects?: Subject[];
  Subject?: Subject[]; // Handle both cases
}

interface ExamEntity {
  id: string;
  examId: string;
  title: string;
  type: ExamType;
  classId: string;
  className: string;
  division: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  examDate: string;
  startTime: string;
  endTime: string;
  maxMarks: number;
  description?: string;
  status: string;
  pendingConcerns?: number;
  concerns?: Array<{ studentName: string; concern: string; studentId: string }>;
}

const ExamForm: React.FC = () => {
  const { isDark } = useTheme();
  const teacherId = getDecodedToken()?.id;

  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [exams, setExams] = useState<ExamEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<UpdateExamDTO | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [examsPerPage] = useState(5);
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [viewingConcerns, setViewingConcerns] = useState<ExamEntity | null>(null);

  const [form, setForm] = useState<CreateExamDTO | UpdateExamDTO>({
    examId: generateExamId(),
    title: "",
    type: "UNIT_TEST",
    classId: "",
    className: "",
    division: "",
    subject: "",
    teacherId: teacherId || "",
    teacherName: "",
    examDate: "",
    startTime: "",
    endTime: "",
    maxMarks: 100,
    description: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classRes = await GetAllClass();
        console.log("GetAllClass response:", classRes);

        const teacherRes = await GetAllteacher();
        console.log("GetAllteacher response:", teacherRes);

        // Handle if response is wrapped
        const teacherData = teacherRes?.data || teacherRes;
        const teachersList: Teacher[] = Array.isArray(teacherData) ? teacherData : [];

        const examRes: ExamEntity[] = await GetTeacherExams();
        console.log("GetTeacherExams response:", examRes);

        setClasses(classRes.data || []);
        setExams(examRes);

        // Find current teacher - handle both id and _id
        const currentTeacher = teachersList.find(
          (t) => t.id === teacherId || t._id === teacherId
        );

        console.log("Current Logged In Teacher:", currentTeacher);

        if (currentTeacher) {
          // Handle both 'subjects' and 'Subject' property names
          const teacherSubjects = currentTeacher.subjects || currentTeacher.Subject || [];
          console.log("Teacher Subjects:", teacherSubjects);

          setSubjects(teacherSubjects);
          setForm((prev) => ({
            ...prev,
            teacherName: currentTeacher.name,
            teacherId: currentTeacher.id || currentTeacher._id || teacherId || ""
          }));
        } else {
          console.warn("Teacher not found in list. TeacherId:", teacherId);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        showToast("Failed to load data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [teacherId]);

  const handleClassChange = (classId: string) => {
    const cls = classes.find((c) => c._id === classId);
    if (!cls) return;

    setForm((prev) => ({
      ...prev,
      classId: cls._id,
      className: cls.className,
      division: cls.division,
    }));
  };

  const handleTakeMarks = (exam: ExamEntity) => {
    setSelectedExam(exam.id);
    setSelectedClassId(exam.classId);
    setIsViewOnly(false);
  };

  const handleViewExam = (exam: ExamEntity) => {
    setSelectedExam(exam.id);
    setSelectedClassId(exam.classId);
    setIsViewOnly(true);
  };

  const handleEditExam = (exam: ExamEntity) => {
    setEditingExam({
      id: exam.id,
      examId: exam.examId,
      title: exam.title,
      type: exam.type,
      classId: exam.classId,
      className: exam.className,
      division: exam.division,
      subject: exam.subject,
      teacherId: exam.teacherId,
      teacherName: exam.teacherName,
      examDate: exam.examDate.split("T")[0],
      startTime: exam.startTime,
      endTime: exam.endTime,
      maxMarks: exam.maxMarks,
      description: exam.description,
    });

    setForm({
      examId: exam.examId,
      title: exam.title,
      type: exam.type,
      classId: exam.classId,
      className: exam.className,
      division: exam.division,
      subject: exam.subject,
      teacherId: exam.teacherId,
      teacherName: exam.teacherName,
      examDate: exam.examDate.split("T")[0],
      startTime: exam.startTime,
      endTime: exam.endTime,
      maxMarks: exam.maxMarks,
      description: exam.description,
    });

    setIsModalOpen(true);
  };

  const handleOpenModal = () => {
    setEditingExam(null);

    // Preserve teacherName and teacherId when opening modal
    const currentTeacherName = form.teacherName;
    const currentTeacherId = form.teacherId || teacherId || "";

    setForm({
      examId: generateExamId(),
      title: "",
      type: "UNIT_TEST",
      classId: "",
      className: "",
      division: "",
      subject: "",
      teacherId: currentTeacherId,
      teacherName: currentTeacherName,
      examDate: "",
      startTime: "",
      endTime: "",
      maxMarks: 100,
      description: "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    // Validation
    if (!form.title || !form.classId || !form.subject || !form.examDate || !form.startTime || !form.endTime) {
      showToast("Please fill all required fields", "error");
      return;
    }

    try {
      if (editingExam) {
        await updateExam(editingExam.id!, form as UpdateExamDTO);
        showToast("Exam updated successfully");
        setEditingExam(null);
      } else {
        const newExamId = generateExamId();
        const examData = {
          ...form,
          examId: newExamId,
        };

        console.log("Submitting Create Exam Form Data:", examData);
        const data = await ExamCreate(examData as CreateExamDTO);
        console.log("ExamCreate API Response:", data);
        showToast("Exam created successfully");
      }

      setIsModalOpen(false);

      // Refresh exams list
      const updatedExams = await GetTeacherExams();
      setExams(updatedExams);
    } catch (error: any) {
      console.error("Exam submit error:", error);
      const message = error?.response?.data?.message || "Exam operation failed";
      showToast(message, "error");
    }
  };

  const indexOfLastExam = currentPage * examsPerPage;
  const indexOfFirstExam = indexOfLastExam - examsPerPage;
  const currentExams = exams.slice(indexOfFirstExam, indexOfLastExam);
  const totalPages = Math.ceil(exams.length / examsPerPage);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return isDark ? "bg-green-900 text-green-300" : "bg-green-100 text-green-800";
      case "ongoing":
        return isDark ? "bg-blue-900 text-blue-300" : "bg-blue-100 text-blue-800";
      case "upcoming":
        return isDark ? "bg-yellow-900 text-yellow-300" : "bg-yellow-100 text-yellow-800";
      default:
        return isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="text-center">
          <div className={`w-16 h-16 border-4 ${isDark ? "border-blue-500" : "border-blue-600"} border-t-transparent rounded-full animate-spin mx-auto mb-4`}></div>
          <p className={isDark ? "text-white" : "text-gray-900"}>Loading exams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 ${isDark ? "bg-[#121A21] text-white" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              Exam Management
            </h1>
            <p className={`mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Create and manage your exams
            </p>
          </div>
          <button
            onClick={handleOpenModal}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all shadow-lg ${isDark
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
          >
            <Plus className="w-5 h-5" />
            Create Exam
          </button>
        </div>

        <div className={`rounded-xl shadow-lg ${isDark ? "bg-gray-800" : "bg-white"}`}>
          <div className="p-6">
            <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
              My Exams
            </h2>

            {exams.length === 0 ? (
              <div className="text-center py-12">
                <FileText className={`w-16 h-16 mx-auto mb-4 ${isDark ? "text-gray-600" : "text-gray-400"}`} />
                <p className={isDark ? "text-gray-400" : "text-gray-600"}>No exams found</p>
                <button
                  onClick={handleOpenModal}
                  className={`mt-4 px-6 py-2 rounded-lg ${isDark ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
                    } text-white`}
                >
                  Create Your First Exam
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                      <th className={`text-left px-4 py-3 font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Exam ID</th>
                      <th className={`text-left px-4 py-3 font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Title</th>
                      <th className={`text-left px-4 py-3 font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Type</th>
                      <th className={`text-left px-4 py-3 font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Class</th>
                      <th className={`text-left px-4 py-3 font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Subject</th>
                      <th className={`text-left px-4 py-3 font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Date</th>
                      <th className={`text-left px-4 py-3 font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Time</th>
                      <th className={`text-left px-4 py-3 font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Marks</th>
                      <th className={`text-left px-4 py-3 font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Status</th>
                      <th className={`text-center px-4 py-3 font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentExams.map((exam, index) => (
                      <tr
                        key={exam.id}
                        className={`border-b transition-colors ${isDark
                          ? index % 2 === 0
                            ? "bg-gray-800 border-gray-700 hover:bg-gray-750"
                            : "bg-gray-750 border-gray-700 hover:bg-gray-800"
                          : index % 2 === 0
                            ? "bg-white border-gray-200 hover:bg-gray-50"
                            : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                          }`}
                      >
                        <td className={`px-4 py-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                          {exam.examId}
                        </td>
                        <td className={`px-4 py-3 font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                          {exam.title}
                        </td>
                        <td className={`px-4 py-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                          {exam.type.replace("_", " ")}
                        </td>
                        <td className={`px-4 py-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                          {exam.className} - {exam.division}
                        </td>
                        <td className={`px-4 py-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                          {exam.subject}
                        </td>
                        <td className={`px-4 py-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                          {new Date(exam.examDate).toLocaleDateString()}
                        </td>
                        <td className={`px-4 py-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                          {exam.startTime} - {exam.endTime}
                        </td>
                        <td className={`px-4 py-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                          {exam.maxMarks}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(exam.status)}`}>
                            {exam.status || "Scheduled"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleViewExam(exam)}
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${isDark
                                ? "bg-purple-600 hover:bg-purple-700 text-white"
                                : "bg-purple-500 hover:bg-purple-600 text-white"
                                }`}
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </button>

                            <button
                              onClick={() => handleEditExam(exam)}
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${isDark
                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                : "bg-blue-500 hover:bg-blue-600 text-white"
                                }`}
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </button>

                            <div className="relative">
                              <button
                                onClick={() => handleTakeMarks(exam)}
                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${isDark
                                  ? "bg-green-600 hover:bg-green-700 text-white"
                                  : "bg-green-500 hover:bg-green-600 text-white"
                                  }`}
                              >
                                Take Marks
                              </button>
                              <div className="relative group">
                                {(exam.pendingConcerns || 0) > 0 && (
                                  <>
                                    <span
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setViewingConcerns(exam);
                                      }}
                                      className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse shadow-md cursor-pointer hover:scale-110 transition-transform z-10"
                                      title="Click to view pending concerns"
                                    >
                                      {exam.pendingConcerns}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </div>

        <Modal
          title={editingExam ? "Update Exam" : "Create New Exam"}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <div className="space-y-4">
            {/* Debug Info - Remove in production */}
            {subjects.length === 0 && (
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg text-sm">
                <p className="text-yellow-800 dark:text-yellow-200">
                  No subjects found for teacher: <strong>{form.teacherName || "Unknown"}</strong>
                </p>
                <p className="text-xs mt-1 text-yellow-700 dark:text-yellow-300">
                  Teacher ID: {form.teacherId || "Not set"}
                </p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Exam Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  className={`w-full px-4 py-2 rounded-lg border transition-colors ${isDark
                    ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter exam title"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Exam Type *
                </label>
                <select
                  required
                  value={form.type}
                  onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as ExamType }))}
                  className={`w-full px-4 py-2 rounded-lg border transition-colors ${isDark
                    ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="UNIT_TEST">Unit Test</option>
                  <option value="MIDTERM">Midterm</option>
                  <option value="FINAL">Final</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Class *
                </label>
                <select
                  required
                  value={form.classId}
                  onChange={(e) => handleClassChange(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border transition-colors ${isDark
                    ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">Select Class</option>
                  {classes.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.className} - {c.division}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Subject *
                </label>
                <select
                  required
                  value={form.subject}
                  onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                  className={`w-full px-4 py-2 rounded-lg border transition-colors ${isDark
                    ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  disabled={subjects.length === 0}
                >
                  <option value="">
                    {subjects.length === 0 ? "No subjects available" : "Select Subject"}
                  </option>
                  {subjects.map((s) => (
                    <option key={s._id || s.name} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Exam Date *
                </label>
                <input
                  type="date"
                  required
                  value={form.examDate}
                  onChange={(e) => setForm((p) => ({ ...p, examDate: e.target.value }))}
                  className={`w-full px-4 py-2 rounded-lg border transition-colors ${isDark
                    ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  <Clock className="w-4 h-4 inline mr-1" />
                  Start Time *
                </label>
                <input
                  type="time"
                  required
                  value={form.startTime}
                  onChange={(e) => setForm((p) => ({ ...p, startTime: e.target.value }))}
                  className={`w-full px-4 py-2 rounded-lg border transition-colors ${isDark
                    ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  <Clock className="w-4 h-4 inline mr-1" />
                  End Time *
                </label>
                <input
                  type="time"
                  required
                  value={form.endTime}
                  onChange={(e) => setForm((p) => ({ ...p, endTime: e.target.value }))}
                  className={`w-full px-4 py-2 rounded-lg border transition-colors ${isDark
                    ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  <BookOpen className="w-4 h-4 inline mr-1" />
                  Maximum Marks *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={form.maxMarks}
                  onChange={(e) => setForm((p) => ({ ...p, maxMarks: Number(e.target.value) }))}
                  className={`w-full px-4 py-2 rounded-lg border transition-colors ${isDark
                    ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="100"
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Description
              </label>
              <textarea
                rows={3}
                value={form.description || ""}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                className={`w-full px-4 py-2 rounded-lg border transition-colors ${isDark
                  ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                  : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter exam description (optional)"
              />
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${isDark
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                  }`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${isDark
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
              >
                {editingExam ? "Update Exam" : "Create Exam"}
              </button>
            </div>
          </div>
        </Modal>
      </div>

      {/* TakeMarks Modal - Render when exam is selected */}
      {
        selectedExam && selectedClassId && (
          <TakeMarks
            examId={selectedExam}
            classId={selectedClassId}
            isReadOnly={isViewOnly}
            onClose={async () => {
              setSelectedExam(null);
              setSelectedClassId(null);
              setIsViewOnly(false);
              // Refresh exams to update concern counts
              try {
                const updatedExams = await GetTeacherExams();
                setExams(updatedExams);
              } catch (error) {
                console.error("Failed to refresh exams:", error);
              }
            }}
          />
        )
      }

      {/* Concern Details Modal - Replaces the tooltip */}
      <Modal
        title="Student Concerns"
        isOpen={!!viewingConcerns}
        onClose={() => setViewingConcerns(null)}
        className="max-w-md"
      >
        {viewingConcerns && (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${isDark ? "bg-slate-800" : "bg-gray-50"}`}>
              <h4 className={`font-medium mb-3 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                Pending Concerns ({viewingConcerns.pendingConcerns})
              </h4>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                {viewingConcerns.concerns?.map((c, i) => (
                  <div key={i} className={`p-3 rounded border ${isDark ? "bg-slate-700 border-slate-600" : "bg-white border-gray-200"}`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-blue-600 dark:text-blue-400 text-sm">
                        {c.studentName}
                      </span>
                    </div>
                    <p className={`text-sm italic ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                      "{c.concern}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setViewingConcerns(null)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${isDark ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"}`}
              >
                Close
              </button>
              <button
                onClick={() => {
                  const examToResolve = viewingConcerns;
                  setViewingConcerns(null);
                  handleTakeMarks(examToResolve);
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white"
              >
                Resolve Now
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div >
  );
};

export default ExamForm;