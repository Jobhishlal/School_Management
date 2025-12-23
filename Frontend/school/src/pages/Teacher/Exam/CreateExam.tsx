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
import { Plus, Edit, Calendar, Clock, BookOpen, FileText } from "lucide-react";
import { Pagination } from "../../../components/common/Pagination";
import TakeMarks from "./ExamMarkListOut";
import ClassWiseExamList from "./ClassWiseWIthExamResult";
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
}

interface Teacher {
  id: string;
  name: string;
  Subject?: Subject[];
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
 const [viewMode, setViewMode] = useState<"NONE" | "TAKE_MARKS" | "CLASS_RESULT">("NONE");



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
        const teacherRes: Teacher[] = await GetAllteacher();
        const examRes: ExamEntity[] = await GetTeacherExams();


        setClasses(classRes.data || []);
        setExams(examRes);

        const currentTeacher = teacherRes.find((t) => t.id === teacherId);
        if (currentTeacher) {
          setSubjects(currentTeacher.Subject || []);
          setForm((prev) => ({ ...prev, teacherName: currentTeacher.name }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [teacherId]);

const handleTakeMarks = (exam: ExamEntity) => {
  setSelectedExam(exam.id);
  setSelectedClassId(exam.classId);
  setViewMode("TAKE_MARKS");
};


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
    setForm({
      examId: generateExamId(),
      title: "",
      type: "UNIT_TEST",
      classId: "",
      className: "",
      division: "",
      subject: "",
      teacherId: teacherId || "",
      teacherName: form.teacherName,
      examDate: "",
      startTime: "",
      endTime: "",
      maxMarks: 100,
      description: "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingExam) {
        await updateExam(editingExam.id!, form as UpdateExamDTO);
        showToast("Exam updated successfully");
        setEditingExam(null);
      } else {
        setForm((prev) => ({ ...prev, examId: generateExamId() }));
        await ExamCreate(form as CreateExamDTO);
        showToast("Exam created successfully");
      }

      setIsModalOpen(false);
      setExams(await GetTeacherExams());
    } catch (error: any) {
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
        return isDark ? "bg-slate-900 border-slate-700" : "bg-blue-100 text-blue-800";
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
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all shadow-lg ${
              isDark 
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
                  className={`mt-4 px-6 py-2 rounded-lg ${
                    isDark ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
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
                        className={`border-b transition-colors ${
                          isDark
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
   <td className="px-4 py-3 text-center flex justify-center gap-2">


         <button
           onClick={() => handleEditExam(exam)}
           className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium ${
      isDark
        ? "bg-blue-600 hover:bg-blue-700 text-white"
        : "bg-blue-500 hover:bg-blue-600 text-white"
    }`}
  >
    <Edit className="w-4 h-4" />
    Edit
  </button>


  <button
    onClick={() => handleTakeMarks(exam)}
    className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium ${
      isDark
        ? "bg-green-600 hover:bg-green-700 text-white"
        : "bg-green-500 hover:bg-green-600 text-white"
    }`}
  >
    Take Marks
  </button>

       <button
  onClick={() => {
    setSelectedExam(exam.id);    
    setViewMode("CLASS_RESULT");
  }}
  className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium ${
    isDark
      ? "bg-purple-600 hover:bg-purple-700 text-white"
      : "bg-purple-500 hover:bg-purple-600 text-white"
  }`}
>
  View Results
</button>


         </td>


                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={(page) => setCurrentPage(page)}
/>
        </div>

        <Modal 
          title={editingExam ? "Update Exam" : "Create New Exam"}
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
        >
            <div className="space-y-4">
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
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                      isDark
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
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                      isDark
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
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                      isDark
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
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                        : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="">Select Subject</option>
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
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                      isDark
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
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                      isDark
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
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                      isDark
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
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                      isDark
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
                  className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                    isDark
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
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    isDark
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    isDark
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
    {selectedExam && selectedClassId && (
  <TakeMarks
    examId={selectedExam}
    classId={selectedClassId}
    onClose={() => {
      setSelectedExam(null);
      setSelectedClassId(null);
    }}
  />
)}
{viewMode === "CLASS_RESULT" && selectedExam && (
  <ClassWiseExamList examId={selectedExam}/>
)}

  
     
    </div>
    
  
  );
};

export default ExamForm;


