import React, { useEffect, useState } from "react";
import {
  classdivisonaccess,
  AssignClassTeacherOnClass,
  getTeachersList,
  CreateClass,
  UpdateClass,
} from "../../services/authapi";
import { useTheme } from "../../components/layout/ThemeContext";
import { showToast } from "../../utils/toast";
import { AxiosError } from "axios";
import { ClassInfo } from "../../components/Form/ClassControll/Classcheck";

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

const ClassBaseAccess: React.FC = () => {
  const { isDark } = useTheme();

  const [classes, setClasses] = useState<Record<string, ClassDivision>>({});
  const [loading, setLoading] = useState(true);
  const [selectedDivision, setSelectedDivision] = useState("");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [editingClassId, setEditingClassId] = useState("");
  const [editingClassName, setEditingClassName] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClassName, setNewClassName] = useState<
    "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10"
  >("1");
  const [division, setDivision] = useState<"A" | "B" | "C" | "D">("A");
  const [creatingClass, setCreatingClass] = useState(false);

  const fetchClasses = async () => {
    try {
      const res = await classdivisonaccess();
      if (res.data.success) setClasses(res.data.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
      showToast("Error fetching classes", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);


  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const teacherData = await getTeachersList();
        setTeachers(teacherData);
      } catch (error) {
        console.error("Error fetching teachers:", error);
        showToast("Error fetching teachers", "error");
      }
    };
    fetchTeachers();
  }, []);

 
  const assignTeacher = async () => {
    if (!selectedClassId || !selectedTeacher) {
      return showToast("Select both class and teacher", "info");
    }

    try {
      const res = await AssignClassTeacherOnClass({
        classId: selectedClassId,
        teacherId: selectedTeacher,
      });

      if (res.data.success) {
        showToast("Teacher assigned successfully", "success");
        await fetchClasses();
        setSelectedTeacher("");
        setSelectedClassId("");
      } else {
        showToast(res.data.message || "Teacher assignment failed", "error");
      }
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      console.error("Error assigning teacher:", err);
      showToast(err.response?.data?.message || "Error assigning teacher", "error");
    }
  };

 
  const updateClass = async (classId: string) => {
    if (!editingClassName) return showToast("Enter class name", "info");
    try {
      const res = await UpdateClass(classId, { className: editingClassName });
      if (res.data.success) {
        showToast("Class updated", "success");
        await fetchClasses();
        setEditingClassId("");
        setEditingClassName("");
      }
    } catch (err) {
      console.error(err);
      showToast("Error updating class", "error");
    }
  };

  // ✅ Delete class (placeholder, assuming implemented)
  const deleteClass = async (classId: string) => {
    showToast(`Deleting class ${classId} not implemented`, "info");
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
    <div
      className={`min-h-screen p-4 sm:p-8 ${
        isDark ? "bg-[#121A21] text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-1">Class & Division Management</h2>
        <p className="text-slate-400 mb-6">
          View students, manage classes, and assign teachers
        </p>

        {/* Create Class Button */}
        <div className="mb-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            Create Class
          </button>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <label className="mr-2 font-medium">Filter by Division:</label>
          <select
            className={`border px-3 py-2 rounded ${
              isDark
                ? "bg-slate-800 border-slate-600 text-slate-200"
                : "bg-white border-slate-300 text-slate-900"
            }`}
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

        {/* Class list */}
        {Object.keys(filteredClasses).map((key) => {
          const cls = filteredClasses[key];
          return (
            <div
              key={cls.classId}
              className={`rounded-lg p-6 shadow-lg mb-6 ${
                isDark ? "bg-slate-800/50" : "bg-white"
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">
                  Class {cls.className} - Division {cls.division}{" "}
                  <span className="text-green-500 ml-2">
                    {cls.classTeacher
                      ? `(Teacher: ${cls.classTeacher.name})`
                      : "(No teacher assigned)"}
                  </span>
                </h3>

                <div className="flex items-center gap-2">
                  {editingClassId === cls.classId ? (
                    <div className="flex gap-2">
                      <input
                        value={editingClassName}
                        onChange={(e) => setEditingClassName(e.target.value)}
                        className="border px-2 py-1 rounded"
                      />
                      <button
                        onClick={() => updateClass(cls.classId)}
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingClassId("")}
                        className="bg-gray-500 text-white px-2 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingClassId(cls.classId);
                        setEditingClassName(cls.className);
                      }}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Edit Class
                    </button>
                  )}

                  <button
                    onClick={() => deleteClass(cls.classId)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete Class
                  </button>

                  <select
                    className={`border px-2 py-1 rounded ${
                      isDark
                        ? "bg-slate-700 border-slate-600 text-slate-200"
                        : "bg-white border-slate-300 text-slate-900"
                    }`}
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
                  <thead
                    className={`${
                      isDark
                        ? "bg-slate-700 text-slate-200"
                        : "bg-slate-100 text-slate-900"
                    }`}
                  >
                    <tr>
                      <th className="px-4 py-2 border-b">ID</th>
                      <th className="px-4 py-2 border-b">Name</th>
                      <th className="px-4 py-2 border-b">Gender</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cls.students.map((s) => (
                      <tr
                        key={s.studentId}
                        className={`${
                          isDark
                            ? "border-b border-slate-600"
                            : "border-b border-slate-300"
                        }`}
                      >
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

        {/* ✅ Create Class Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white dark:bg-slate-800 p-6 rounded shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-100">
                Create Class
              </h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    setCreatingClass(true);
                    const res = await CreateClass({
                      className: newClassName,
                      division,
                    });

                    if (res?.data?.success) {
                      showToast(res.data.message, "success");
                      await fetchClasses();
                      setShowCreateModal(false);
                    } else {
                      showToast(
                        res?.data?.message || "Failed to create class",
                        "error"
                      );
                    }
                  } catch (err) {
                    const axiosErr = err as AxiosError<{ message?: string }>;
                    const message =
                      axiosErr.response?.data?.message ||
                      axiosErr.message ||
                      "Error creating class";

                    console.error("CreateClass error:", axiosErr.response);
                    showToast(message, "error");
                  } finally {
                    setCreatingClass(false);
                  }
                }}
              >
                <ClassInfo
                  className={newClassName}
                  setClassName={setNewClassName}
                  division={division}
                  setDivision={setDivision}
                  isDark={isDark}
                />
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="bg-gray-500 text-white px-3 py-1 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creatingClass}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    {creatingClass ? "Creating..." : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassBaseAccess;
