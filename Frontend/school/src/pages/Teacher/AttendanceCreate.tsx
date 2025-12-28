import React, { useState } from "react";
import { AttendanceCreate } from "../../services/authapi";
import { showToast } from "../../utils/toast";

type AttendanceStatus = "Present" | "Absent"|"Leave";

interface Student {
  id: string;
  fullName: string;
  classId: string;
}

interface AttendanceItem {
  studentId: string;
  status: AttendanceStatus;
}

interface Props {
  students: Student[];
  teacherId: string;
  session: "Morning" | "Afternoon";
  onSuccess: () => void;
}

const TakeAttendanceForm: React.FC<Props> = ({
  students,
  teacherId,
  session,
  onSuccess,
}) => {
  const [attendance, setAttendance] = useState<AttendanceItem[]>([]);
  const [loading, setLoading] = useState(false);

  const markAttendance = (studentId: string, status: AttendanceStatus) => {
    setAttendance(prev => {
      const exists = prev.find(a => a.studentId === studentId);
      return exists
        ? prev.map(a =>
            a.studentId === studentId ? { ...a, status } : a
          )
        : [...prev, { studentId, status }];
    });
  };

  const handleSubmit = async () => {
    if (attendance.length !== students.length)
      return showToast("Mark all students", "warning");

    try {
      setLoading(true);

      await AttendanceCreate({
        date: new Date(),
        classId: students[0].classId,
        teacherId,
        session,
        attendance,
      });

      showToast("Attendance submitted", "success");
      setAttendance([]);
      onSuccess();
    } catch (error:any) {
       const message =
      error?.response?.data?.message ||
      "Attendance submission failed";

    showToast(message, "info");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold mb-3">
        Take Attendance ({session})
      </h3>

      {students.map((student, index) => (
        <div
          key={student.id}
          className="flex justify-between py-2 border-b"
        >
          <span>
            {index + 1}. {student.fullName}
          </span>

          <div className="flex gap-4">
            <label>
              <input
                type="radio"
                name={student.id}
                onChange={() =>
                  markAttendance(student.id, "Present")
                }
              /> Present
            </label>

            <label>
              <input
                type="radio"
                name={student.id}
                onChange={() =>
                  markAttendance(student.id, "Absent")
                }
              /> Absent
            </label>
            <label>
              <input
                type="radio"
                name={student.id}
                onChange={() =>
                  markAttendance(student.id, "Leave")
                }
              /> Leave
            </label>
          </div>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-4 bg-green-600 text-white px-6 py-2 rounded"
      >
        {loading ? "Submitting..." : "Submit Attendance"}
      </button>
    </div>
  );
};

export default TakeAttendanceForm;
