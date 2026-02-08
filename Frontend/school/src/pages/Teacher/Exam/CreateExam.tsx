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
  passMarks: number;
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
    passMarks: 40,
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
      passMarks: exam.passMarks,
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
      passMarks: exam.passMarks,
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
      passMarks: 40,
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent`}>
              Exam Management
            </h1>
            <p className={`mt-1 text-sm font-medium ${isDark ? "text-gray-500" : "text-gray-400"}`}>
              Schedule and monitor student assessments
            </p>
          </div>
          <button
            onClick={handleOpenModal}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${isDark
              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-900/20"
              : "bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/20"
              }`}
          >
            <Plus className="w-5 h-5" />
            Create Exam
          </button>
        </div>

        <div className={`rounded-2xl border shadow-sm ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                My Exams
              </h2>
              <div className={`text-xs font-bold px-3 py-1 rounded-full ${isDark ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-500"}`}>
                {exams.length} Total
              </div>
            </div>

            {exams.length === 0 ? (
              <div className="text-center py-12">
                <div className={`w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-2xl ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
                  <FileText className={`w-8 h-8 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
                </div>
                <p className={`font-medium ${isDark ? "text-gray-500" : "text-gray-400"}`}>No exams found</p>
                <button
                  onClick={handleOpenModal}
                  className={`mt-4 px-6 py-2 rounded-lg font-bold text-sm ${isDark ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
                    } text-white`}
                >
                  Create Your First Exam
                </button>
              </div>
            ) : (
              <>
                {/* Mobile View: Card Layout */}
                <div className="grid grid-cols-1 gap-4 lg:hidden">
                  {currentExams.map((exam) => (
                    <div
                      key={exam.id}
                      className={`p-4 rounded-xl border transition-all ${isDark ? "bg-gray-900/50 border-gray-700" : "bg-gray-50 border-gray-200"
                        }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-lg leading-tight">{exam.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-blue-400" : "text-blue-600"}`}>
                              {exam.subject}
                            </span>
                            <span className={`w-1 h-1 rounded-full ${isDark ? "bg-gray-700" : "bg-gray-300"}`} />
                            <span className={`text-[10px] font-bold ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                              {exam.examId}
                            </span>
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 text-[10px] rounded-full font-bold uppercase tracking-wider ${getStatusColor(exam.status)}`}>
                          {exam.status || "Scheduled"}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-5">
                        <div className="space-y-3">
                          <div>
                            <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                              Class
                            </p>
                            <p className="text-sm font-medium">{exam.className} - {exam.division}</p>
                          </div>
                          <div>
                            <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                              Date & Time
                            </p>
                            <p className="text-sm font-medium">{new Date(exam.examDate).toLocaleDateString()}</p>
                            <p className={`text-[11px] mt-0.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                              {exam.startTime} - {exam.endTime}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-3 text-right">
                          <div>
                            <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                              Marks (Max/Pass)
                            </p>
                            <p className="text-sm font-bold">
                              <span className="text-blue-500 font-black">{exam.maxMarks}</span>
                              <span className="mx-1 text-gray-500">/</span>
                              <span className="text-orange-500">{exam.passMarks}</span>
                            </p>
                          </div>
                          <div className="flex justify-end">
                            {(exam.pendingConcerns || 0) > 0 && (
                              <div
                                onClick={() => setViewingConcerns(exam)}
                                className="flex items-center gap-1.5 px-2 py-1 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg animate-pulse cursor-pointer transition-transform active:scale-95"
                              >
                                <span className="text-[10px] font-black">{exam.pendingConcerns} Concerns</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-4 border-t border-dashed border-gray-700/50">
                        <button
                          onClick={() => handleViewExam(exam)}
                          className={`flex-1 min-w-[100px] flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${isDark ? "bg-purple-600/20 text-purple-400 hover:bg-purple-600/30" : "bg-purple-50 text-purple-600 hover:bg-purple-100"
                            }`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                        <button
                          onClick={() => handleEditExam(exam)}
                          className={`flex-1 min-w-[100px] flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${isDark ? "bg-blue-600/20 text-blue-400 hover:bg-blue-600/30" : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                            }`}
                        >
                          <Edit className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleTakeMarks(exam)}
                          className="w-full mt-1 flex items-center justify-center gap-1.5 py-2.5 bg-green-600 text-white rounded-lg text-xs font-black shadow-lg shadow-green-600/20 hover:bg-green-700 transition-all"
                        >
                          Take / Update Marks
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop View: Table */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={`border-b ${isDark ? "border-gray-700 text-gray-400" : "border-gray-100 text-gray-500"}`}>
                        <th className="text-left px-4 py-4 text-xs font-black uppercase tracking-widest">Exam ID</th>
                        <th className="text-left px-4 py-4 text-xs font-black uppercase tracking-widest">Title</th>
                        <th className="text-left px-4 py-4 text-xs font-black uppercase tracking-widest">Type</th>
                        <th className="text-left px-4 py-4 text-xs font-black uppercase tracking-widest">Class</th>
                        <th className="text-left px-4 py-4 text-xs font-black uppercase tracking-widest">Subject</th>
                        <th className="text-left px-4 py-4 text-xs font-black uppercase tracking-widest">Date</th>
                        <th className="text-left px-4 py-4 text-xs font-black uppercase tracking-widest">Time</th>
                        <th className="text-left px-4 py-4 text-xs font-black uppercase tracking-widest">Marks</th>
                        <th className="text-left px-4 py-4 text-xs font-black uppercase tracking-widest">Status</th>
                        <th className="text-center px-4 py-4 text-xs font-black uppercase tracking-widest">Actions</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? "divide-gray-700/50" : "divide-gray-100"}`}>
                      {currentExams.map((exam) => (
                        <tr
                          key={exam.id}
                          className={`group transition-colors ${isDark ? "hover:bg-gray-700/30" : "hover:bg-blue-50/50"}`}
                        >
                          <td className="px-4 py-4 text-sm font-medium text-gray-500">
                            {exam.examId}
                          </td>
                          <td className={`px-4 py-4 font-bold text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
                            {exam.title}
                          </td>
                          <td className="px-4 py-4 text-sm font-medium">
                            {exam.type.replace("_", " ")}
                          </td>
                          <td className="px-4 py-4 text-sm font-medium">
                            {exam.className} - {exam.division}
                          </td>
                          <td className="px-4 py-4 text-sm font-bold text-blue-500">
                            {exam.subject}
                          </td>
                          <td className="px-4 py-4 text-sm font-medium">
                            {new Date(exam.examDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-4 text-sm font-medium">
                            {exam.startTime} - {exam.endTime}
                          </td>
                          <td className="px-4 py-4 text-sm font-bold">
                            <span className="text-blue-500">{exam.maxMarks}</span>
                            <span className="mx-1 text-gray-400">/</span>
                            <span className="text-orange-500">{exam.passMarks}</span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(exam.status)}`}>
                              {exam.status || "Scheduled"}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => handleViewExam(exam)}
                                className={`p-2 rounded-lg transition-all ${isDark ? "bg-gray-700 text-purple-400 hover:bg-purple-400/20" : "bg-purple-50 text-purple-600 hover:bg-purple-100"}`}
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleEditExam(exam)}
                                className={`p-2 rounded-lg transition-all ${isDark ? "bg-gray-700 text-blue-400 hover:bg-blue-400/20" : "bg-blue-50 text-blue-600 hover:bg-blue-100"}`}
                                title="Edit Exam"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <div className="relative">
                                <button
                                  onClick={() => handleTakeMarks(exam)}
                                  className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-black shadow-lg shadow-green-600/20 hover:bg-green-700 transition-all"
                                >
                                  Marks
                                </button>
                                {(exam.pendingConcerns || 0) > 0 && (
                                  <span
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setViewingConcerns(exam);
                                    }}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full animate-pulse shadow-md cursor-pointer hover:scale-110 transition-transform"
                                  >
                                    {exam.pendingConcerns}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
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
          <div className="flex flex-col gap-5">
            {/* Debug Info - Remove in production */}
            {subjects.length === 0 && (
              <div className={`p-4 rounded-xl text-xs flex flex-col gap-1 border ${isDark ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-500" : "bg-yellow-50 border-yellow-100 text-yellow-700"}`}>
                <p className="font-bold">No subjects found for teacher: <span className="opacity-80">{form.teacherName || "Unknown"}</span></p>
                <p className="opacity-60 italic">Teacher ID: {form.teacherId || "Not set"}</p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-5">
              <div>
                <label className={`block text-[10px] font-bold uppercase tracking-wider mb-2 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                  Exam Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  className={`w-full px-4 py-3 rounded-xl border appearance-none transition-all ${isDark
                    ? "bg-gray-700/50 border-gray-600 text-white focus:ring-blue-500/50"
                    : "bg-gray-50 border-gray-200 text-gray-900 focus:ring-blue-500"
                    } focus:outline-none focus:ring-2`}
                  placeholder="e.g. Mathematics Final Exam"
                />
              </div>

              <div>
                <label className={`block text-[10px] font-bold uppercase tracking-wider mb-2 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                  Exam Type *
                </label>
                <div className="relative">
                  <select
                    required
                    value={form.type}
                    onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as ExamType }))}
                    className={`w-full px-4 py-3 rounded-xl border appearance-none transition-all ${isDark
                      ? "bg-gray-700/50 border-gray-600 text-white focus:ring-blue-500/50"
                      : "bg-gray-50 border-gray-200 text-gray-900 focus:ring-blue-500"
                      } focus:outline-none focus:ring-2`}
                  >
                    <option value="UNIT_TEST">Unit Test</option>
                    <option value="MIDTERM">Midterm</option>
                    <option value="FINAL">Final</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                    <Plus className="w-4 h-4 rotate-45" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={`block text-[10px] font-bold uppercase tracking-wider mb-2 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                    Class *
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={form.classId}
                      onChange={(e) => handleClassChange(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border appearance-none transition-all ${isDark
                        ? "bg-gray-700/50 border-gray-600 text-white focus:ring-blue-500/50"
                        : "bg-gray-50 border-gray-200 text-gray-900 focus:ring-blue-500"
                        } focus:outline-none focus:ring-2`}
                    >
                      <option value="">Select Class</option>
                      {classes.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.className} - {c.division}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                      <Plus className="w-4 h-4 rotate-45" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className={`block text-[10px] font-bold uppercase tracking-wider mb-2 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                    Subject *
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={form.subject}
                      onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-xl border appearance-none transition-all ${isDark
                        ? "bg-gray-700/50 border-gray-600 text-white focus:ring-blue-500/50"
                        : "bg-gray-50 border-gray-200 text-gray-900 focus:ring-blue-500"
                        } focus:outline-none focus:ring-2 disabled:opacity-50`}
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
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                      <Plus className="w-4 h-4 rotate-45" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider mb-2 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                    <Calendar className="w-3.5 h-3.5" />
                    Exam Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.examDate}
                    onChange={(e) => setForm((p) => ({ ...p, examDate: e.target.value }))}
                    className={`w-full px-4 py-3 rounded-xl border appearance-none transition-all ${isDark
                      ? "bg-gray-700/50 border-gray-600 text-white focus:ring-blue-500/50"
                      : "bg-gray-50 border-gray-200 text-gray-900 focus:ring-blue-500"
                      } focus:outline-none focus:ring-2`}
                  />
                </div>

                <div>
                  <label className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider mb-2 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                    <Clock className="w-3.5 h-3.5" />
                    Start Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={form.startTime}
                    onChange={(e) => setForm((p) => ({ ...p, startTime: e.target.value }))}
                    className={`w-full px-4 py-3 rounded-xl border appearance-none transition-all ${isDark
                      ? "bg-gray-700/50 border-gray-600 text-white focus:ring-blue-500/50"
                      : "bg-gray-50 border-gray-200 text-gray-900 focus:ring-blue-500"
                      } focus:outline-none focus:ring-2`}
                  />
                </div>

                <div>
                  <label className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider mb-2 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                    <Clock className="w-3.5 h-3.5" />
                    End Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={form.endTime}
                    onChange={(e) => setForm((p) => ({ ...p, endTime: e.target.value }))}
                    className={`w-full px-4 py-3 rounded-xl border appearance-none transition-all ${isDark
                      ? "bg-gray-700/50 border-gray-600 text-white focus:ring-blue-500/50"
                      : "bg-gray-50 border-gray-200 text-gray-900 focus:ring-blue-500"
                      } focus:outline-none focus:ring-2`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider mb-2 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                    <BookOpen className="w-3.5 h-3.5" />
                    Max Marks *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={form.maxMarks}
                    onChange={(e) => setForm((p) => ({ ...p, maxMarks: Number(e.target.value) }))}
                    className={`w-full px-4 py-3 rounded-xl border appearance-none transition-all ${isDark
                      ? "bg-gray-700/50 border-gray-600 text-white focus:ring-blue-500/50"
                      : "bg-gray-50 border-gray-200 text-gray-900 focus:ring-blue-500"
                      } focus:outline-none focus:ring-2`}
                    placeholder="100"
                  />
                </div>

                <div>
                  <label className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider mb-2 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                    <BookOpen className="w-3.5 h-3.5" />
                    Pass Marks *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={form.passMarks}
                    onChange={(e) => setForm((p) => ({ ...p, passMarks: Number(e.target.value) }))}
                    className={`w-full px-4 py-3 rounded-xl border appearance-none transition-all ${isDark
                      ? "bg-gray-700/50 border-gray-600 text-white focus:ring-blue-500/50"
                      : "bg-gray-50 border-gray-200 text-gray-900 focus:ring-blue-500"
                      } focus:outline-none focus:ring-2`}
                    placeholder="40"
                  />
                </div>
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