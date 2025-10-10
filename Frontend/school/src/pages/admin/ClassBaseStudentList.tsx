import React, { useEffect, useState } from "react";
import { classdivisonaccess, AssignClassTeacherOnClass, getTeachersList } from "../../services/authapi";
import { useTheme } from "../../components/layout/ThemeContext";

import { showToast } from "../../utils/toast";
import { AxiosError } from "axios";

interface Student {
  studentId: string;
  fullName: string;
  gender: string;
}

interface Teacher {
  teacherId: string;
  name: string;
}

interface ClassDivision {
  classId: string;
  className: string;
  division: string;
  students: Student[];
  classTeacher?: Teacher | null;
}

const AdminClassDivisionView: React.FC = () => {
  const { isDark } = useTheme();

  const [classes, setClasses] = useState<Record<string, ClassDivision>>({});
  const [loading, setLoading] = useState(true);
  const [selectedDivision, setSelectedDivision] = useState("");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await classdivisonaccess();
        if (res.data.success) setClasses(res.data.data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

 
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const teacherData = await getTeachersList();
        setTeachers(teacherData);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };
    fetchTeachers();
  }, []);

  const assignTeacher = async () => {
    if (!selectedClassId || !selectedTeacher) {
      return showToast("select both class and teacher","info")
     
    }

    try {
      const res = await AssignClassTeacherOnClass({
        classId: selectedClassId,
        teacherId: selectedTeacher,
      });

      if (res.data.success) {
        showToast("Teacher assigned successfully","success");

      
        const refreshedClasses = await classdivisonaccess();
        if (refreshedClasses.data.success) setClasses(refreshedClasses.data.data);

        setSelectedTeacher("");
        setSelectedClassId("");
      } else {
        showToast(res.data.message || "Teacher assignment failed");
      }
    }catch (error: unknown) {
  const err = error as AxiosError<{message:string}>;
  console.error("Error assigning teacher:", err);
  showToast(err.response?.data?.message || "Error assigning teacher");
}
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const filteredClasses = selectedDivision
    ? { [selectedDivision]: classes[selectedDivision] }
    : classes;

  return (
    <div className={`min-h-screen p-4 sm:p-8 ${isDark ? "bg-[#121A21] text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-1">Class & Division Management</h2>
        <p className="text-slate-400 mb-6">View students and assign class teachers</p>

   
        <div className="mb-6">
          <label className="mr-2 font-medium">Filter by Division:</label>
          <select
            className={`border px-3 py-2 rounded ${isDark ? "bg-slate-800 border-slate-600 text-slate-200" : "bg-white border-slate-300 text-slate-900"}`}
            value={selectedDivision}
            onChange={(e) => setSelectedDivision(e.target.value)}
          >
            <option value="">All</option>
            {Object.keys(classes).map((key) => (
              <option key={key} value={key}>
                {key} ({classes[key].students.length})
              </option>
            ))}
          </select>
        </div>

        {Object.keys(filteredClasses).map((key) => {
          const cls = filteredClasses[key];
          return (
            <div
              key={cls.classId}
              className={`rounded-lg p-6 shadow-lg mb-6 ${isDark ? "bg-slate-800/50" : "bg-white"}`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">
                  Class {cls.className} - Division {cls.division}{" "}
                  <span className="text-green-500 ml-2">
                    {cls.classTeacher ? `(Teacher: ${cls.classTeacher.name})` : "(No teacher assigned)"}
                  </span>
                </h3>

         
                <div className="flex items-center gap-2">
                  <select
                    className={`border px-2 py-1 rounded ${isDark ? "bg-slate-700 border-slate-600 text-slate-200" : "bg-white border-slate-300 text-slate-900"}`}
                    value={selectedTeacher}
                    onChange={(e) => {
                      setSelectedTeacher(e.target.value);
                      setSelectedClassId(cls.classId);
                    }}
                  >
                    <option value="">Select Teacher</option>
                    {teachers.map((t) => (
                      <option key={t.teacherId} value={t.teacherId}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={assignTeacher}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Assign
                  </button>
                </div>
              </div>

              {/* Students Table */}
              <div className="overflow-x-auto">
            
                <table className="min-w-full border border-slate-400 text-sm">
                  <thead className={`${isDark ? "bg-slate-700 text-slate-200" : "bg-slate-100 text-slate-900"}`}>
                    <tr>
                      <th className="px-4 py-2 border-b">ID</th>
                      <th className="px-4 py-2 border-b">Name</th>
                      <th className="px-4 py-2 border-b">Gender</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cls.students.map((s) => (
                      <tr key={s.studentId} className={`${isDark ? "border-b border-slate-600" : "border-b border-slate-300"}`}>
                        <td className="px-4 py-2">{s.studentId}</td>
                        <td className="px-4 py-2">{s.fullName}</td>
                        <td className="px-4 py-2">{s.gender}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminClassDivisionView;
