import React, { useState, useEffect } from "react";
import { getStudentsByExam, ExamMarkcreate, updateExamMark, ResolveExamConcern } from "../../../services/authapi";
import type { StudentProgress } from "../../../types/CreateExamMarkDto";
import { showToast } from "../../../utils/toast";
import { Modal } from "../../../components/common/Modal";
import { useTheme } from "../../../components/layout/ThemeContext";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

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
  concern?: string;
  concernStatus?: "Pending" | "Resolved" | "Rejected";
  concernResponse?: string;
  examMarkId?: string;
}

interface TakeMarksProps {
  examId: string;
  classId: string;
  onClose: () => void;
  isReadOnly?: boolean;
}

const TakeMarks: React.FC<TakeMarksProps> = ({ examId, classId, onClose, isReadOnly = false }) => {
  const { isDark } = useTheme();
  const [students, setStudents] = useState<Student[]>([]);
  const [marks, setMarks] = useState<ExamMark[]>([]);
  const [loading, setLoading] = useState(true);

  // Concern Resolution State (local)
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [responseModal, setResponseModal] = useState<{
    isOpen: boolean;
    examMarkId: string;
    status: "Resolved" | "Rejected";
    studentId: string;
  } | null>(null);
  const [responseMessage, setResponseMessage] = useState("");

  useEffect(() => {
    // ... (existing useEffect code remains same, no need to repeat unless changing)
    // Wait, I cannot skip the useEffect body if I am replacing the block where it resides. 
    // But here I am replacing lines 41-142 which encompasses useEffect.
    // I should be careful. `handleResolveConcern` is at line 121.
    // State declaration is at 41.
    // I will target specific blocks instead of the whole file. 
    // This tool call is for STATE and HANDLERS.
  }, []); // placeholder for thought process, not actual code

  // I will split this into smaller edits.
  // Edit 1: State declarations.
  // Edit 2: handleResolveConcern update.
  // Edit 3: New confirm handler.
  // Edit 4: Modal JSX.

  // Let's do Edit 1 & 2 & 3 in one go if contiguous? No, they are separated by useEffect.
  // I will use replace_file_content carefully. 

  // Actually, I can just replace `handleResolveConcern` and add the new handler below it.
  // And add state at the top.

  // Let's just do state first.


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Fetch all students for the exam (includes mark info now)
        const studentsRes = await getStudentsByExam(examId);

        const mappedStudents = (studentsRes || []).map((student: any) => ({
          _id: student._id || student.id,
          name: student.fullName || student.name,
          studentId: student.studentId || "N/A",
          classId: student.classId || "Unknown",
          // Backend now marks existing marks
          isMarked: student.isMarked,
          originalMark: student.marksObtained,
          originalRemarks: student.remarks,
          concern: student.concern,
          concernStatus: student.concernStatus,
          concernResponse: student.concernResponse,
          examMarkId: student.examMarkId
        }));

        setStudents(mappedStudents);

        // 2. Initialize marks state
        const initialMarks = mappedStudents.map((student: any) => {
          if (student.isMarked) {
            return {
              studentId: student._id,
              marksObtained: student.originalMark,
              remarks: student.originalRemarks === "-" ? "" : student.originalRemarks, // Handle default dash
              isExisting: true,
              concern: student.concern,
              concernStatus: student.concernStatus,
              examMarkId: student.examMarkId
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

  const handleResolveConcern = (examMarkId: string | undefined, status: "Resolved" | "Rejected", studentId: string) => {
    if (!examMarkId) return;
    setResponseModal({
      isOpen: true,
      examMarkId,
      status,
      studentId
    });
    setResponseMessage(""); // Reset message
  };

  const handleConfirmResolve = async () => {
    if (!responseModal) return;
    const { examMarkId, status, studentId } = responseModal;

    if (status === "Rejected" && !responseMessage.trim()) {
      showToast("Please provide a reason for rejection", "error");
      return;
    }

    try {
      setResolvingId(examMarkId);
      await ResolveExamConcern(examMarkId, status, undefined, responseMessage);
      showToast(`Concern marked as ${status}`);

      // Update local state
      setMarks(prev => prev.map(m =>
        m.studentId === studentId ? { ...m, concernStatus: status } : m
      ));

      setResponseModal(null); // Close modal
    } catch (error: any) {
      console.error("Error resolving concern:", error);
      showToast("Failed to resolve concern", "error");
    } finally {
      setResolvingId(null);
    }
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
          classId,
          studentId: mark.studentId,
          marksObtained: mark.marksObtained,
          progress: (mark.marksObtained >= 90
            ? "EXCELLENT"
            : mark.marksObtained >= 70
              ? "GOOD"
              : mark.marksObtained >= 50
                ? "NEEDS_IMPROVEMENT"
                : "POOR") as StudentProgress,
          remarks: mark.remarks || "",
        };

        if (mark.isExisting) {
          await updateExamMark(payload);
        } else {
     
          await ExamMarkcreate(payload);
        }
      }

      showToast("Marks saved successfully","success");
      onClose();
    } catch (err: any) {
      console.error("Error submitting marks:", err);
      const message = err?.response?.data?.message || "Failed to submit marks";
      showToast(message, "error");
    }
  };

  if (loading) {
    // ... (existing loading render)
    return (
      <Modal title={isReadOnly ? "View Marks" : "Take Marks"} isOpen={true} onClose={onClose}>
        {/* ... (existing loading spinner) */}
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
    <>
      <Modal title={isReadOnly ? "View Marks" : "Take / Update Marks"} isOpen={true} onClose={onClose}>
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
                    className={`flex flex-col gap-4 border-b pb-6 ${isDark ? "border-slate-700" : "border-gray-200"
                      }`}
                  >
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                      <div className="flex-1">
                        <div className="font-medium">
                          {student.name}
                        </div>
                        <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                          Roll No: {student.studentId}
                        </div>
                        {studentMark?.isExisting && !isReadOnly && (
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
                          disabled={isReadOnly}
                          onChange={(e) => {
                            const val = e.target.value === "" ? 0 : Number(e.target.value);
                            handleMarksChange(student._id, val);
                          }}
                          className={`w-20 px-3 py-2 border rounded-lg ${isDark
                            ? "bg-slate-700 border-slate-600 text-slate-100"
                            : "bg-white border-gray-300 text-gray-900"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500 ${isReadOnly ? "opacity-70 cursor-not-allowed" : ""}`}
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
                          placeholder={isReadOnly ? "No remarks" : "Enter remarks"}
                          rows={1}
                          disabled={isReadOnly}
                          className={`w-full px-3 py-2 border rounded-lg ${isDark
                            ? "bg-slate-700 border-slate-600 text-slate-100"
                            : "bg-white border-gray-300 text-gray-900"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500 ${isReadOnly ? "opacity-70 cursor-not-allowed" : ""}`}
                        />
                      </div>
                    </div>

                    {/* Concern Section */}
                    {studentMark?.concern && (
                      <div className={`mt-2 p-3 rounded-lg border ${isDark ? "bg-slate-800/50 border-slate-700" : "bg-orange-50 border-orange-100"}`}>
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <AlertTriangle size={14} className="text-orange-500" />
                                <span className={`text-sm font-semibold ${isDark ? "text-orange-400" : "text-orange-700"}`}>
                                  Student Concern:
                                </span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${studentMark.concernStatus === "Pending" ? "bg-orange-100 text-orange-700" :
                                  studentMark.concernStatus === "Resolved" ? "bg-green-100 text-green-700" :
                                    "bg-red-100 text-red-700"
                                  }`}>
                                  {studentMark.concernStatus || "Pending"}
                                </span>
                              </div>
                              <p className={`text-sm italic ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                                "{studentMark.concern}"
                              </p>
                            </div>
                            {studentMark.concernStatus === "Pending" && !isReadOnly && (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleResolveConcern(studentMark.examMarkId, "Resolved", student._id)}
                                  disabled={!!resolvingId}
                                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 text-xs font-semibold transition-colors"
                                  title="Resolve Concern"
                                >
                                  <CheckCircle size={14} />
                                  Resolve
                                </button>
                                <button
                                  onClick={() => handleResolveConcern(studentMark.examMarkId, "Rejected", student._id)}
                                  disabled={!!resolvingId}
                                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 text-xs font-semibold transition-colors"
                                  title="Reject Concern"
                                >
                                  <XCircle size={14} />
                                  Reject
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Show Teacher Response if available */}
                          {studentMark.concernResponse && (
                            <div className={`mt-2 pt-2 border-t ${isDark ? "border-slate-700" : "border-orange-200"}`}>
                              <span className={`text-xs font-semibold block mb-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                Your Response:
                              </span>
                              <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                                {studentMark.concernResponse}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

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
              {isReadOnly ? "Close" : "Cancel"}
            </button>
            {!isReadOnly && (
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
            )}
          </div>
        </div>
      </Modal>

      {/* Response Modal */}
      {responseModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md p-6 rounded-xl shadow-2xl ${isDark ? "bg-gray-800" : "bg-white"}`}>
            <h3 className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
              {responseModal.status === "Resolved" ? "Resolve Concern" : "Reject Concern"}
            </h3>

            <p className={`mb-4 text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              {responseModal.status === "Resolved"
                ? "You are about to mark this concern as resolved. Optionally, leave a message for the student."
                : "You are rejecting this concern. Please explain why."}
            </p>

            <textarea
              value={responseMessage}
              onChange={(e) => setResponseMessage(e.target.value)}
              placeholder={responseModal.status === "Rejected" ? "Reason for rejection (Required)" : "Response message (Optional)"}
              rows={4}
              className={`w-full p-3 rounded-lg border mb-4 focus:ring-2 focus:ring-blue-500 outline-none ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                }`}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setResponseModal(null)}
                className={`px-4 py-2 rounded-lg font-medium ${isDark ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmResolve}
                disabled={!!resolvingId || (responseModal.status === "Rejected" && !responseMessage.trim())}
                className={`px-4 py-2 rounded-lg font-medium text-white ${responseModal.status === "Resolved"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
                  } disabled:opacity-50`}
              >
                {resolvingId ? "Processing..." : `Confirm ${responseModal.status}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TakeMarks;