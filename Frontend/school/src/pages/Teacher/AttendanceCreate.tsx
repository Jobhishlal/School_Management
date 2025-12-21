import React, { useEffect, useState } from "react";
import { GetStudentsByTeacher, AttendanceCreate } from "../../services/authapi";
import { showToast } from "../../utils/toast";
import { useTheme } from "../../components/layout/ThemeContext";
import { getDecodedToken } from "../../utils/DecodeToken";

interface Student {
  id: string;
  fullName: string;
  classId: string;
}

type AttendanceStatus = "Present" | "Absent";

interface AttendanceItem {
  studentId: string;
  status: AttendanceStatus;
  
}

const AttendanceCreatePage = () => {
  const { isDark } = useTheme();
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceItem[]>([]);
  const [session, setSession] = useState< "Morning" | "Afternoon">("Morning");
  const [loading, setLoading] = useState(false);
   const decoded = getDecodedToken();
  const teacherId = decoded?.id;


  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const res = await GetStudentsByTeacher();
        if (res.success) {
          setStudents(res.students);
        } else {
          showToast("Failed to fetch students", "error");
        }
      } catch (err) {
        console.error(err);
        showToast("Failed to fetch students", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const markAttendance = (studentId: string, status: AttendanceStatus) => {
    setAttendance(prev => {
      const exists = prev.find(a => a.studentId === studentId);
      return exists
        ? prev.map(a => (a.studentId === studentId ? { ...a, status } : a))
        : [...prev, { studentId, status }];
    });
  };

 const handleSubmit = async () => {
  if (!teacherId) {
    return showToast("Teacher not logged in", "error");
  }

  if (attendance.length !== students.length) {
    return showToast("Mark attendance for all students", "warning");
  }

  const classId = students[0]?.classId;
  if (!classId) return showToast("Class ID not found", "error");

  try {
    setLoading(true);
    await AttendanceCreate({
      date: new Date().toISOString(),
      attendance,
      session,
      classId,
      teacherId, 
    });

    showToast("Attendance submitted successfully", "success");
    setAttendance([]);
  } catch (error) {
    console.error(error);
    showToast("Attendance submission failed", "error");
  } finally {
    setLoading(false);
  }
};

  const rowBg = isDark ? "bg-[#1e293b]" : "bg-white";

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Take Attendance</h2>

      <div className="mb-4">
        <label className="font-medium mr-3">Session:</label>
        <select
          value={session}
          onChange={e => setSession(e.target.value as "Morning" | "Afternoon")}
          className="border px-3 py-1 rounded"
        >
          <option value="Morning">Morning</option>
          <option value="Afternoon">Afternoon</option>
        </select>
      </div>

      <div className="border rounded-lg overflow-hidden">
        {loading ? (
          <p className="p-4 text-sm opacity-70">Loading students...</p>
        ) : students.length === 0 ? (
          <p className="p-4 text-sm opacity-70">No students found</p>
        ) : (
          students.map((student, index) => (
            <div key={student.id} className={`flex justify-between px-4 py-3 border-b ${rowBg}`}>
              <span>{index + 1}. {student.fullName}</span>
              <div className="flex gap-4">
                <label>
                  <input
                    type="radio"
                    name={student.id}
                    onChange={() => markAttendance(student.id, "Present")}
                  /> Present
                </label>
                <label>
                  <input
                    type="radio"
                    name={student.id}
                    onChange={() => markAttendance(student.id, "Absent")}
                  /> Absent
                </label>
              </div>
            </div>
          ))
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-6 bg-green-600 text-white px-6 py-2 rounded"
      >
        {loading ? "Submitting..." : "Submit Attendance"}
      </button>
    </div>
  );
};

export default AttendanceCreatePage;
