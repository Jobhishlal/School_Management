// import React, { useState, useEffect } from "react";
// import {
//   createAssignment,
//   GetTimeTable,
//   GetTeachertimetableList,
//   UpdateExistedAssignment,
// } from "../../services/authapi";
// import { type CreateAssignmentDTO } from "../../types/AssignmentCreate";
// import { TextInput } from "../../components/Form/TextInput";
// import { Modal } from "../../components/common/Modal";
// import TeacherAssignmentList from "./TeacherAssignmentList";
// import { showToast } from "../../utils/toast";

// interface FileAttachment {
//   fileObj: File;
//   fileName: string;
//   uploadedAt: Date;
// }

// interface ClassDivision {
//   classId: string;
//   className: string;
//   division: string;
// }

// export default function AssignmentManage() {
//   const [form, setForm] = useState<CreateAssignmentDTO>({
//     id: "",
//     Assignment_Title: "",
//     description: "",
//     subject: "",
//     classId: "",
//     division: "",
//     Assignment_date: new Date(),
//     Assignment_Due_Date: new Date(),
//     maxMarks: 100,
//     teacherId: "",
//     attachments: [],
//   });

//   const [attachments, setAttachments] = useState<FileAttachment[]>([]);
//   const [teacherSubjects, setTeacherSubjects] = useState<string[]>([]);
//   const [classes, setClasses] = useState<ClassDivision[]>([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [currentAssignment, setCurrentAssignment] = useState<CreateAssignmentDTO | null>(null);
//   const [refreshList, setRefreshList] = useState(false);

//   useEffect(() => {
//     const teacherId = localStorage.getItem("accessToken") || "";
//     if (teacherId) setForm((prev) => ({ ...prev, teacherId }));
//   }, []);


//   useEffect(() => {
//     const fetchTeacherInfo = async () => {
//       try {
//         const teacherData = await GetTeachertimetableList();
//         console.log("teacherData",teacherData)
//         if (!teacherData || teacherData.length === 0) return;


//         const subjectsSet = new Set<string>(teacherData[0].subjects);
//         setTeacherSubjects(Array.from(subjectsSet));

//         const classArray: ClassDivision[] = teacherData.map((item: any) => ({
//           classId: item.classId, 
//           className: item.className || "Unknown",
//           division: item.divisions?.[0] || "N/A",
//         }));

//         console.log(" Teacher class list:", classArray);
//         setClasses(classArray);
//       } catch (err) {
//         console.error("Error fetching teacher info:", err);
//       }
//     };

//     fetchTeacherInfo();
//   }, []);


//   useEffect(() => {
//     const fetchSubjects = async () => {
//       if (!form.classId || !form.division || !form.teacherId) return;
//       try {
//         const timetable = await GetTimeTable(form.classId, form.division);
//         console.log("📘 Existing timetable:", timetable);

//         if (!timetable || !timetable.days) return;

//         const subjectsSet = new Set<string>();
//         timetable.days.forEach((day: any) => {
//           day.periods.forEach((period: any) => {
//             if (period.teacherId === form.teacherId) {
//               subjectsSet.add(period.subject);
//             }
//           });
//         });

//         setTeacherSubjects(Array.from(subjectsSet));
//         setForm((prev) => ({ ...prev, subject: "" }));
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchSubjects();
//   }, [form.classId, form.division, form.teacherId]);


//   useEffect(() => {
//     if (currentAssignment) {
//       setForm({
//         ...currentAssignment,
//         Assignment_date: new Date(currentAssignment.Assignment_date),
//         Assignment_Due_Date: new Date(currentAssignment.Assignment_Due_Date),
//         attachments: currentAssignment.attachments || [],
//       });
//       setAttachments(currentAssignment.attachments || []);
//       setIsModalOpen(true);
//     }
//   }, [currentAssignment]);


//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files) return;
//     const newFiles: FileAttachment[] = Array.from(e.target.files).map((file) => ({
//       fileObj: file,
//       fileName: file.name,
//       uploadedAt: new Date(),
//     }));
//     setAttachments(newFiles);
//     setForm((prev) => ({ ...prev, attachments: newFiles }));
//   };


// const handleUpdate = async () => {
//   try {
//     if (!form.id) return showToast("Assignment ID missing");

//     const formData = new FormData();
//     formData.append("Assignment_Title", form.Assignment_Title);
//     formData.append("description", form.description);
//     formData.append("subject", form.subject);
//     formData.append("classId", form.classId);
//     formData.append("division", form.division);
//     formData.append("Assignment_date", new Date(form.Assignment_date).toISOString());
//     formData.append("Assignment_Due_Date", new Date(form.Assignment_Due_Date).toISOString());
//     formData.append("maxMarks", form.maxMarks.toString());
//     formData.append("teacherId", form.teacherId);

//     attachments.forEach(file => formData.append("documents", file.fileObj));

//     const res = await UpdateExistedAssignment(form.id, formData);

//     if (!res.success) {
//       return showToast(res.message || "Failed to update assignment");
//     }

//     showToast(res.message || "Assignment updated successfully!");
//     resetForm();
//     setRefreshList(prev => !prev);
//   } catch (err: any) {
//     console.error(err);

//     showToast(err.response?.data?.message || err.message || "Failed to update assignment");
//   }
// };




// const handleSubmit = async () => {
//   try {
//     const payload = { ...form, teacherId: form.teacherId };
//     const files = attachments.map((att) => att.fileObj);

//     const res = await createAssignment(payload, files);

//     if (res.success === false) {
//       showToast(res.message || "Failed to create assignment");
//       return;
//     }

//     showToast("Assignment created successfully!");
//     resetForm();
//     setRefreshList((prev) => !prev);
//   } catch (err: any) {
//     console.error(err);


//     const message =
//       err.response?.data?.message ||
//       err.message ||
//       "Failed to create assignment";
//       showToast(message);
//   }
// };


//   const resetForm = () => {
//     setForm({
//       id: "",
//       Assignment_Title: "",
//       description: "",
//       subject: "",
//       classId: "",
//       division: "",
//       Assignment_date: new Date(),
//       Assignment_Due_Date: new Date(),
//       maxMarks: 100,
//       teacherId: form.teacherId,
//       attachments: [],
//     });
//     setAttachments([]);
//     setIsModalOpen(false);
//     setCurrentAssignment(null);
//   };

//   return (
//     <div>
//       <button
//         className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
//         onClick={() => setIsModalOpen(true)}
//       >
//         Create Assignment
//       </button>

//       <TeacherAssignmentList
//         setCurrentAssignment={setCurrentAssignment}
//         refreshTrigger={refreshList}
//       />

//       <Modal
//         title={form.id ? "Update Assignment" : "Create Assignment"}
//         isOpen={isModalOpen}
//         onClose={resetForm}
//       >
//         <div className="flex flex-col gap-4">
//           <TextInput
//             label="Title"
//             value={form.Assignment_Title}
//             onChange={(val) => setForm({ ...form, Assignment_Title: val })}
//           />
//           <TextInput
//             label="Description"
//             value={form.description}
//             onChange={(val) => setForm({ ...form, description: val })}
//           />


//           <select
//             value={form.classId}
//             onChange={(e) => {
//               const selectedClass = classes.find((cls) => cls.classId === e.target.value);
//               if (!selectedClass) return;
//               setForm((prev) => ({
//                 ...prev,
//                 classId: selectedClass.classId,
//                 division: selectedClass.division,
//               }));
//             }}
//           >
//             <option value="">Select Class - Division</option>
//             {classes.map((cls) => (
//               <option key={cls.classId} value={cls.classId}>
//                 {cls.className} 
//               </option>
//             ))}
//           </select>

//           <select
//             value={form.subject || ""}
//             onChange={(e) => setForm({ ...form, subject: e.target.value })}
//           >
//             <option value="">Select Subject</option>
//             {teacherSubjects.map((subj) => (
//               <option key={subj} value={subj}>
//                 {subj}
//               </option>
//             ))}
//           </select>

//           <input
//             type="date"
//             value={
//               form.Assignment_date
//                 ? new Date(form.Assignment_date).toISOString().split("T")[0]
//                 : ""
//             }
//             onChange={(e) =>
//               setForm({ ...form, Assignment_date: new Date(e.target.value) })
//             }
//           />

//           <input
//             type="date"
//             value={
//               form.Assignment_Due_Date
//                 ? new Date(form.Assignment_Due_Date).toISOString().split("T")[0]
//                 : ""
//             }
//             onChange={(e) =>
//               setForm({ ...form, Assignment_Due_Date: new Date(e.target.value) })
//             }
//           />

//           <input
//             type="number"
//             value={form.maxMarks}
//             onChange={(e) => setForm({ ...form, maxMarks: Number(e.target.value) })}
//           />

//           <input type="file" multiple onChange={handleFileChange} />

//           <div className="flex justify-end gap-2">
//             <button className="px-4 py-2 bg-gray-300 rounded" onClick={resetForm}>
//               Cancel
//             </button>
//             <button
//               className="px-4 py-2 bg-blue-500 text-white rounded"
//               onClick={form.id ? handleUpdate : handleSubmit}
//             >
//               {form.id ? "Update" : "Create"}
//             </button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// }











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
    const teacherId = localStorage.getItem("accessToken") || "";
    if (teacherId) setForm((prev) => ({ ...prev, teacherId }));
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
        if (!teacherData || teacherData.length === 0) return;

        const allSubjects = new Set<string>();

        teacherData.forEach((item: any) => {
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
        className={`mb-4 px-4 py-2 rounded ${isDark ? "bg-green-600 text-white" : "bg-green-500 text-white"}`}
        onClick={() => setIsModalOpen(true)}
      >
        Create Assignment
      </button>

      <TeacherAssignmentList setCurrentAssignment={setCurrentAssignment} refreshTrigger={refreshList} />

      <Modal
        title={form.id ? "Update Assignment" : "Create Assignment"}
        isOpen={isModalOpen}
        onClose={resetForm}
        className={`${isDark ? "bg-gray-800 text-white" : "bg-white text-black"}`}
      >
        <div className="flex flex-col gap-4">
          <TextInput
            label="Title"
            value={form.Assignment_Title}
            onChange={(val) => setForm({ ...form, Assignment_Title: val })}
            className={isDark ? "bg-gray-700 text-white" : ""}
          />
          <TextInput
            label="Description"
            value={form.description}
            onChange={(val) => setForm({ ...form, description: val })}
            className={isDark ? "bg-gray-700 text-white" : ""}
          />

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
            className={`${isDark ? "bg-gray-700 text-white" : "bg-white text-black"} px-2 py-1 rounded`}
          >
            <option value="">Select Class - Division</option>
            {classes.map((cls, idx) => (
              <option key={`${cls.classId}-${cls.division}-${idx}`} value={`${cls.classId}|${cls.division}`}>
                {cls.className} - {cls.division}
              </option>
            ))}
          </select>

          <select
            value={form.subject || ""}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className={`${isDark ? "bg-gray-700 text-white" : "bg-white text-black"} px-2 py-1 rounded`}
          >
            <option value="">Select Subject</option>
            {teacherSubjects.map((subj) => (
              <option key={subj} value={subj}>
                {subj}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={form.Assignment_date ? new Date(form.Assignment_date).toISOString().split("T")[0] : ""}
            onChange={(e) => setForm({ ...form, Assignment_date: new Date(e.target.value) })}
            className={`${isDark ? "bg-gray-700 text-white" : "bg-white text-black"} px-2 py-1 rounded`}
          />

          <input
            type="date"
            value={form.Assignment_Due_Date ? new Date(form.Assignment_Due_Date).toISOString().split("T")[0] : ""}
            onChange={(e) => setForm({ ...form, Assignment_Due_Date: new Date(e.target.value) })}
            className={`${isDark ? "bg-gray-700 text-white" : "bg-white text-black"} px-2 py-1 rounded`}
          />

          <input
            type="number"
            value={form.maxMarks}
            onChange={(e) => setForm({ ...form, maxMarks: Number(e.target.value) })}
            className={`${isDark ? "bg-gray-700 text-white" : "bg-white text-black"} px-2 py-1 rounded`}
          />

          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className={`${isDark ? "text-white" : ""}`}
          />

          <div className="flex justify-end gap-2">
            <button className="px-4 py-2 bg-gray-300 rounded" onClick={resetForm}>
              Cancel
            </button>
            <button
              className={`px-4 py-2 rounded ${isDark ? "bg-blue-600 text-white" : "bg-blue-500 text-white"}`}
              onClick={form.id ? handleUpdate : handleSubmit}
            >
              {form.id ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
