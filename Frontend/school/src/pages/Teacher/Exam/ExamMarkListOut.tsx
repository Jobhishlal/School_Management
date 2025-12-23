import React, { useState, useEffect } from "react";
import { getStudentsByExam, ExamMarkcreate } from "../../../services/authapi";
import { showToast } from "../../../utils/toast";
import { Modal } from "../../../components/common/Modal";
import { useTheme } from "../../../components/layout/ThemeContext";

interface Student {
  _id: string;
  name: string;
  studentId: string;
  classId: string; 
}

interface ExamMark {
  studentId: string;
  marksObtained: number;
  progress?: "EXCELLENT" | "GOOD" | "NEEDS_IMPROVEMENT" | "POOR";
  remarks?: string;
}

interface TakeMarksProps {
  examId: string;
  classId: string; 
  onClose: () => void;
}

const TakeMarks: React.FC<TakeMarksProps> = ({ examId, classId, onClose }) => {
  const { isDark } = useTheme();
  const [students, setStudents] = useState<Student[]>([]);
  const [marks, setMarks] = useState<ExamMark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await getStudentsByExam(examId);
        console.log("Fetched students:", res);

        const mappedStudents = (res || []).map((student: any) => ({
          _id: student.id,
          name: student.fullName,
          studentId: student.classDetails?.studentId || "N/A",
          classId: student.classId,
        }));

        setStudents(mappedStudents);

        
        setMarks(
          mappedStudents.map((student:any) => ({
            studentId: student._id,
            marksObtained: 0,
            remarks: "",
          }))
        );
      } catch (err) {
        showToast("Failed to fetch students", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [examId]);

  const handleMarksChange = (studentId: string, value: number) => {
    setMarks((prev) =>
      prev.map((m) =>
        m.studentId === studentId ? { ...m, marksObtained: value } : m
      )
    );
  };

  const handleRemarksChange = (studentId: string, value: string) => {
    setMarks((prev) =>
      prev.map((m) => (m.studentId === studentId ? { ...m, remarks: value } : m))
    );
  };

  const handleSubmit = async () => {
    try {
      for (const mark of marks) {
        await ExamMarkcreate({
          examId,
          classId,
          studentId: mark.studentId,
          marksObtained: mark.marksObtained,
          progress:
            mark.marksObtained >= 90
              ? "EXCELLENT"
              : mark.marksObtained >= 70
              ? "GOOD"
              : mark.marksObtained >= 50
              ? "NEEDS_IMPROVEMENT"
              : "POOR",
          remarks: mark.remarks || "",
        });
      }
      showToast("Marks submitted successfully");
      onClose();
    } catch (err) {
      showToast("Failed to submit marks", "error");
    }
  };

  if (loading) return <div>Loading students...</div>;

  return (
    <Modal title="Take Marks" isOpen={true} onClose={onClose}>
      <div className="space-y-4">
        {students.map((student) => {
          const studentMark = marks.find((m) => m.studentId === student._id);
          return (
            <div
              key={student._id}
              className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b py-2 ${
                isDark ? "border-slate-700" : "border-gray-200"
              }`}
            >
              <div className="flex-1">
                <span className="font-medium">{student.name}</span> (
                {student.studentId})
              </div>

              <input
                type="number"
                min={0}
                max={100}
                value={studentMark?.marksObtained || 0}
                onChange={(e) =>
                  handleMarksChange(student._id, Number(e.target.value))
                }
                className={`w-20 px-2 py-1 border rounded ${
                  isDark
                    ? "bg-slate-700 border-slate-600 text-slate-100"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />

              <textarea
                value={studentMark?.remarks || ""}
                onChange={(e) => handleRemarksChange(student._id, e.target.value)}
                placeholder="Enter remarks"
                className={`w-full md:w-60 px-2 py-1 border rounded ${
                  isDark
                    ? "bg-slate-700 border-slate-600 text-slate-100"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
            </div>
          );
        })}

        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
          >
            Submit Marks
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TakeMarks;
