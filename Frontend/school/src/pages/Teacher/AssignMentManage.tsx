import React, { useState, useEffect } from "react";
import {
  createAssignment,
  GetTimeTable,
  GetTeachertimetableList,
  UpdateExistedAssignment,
  GetAllClassesAPI,
} from "../../services/authapi";
import { type CreateAssignmentDTO } from "../../types/AssignmentCreate";
import { TextInput } from "../../components/Form/TextInput";
import { Modal } from "../../components/common/Modal";
import TeacherAssignmentList from "./TeacherAssignmentList";
import { showToast } from "../../utils/toast";
import { useTheme } from "../../components/layout/ThemeContext";
import { jwtDecode } from "jwt-decode";

interface FileAttachment {
  fileObj: File;
  fileName: string;
  uploadedAt: Date;
}

interface ClassDivision {
  classId: string;
  className: string;
  division: string;
}

interface DecodedToken {
  id: string;
  role: string;
}

export default function AssignmentManage() {
  const { isDark } = useTheme();
  const [form, setForm] = useState<CreateAssignmentDTO>({
    id: "",
    Assignment_Title: "",
    description: "",
    subject: "",
    classId: "",
    division: "",
    Assignment_date: new Date(),
    Assignment_Due_Date: new Date(),
    maxMarks: 100,
    teacherId: "",
    attachments: [],
  });

  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [teacherSubjects, setTeacherSubjects] = useState<string[]>([]);
  const [classes, setClasses] = useState<ClassDivision[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState<CreateAssignmentDTO | null>(null);
  const [refreshList, setRefreshList] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);

        if (decoded.id) {
          setForm((prev) => ({ ...prev, teacherId: decoded.id }));
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchTeacherInfo = async () => {
      try {
        const allClassesData = await GetAllClassesAPI();
        if (allClassesData && Array.isArray(allClassesData)) {
          const mappedClasses: ClassDivision[] = allClassesData.map((c: any) => ({
            classId: c._id,
            className: c.className,
            division: c.division
          }));
          setClasses(mappedClasses);
        }

        const teacherData = await GetTeachertimetableList();


        const timetableList = teacherData?.timetable;

        if (!timetableList || !Array.isArray(timetableList)) return;

        const allSubjects = new Set<string>();

        timetableList.forEach((item: any) => {
          // Aggregate subjects
          if (item.subjects && Array.isArray(item.subjects)) {
            item.subjects.forEach((s: string) => allSubjects.add(s));
          }
        });

        setTeacherSubjects(Array.from(allSubjects));
      } catch (err) {
        console.error("Error fetching teacher info:", err);
      }
    };

    fetchTeacherInfo();
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!form.classId || !form.division || !form.teacherId) return;
      try {
        const timetable = await GetTimeTable(form.classId, form.division);
        if (!timetable || !timetable.days) return;

        const subjectsSet = new Set<string>();
        timetable.days.forEach((day: any) => {
          day.periods.forEach((period: any) => {
            if (period.teacherId === form.teacherId) {
              subjectsSet.add(period.subject);
            }
          });
        });

        setTeacherSubjects(Array.from(subjectsSet));
        setForm((prev) => ({ ...prev, subject: "" }));
      } catch (err) {
        console.error(err);
      }
    };
    fetchSubjects();
  }, [form.classId, form.division, form.teacherId]);

  useEffect(() => {
    if (currentAssignment) {
      setForm({
        ...currentAssignment,
        Assignment_date: new Date(currentAssignment.Assignment_date),
        Assignment_Due_Date: new Date(currentAssignment.Assignment_Due_Date),
        attachments: currentAssignment.attachments || [],
      });
      setAttachments(currentAssignment.attachments || []);
      setIsModalOpen(true);
    }
  }, [currentAssignment]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles: FileAttachment[] = Array.from(e.target.files).map((file) => ({
      fileObj: file,
      fileName: file.name,
      uploadedAt: new Date(),
    }));
    setAttachments(newFiles);
    setForm((prev) => ({ ...prev, attachments: newFiles }));
  };

  const handleUpdate = async () => {
    try {
      if (!form.id) return showToast("Assignment ID missing");

      const formData = new FormData();
      formData.append("Assignment_Title", form.Assignment_Title);
      formData.append("description", form.description);
      formData.append("subject", form.subject);
      formData.append("classId", form.classId);
      formData.append("division", form.division);
      formData.append("Assignment_date", new Date(form.Assignment_date).toISOString());
      formData.append("Assignment_Due_Date", new Date(form.Assignment_Due_Date).toISOString());
      formData.append("maxMarks", form.maxMarks.toString());
      formData.append("teacherId", form.teacherId);

      attachments.forEach((file) => formData.append("documents", file.fileObj));

      const res = await UpdateExistedAssignment(form.id, formData);

      if (!res.success) return showToast(res.message || "Failed to update assignment");

      showToast(res.message || "Assignment updated successfully!");
      resetForm();
      setRefreshList((prev) => !prev);
    } catch (err: any) {
      console.error(err);
      showToast(err.response?.data?.message || err.message || "Failed to update assignment");
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = { ...form, teacherId: form.teacherId };
      const files = attachments.map((att) => att.fileObj);

      const res = await createAssignment(payload, files);

      if (!res.success) return showToast(res.message || "Failed to create assignment");

      showToast("Assignment created successfully!");
      resetForm();
      setRefreshList((prev) => !prev);
    } catch (err: any) {
      console.error(err);
      showToast(err.response?.data?.message || err.message || "Failed to create assignment");
    }
  };

  const resetForm = () => {
    setForm({
      id: "",
      Assignment_Title: "",
      description: "",
      subject: "",
      classId: "",
      division: "",
      Assignment_date: new Date(),
      Assignment_Due_Date: new Date(),
      maxMarks: 100,
      teacherId: form.teacherId,
      attachments: [],
    });
    setAttachments([]);
    setIsModalOpen(false);
    setCurrentAssignment(null);
  };

  return (
    <div className={`${isDark ? "bg-[#121A21] text-white min-h-screen" : "bg-white text-black min-h-screen"} p-4`}>
      <button
        className={`mb-6 w-full sm:w-auto px-6 py-3 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${isDark ? "bg-green-600 text-white hover:bg-green-700" : "bg-green-500 text-white hover:bg-green-600"}`}
        onClick={() => setIsModalOpen(true)}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
        Create New Assignment
      </button>

      <TeacherAssignmentList
        setCurrentAssignment={(assignment) => {
          setCurrentAssignment({
            ...assignment,
            Assignment_date: new Date(assignment.Assignment_date),
            Assignment_Due_Date: new Date(assignment.Assignment_Due_Date),
            // Note: attachments from backend cannot be converted to File objects.
            // You might need to adjust logic if you want to show existing attachments.
            attachments: []
          });
        }}
        refreshTrigger={refreshList}
      />

      <Modal
        title={form.id ? "Update Assignment" : "Create Assignment"}
        isOpen={isModalOpen}
        onClose={resetForm}
        className={`${isDark ? "bg-gray-800 text-white" : "bg-white text-black"}`}
      >
        <div className="flex flex-col gap-5 p-1 sm:p-2">
          <TextInput
            label="Title"
            value={form.Assignment_Title}
            onChange={(val) => setForm({ ...form, Assignment_Title: val })}
            className={`w-full ${isDark ? "bg-gray-700 text-white border-gray-600 focus:ring-blue-500/50" : "bg-gray-50 border-gray-200 focus:ring-blue-500"}`}
          />
          <TextInput
            label="Description"
            value={form.description}
            onChange={(val) => setForm({ ...form, description: val })}
            className={`w-full ${isDark ? "bg-gray-700 text-white border-gray-600 focus:ring-blue-500/50" : "bg-gray-50 border-gray-200 focus:ring-blue-500"}`}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                Class - Division
              </label>
              <select
                value={form.classId && form.division ? `${form.classId}|${form.division}` : ""}
                onChange={(e) => {
                  const val = e.target.value;
                  if (!val) return;
                  const [cId, div] = val.split("|");

                  setForm((prev) => ({
                    ...prev,
                    classId: cId,
                    division: div,
                  }));
                }}
                className={`w-full px-4 py-2.5 text-sm rounded-lg border focus:outline-none focus:ring-2 transition-all ${isDark ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500/50" : "bg-white border-gray-200 text-black focus:ring-blue-500"
                  }`}
              >
                <option value="">Select Class</option>
                {classes.map((cls, idx) => (
                  <option key={`${cls.classId}-${cls.division}-${idx}`} value={`${cls.classId}|${cls.division}`}>
                    {cls.className} - {cls.division}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                Subject
              </label>
              <select
                value={form.subject || ""}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className={`w-full px-4 py-2.5 text-sm rounded-lg border focus:outline-none focus:ring-2 transition-all ${isDark ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500/50" : "bg-white border-gray-200 text-black focus:ring-blue-500"
                  }`}
              >
                <option value="">Select Subject</option>
                {teacherSubjects.map((subj) => (
                  <option key={subj} value={subj}>
                    {subj}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                Start Date
              </label>
              <input
                type="date"
                value={form.Assignment_date ? new Date(form.Assignment_date).toISOString().split("T")[0] : ""}
                onChange={(e) => setForm({ ...form, Assignment_date: new Date(e.target.value) })}
                className={`w-full px-4 py-2.5 text-sm rounded-lg border focus:outline-none focus:ring-2 transition-all ${isDark ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500/50" : "bg-white border-gray-200 text-black focus:ring-blue-500"
                  }`}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                Due Date
              </label>
              <input
                type="date"
                value={form.Assignment_Due_Date ? new Date(form.Assignment_Due_Date).toISOString().split("T")[0] : ""}
                onChange={(e) => setForm({ ...form, Assignment_Due_Date: new Date(e.target.value) })}
                className={`w-full px-4 py-2.5 text-sm rounded-lg border focus:outline-none focus:ring-2 transition-all ${isDark ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500/50" : "bg-white border-gray-200 text-black focus:ring-blue-500"
                  }`}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-gray-500" : "text-gray-500"}`}>
              Max Marks
            </label>
            <input
              type="number"
              value={form.maxMarks}
              onChange={(e) => setForm({ ...form, maxMarks: Number(e.target.value) })}
              className={`w-full px-4 py-2.5 text-sm rounded-lg border focus:outline-none focus:ring-2 transition-all ${isDark ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500/50" : "bg-white border-gray-200 text-black focus:ring-blue-500"
                }`}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-gray-500" : "text-gray-500"}`}>
              Attachments
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className={`w-full text-xs cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold ${isDark ? "text-gray-300 file:bg-gray-700 file:text-blue-400 hover:file:bg-gray-600" : "text-gray-600 file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                }`}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
            <button
              className={`order-2 sm:order-1 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${isDark ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              onClick={resetForm}
            >
              Cancel
            </button>
            <button
              className="order-1 sm:order-2 px-8 py-2.5 rounded-lg text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all"
              onClick={form.id ? handleUpdate : handleSubmit}
            >
              {form.id ? "Update Assignment" : "Create Assignment"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
