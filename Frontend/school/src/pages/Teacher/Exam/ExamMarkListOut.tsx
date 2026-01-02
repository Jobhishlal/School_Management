import React, { useState, useEffect } from "react";
import { getStudentsByExam, ExamMarkcreate, getClassExamResults, updateExamMark } from "../../../services/authapi";
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
  description?: string; // Should match DTO if needed
  isExisting?: boolean; // To track if we should update or create
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
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Fetch all students for the exam
        const studentsRes = await getStudentsByExam(examId);

        // 2. Fetch existing marks for the exam
        let existingMarks: any[] = [];
        try {
          existingMarks = await getClassExamResults(examId) || [];
        } catch (e) {
          console.warn("Could not fetch existing marks", e);
        }

        const mappedStudents = (studentsRes || []).map((student: any) => ({
          _id: student._id || student.id,
          name: student.fullName || student.name,
          studentId: student.studentId || "N/A",
          classId: student.classId || "Unknown",
        }));

        setStudents(mappedStudents);

        // 3. Initialize marks state, pre-filling if exists
        const initialMarks = mappedStudents.map((student: Student) => {
          const foundMark = existingMarks.find((em: any) => em.studentId === student._id);
          if (foundMark) {
            return {
              studentId: student._id,
              marksObtained: foundMark.marksObtained,
              remarks: foundMark.remarks || "",
              isExisting: true
            };
          }
          return {
            studentId: student._id,
            marksObtained: 0,
            remarks: "",
            isExisting: false
          };
        });

        setMarks(initialMarks);

      } catch (err) {
        console.error("Error fetching data:", err);
        showToast("Failed to fetch students/marks", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [examId]);

  const handleMarksChange = (studentId: string, value: number) => {
    let validValue = value;
    if (validValue < 0) validValue = 0;
    if (validValue > 100) validValue = 100;

    setMarks((prev) => {
      return prev.map((m) =>
        m.studentId === studentId ? { ...m, marksObtained: validValue } : m
      );
    });
  };

  const handleRemarksChange = (studentId: string, value: string) => {
    setMarks((prev) =>
      prev.map((m) =>
        m.studentId === studentId ? { ...m, remarks: value } : m
      )
    );
  };

  const handleSubmit = async () => {
    try {
      // Validate
      for (const mark of marks) {
        if (mark.marksObtained < 0 || mark.marksObtained > 100) {
          showToast(`Invalid marks. Must be between 0-100.`, "error");
          return;
        }
      }

      // Submit each mark
      for (const mark of marks) {
        const payload = {
          examId,
          classId, // Only needed for create? Update might ignore it but safe to pass
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
        };

        if (mark.isExisting) {
          await updateExamMark(payload);
        } else {
          // Only create if marks > 0 or if you want to allow 0 marks creation?
          // Usually we submit all.
          // But if a student was absent/not marked, creating 0 might be desired or not.
          // Let's assume we submit everything.
          await ExamMarkcreate(payload);
        }
      }

      showToast("Marks saved successfully");
      onClose();
    } catch (err: any) {
      console.error("Error submitting marks:", err);
      const message = err?.response?.data?.message || "Failed to submit marks";
      showToast(message, "error");
    }
  };

  if (loading) {
    return (
      <Modal title="Take Marks" isOpen={true} onClose={onClose}>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className={`w-12 h-12 border-4 ${isDark ? "border-blue-500" : "border-blue-600"} border-t-transparent rounded-full animate-spin mx-auto mb-4`}></div>
            <p>Loading data...</p>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal title="Take / Update Marks" isOpen={true} onClose={onClose}>
      <div className="space-y-4">
        {students.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No students found in this class
          </div>
        ) : (
          <>
            <div className={`text-sm mb-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Total Students: {students.length}
            </div>

            {students.map((student) => {
              const studentMark = marks.find((m) => m.studentId === student._id);

              return (
                <div
                  key={student._id}
                  className={`flex flex-col md:flex-row items-start md:items-center gap-4 border-b pb-4 ${isDark ? "border-slate-700" : "border-gray-200"
                    }`}
                >
                  <div className="flex-1">
                    <div className="font-medium">
                      {student.name}
                    </div>
                    <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      Roll No: {student.studentId}
                    </div>
                    {studentMark?.isExisting && (
                      <span className="text-xs text-green-500 font-semibold">Existing Mark</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <label className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      Marks:
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={studentMark?.marksObtained || 0} // handle undefined
                      placeholder="0"
                      onChange={(e) => {
                        const val = e.target.value === "" ? 0 : Number(e.target.value);
                        handleMarksChange(student._id, val);
                      }}
                      className={`w-20 px-3 py-2 border rounded-lg ${isDark
                        ? "bg-slate-700 border-slate-600 text-slate-100"
                        : "bg-white border-gray-300 text-gray-900"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      / 100
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <label className={`text-sm mb-1 block ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      Remarks:
                    </label>
                    <textarea
                      value={studentMark?.remarks || ""}
                      onChange={(e) =>
                        handleRemarksChange(student._id, e.target.value)
                      }
                      placeholder="Enter remarks"
                      rows={2}
                      className={`w-full px-3 py-2 border rounded-lg ${isDark
                        ? "bg-slate-700 border-slate-600 text-slate-100"
                        : "bg-white border-gray-300 text-gray-900"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                </div>
              );
            })}
          </>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${isDark
              ? "bg-gray-700 hover:bg-gray-600 text-white"
              : "bg-gray-200 hover:bg-gray-300 text-gray-900"
              }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={students.length === 0}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${isDark
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Save Marks
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TakeMarks;