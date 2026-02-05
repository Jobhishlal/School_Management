import React, { useEffect, useState } from "react";
import {
  classdivisonaccess,
  AssignClassTeacherOnClass,
  getTeachersList,
  CreateClass,

  assignStudentToDivision,
  deleteClassOrDivision,
  GetAllStudents,

} from "../../services/authapi";

import { useTheme } from "../../components/layout/ThemeContext";
import { showToast } from "../../utils/toast";
import { AxiosError } from "axios";
import { ClassInfo } from "../../components/Form/ClassControll/Classcheck";
import { Modal } from "../../components/common/Modal";
import { Pagination } from "../../components/common/Pagination";


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

  const [teachers, setTeachers] = useState<Teacher[]>([]);


  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");






  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);


  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClassName, setNewClassName] = useState<
    "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10"
  >("1");
  const [division, setDivision] = useState<"A" | "B" | "C" | "D">("A");

  const [selectedDivision, setSelectedDivision] = useState("");

  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set());
  const [studentSearch, setStudentSearch] = useState("");
  const [studentPage, setStudentPage] = useState(1);
  const [bulkTargetClass, setBulkTargetClass] = useState("");






  const itemsPerPage = 5;

  const fetchClasses = async () => {
    try {
      const res = await classdivisonaccess();
      console.log("[DEBUG] Classes fetched from API:", res.data.data);
      if (res.data.success) setClasses(res.data.data);
    } catch {
      showToast("Error fetching classes", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClasses(); }, []);

  useEffect(() => {
    const loadTeachers = async () => {
      try {
        const t = await getTeachersList();
        setTeachers(t);
      } catch {
        showToast("Error fetching teachers", "error");
      }
    };
    loadTeachers();
  }, []);



  const assignTeacher = async () => {
    if (!selectedTeacher || !selectedClassId)
      return showToast("Select both class & teacher", "info");

    try {
      const result = await AssignClassTeacherOnClass({
        classId: selectedClassId,
        teacherId: selectedTeacher,
      });

      if (result.success) {
        showToast(result.message, "success");
        await fetchClasses();
        setSelectedTeacher("");
        setSelectedClassId("");
      } else showToast(result.message, "error");
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      showToast(e.response?.data?.message || "Error assigning teacher", "error");
    }
  };




  const loadAllStudents = async () => {
    try {
      const data = await GetAllStudents();
      const formatted = data.map((s: any) => ({
        studentId: s.studentId,
        fullName: s.fullName,
        gender: s.gender,
        className: s.classDetails?.className || "N/A",
        division: s.classDetails?.division || "N/A",
        _id: s._id || s.id
      }));
      setAllStudents(formatted);
      setFilteredStudents(formatted);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { loadAllStudents(); }, []);

  useEffect(() => {
    let res = allStudents;
    if (studentSearch) {
      res = res.filter(s =>
        s.fullName.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.studentId.toLowerCase().includes(studentSearch.toLowerCase()) ||
        (s as any).className?.toLowerCase().includes(studentSearch.toLowerCase())
      );
    }
    setFilteredStudents(res);
    setStudentPage(1);
  }, [studentSearch, allStudents]);

  const handleBulkAssign = async () => {
    if (selectedStudentIds.size === 0 || !bulkTargetClass) {
      return showToast("Select students and target class", "info");
    }

    try {
      const result = await assignStudentToDivision({
        studentId: Array.from(selectedStudentIds),
        classId: bulkTargetClass
      });

      if (result.success || result.message?.includes("success")) {
        showToast("Students assigned successfully", "success");
        await fetchClasses();
        await loadAllStudents();
        setSelectedStudentIds(new Set());
        setBulkTargetClass("");
      } else {
        showToast(result.message || "Failed", "error");
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || "Error bulk assigning", "error");
    }
  };

  useEffect(() => {
    let res = allStudents;

    if (studentSearch) {
      res = res.filter(s =>
        s.fullName.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.studentId.toLowerCase().includes(studentSearch.toLowerCase()) ||
        (s as any).className?.toLowerCase().includes(studentSearch.toLowerCase())
      );
    }

    if (bulkTargetClass) {

      const targetClassObj = Object.values(classes).find(c => c.classId === bulkTargetClass);

      if (targetClassObj) {

        res = res.filter((s: any) => s.className === targetClassObj.className);
      }
    }

    setFilteredStudents(res);
    setStudentPage(1);
  }, [studentSearch, allStudents, bulkTargetClass, classes]);
  const toggleStudentSelection = (id: string) => {
    const newSet = new Set(selectedStudentIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedStudentIds(newSet);
  };

  const toggleAllPageSelection = () => {
    const start = (studentPage - 1) * itemsPerPage;
    const currentData = filteredStudents.slice(start, start + itemsPerPage);
    const allSelected = currentData.every(s => selectedStudentIds.has(s.studentId)); // Using studentId as key

    const newSet = new Set(selectedStudentIds);
    currentData.forEach(s => {
      if (allSelected) newSet.delete(s.studentId);
      else newSet.add(s.studentId);
    });
    setSelectedStudentIds(newSet);
  };


  // ================= UPDATE CLASS =================


  const handleDeleteClass = async () => {
    if (!deleteTarget) return;

    try {
      const result = await deleteClassOrDivision(deleteTarget);

      if (result.success) {
        showToast(result.message || "Class deleted successfully", "success");
        await fetchClasses();
      } else {
        showToast(result.message || "Failed to delete class", "error");
      }

    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        "Cannot delete class. It may still have students assigned.";

      showToast(message, "error");
    } finally {
      setDeleteTarget(null);
    }
  };



  const handleCreateClass = async () => {
    if (!newClassName || !division) {
      showToast("Please select both Class Name and Division", "info");
      return;
    }

    setLoading(true);
    try {
      const res = await CreateClass({ className: newClassName, division });
      if (res.success) {
        showToast(`Class ${newClassName}-${division} created successfully`, "success");
        setShowCreateModal(false);
        await fetchClasses();
      } else {
        showToast(res.message || "Failed to create class", "error");
      }
    } catch (error: any) {
      showToast(error.response?.data?.message || "Error creating class", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  const filteredClasses = selectedDivision
    ? { [selectedDivision]: classes[selectedDivision] }
    : classes;

  return (
    <div className={`min-h-screen p-4 sm:p-8 ${isDark ? "bg-[#121A21] text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      <div className="max-w-7xl mx-auto">

        <h2 className="text-3xl font-bold mb-1">Class & Division Management</h2>
        <p className="text-slate-400 mb-6">View students, manage classes, and assign teachers</p>

        {/* CREATE CLASS BUTTON */}
        <div className="mb-4">
          <button onClick={() => setShowCreateModal(true)}
            className="bg-green-500 text-white px-3 py-1 rounded">
            Create Class
          </button>
        </div>

        {/* ================= BULK STUDENT ASSIGNMENT UI ================= */}
        <div className={`rounded-lg p-6 shadow mb-8 ${isDark ? "bg-slate-800/50" : "bg-white"}`}>
          <h3 className="text-xl font-semibold mb-4">Bulk Student Assignment</h3>
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <input
              type="text"
              placeholder="Search students (Name, ID, Class)..."
              value={studentSearch}
              onChange={e => setStudentSearch(e.target.value)}
              className={`w-full md:flex-1 border px-3 py-2 rounded ${isDark ? "bg-slate-700 text-white" : "bg-white"}`}
            />
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <select
                value={bulkTargetClass}
                onChange={e => setBulkTargetClass(e.target.value)}
                className={`border rounded px-3 py-2 dark:bg-slate-700 dark:text-white w-full sm:min-w-[200px]`}
              >
                <option value="">Select Target Class-Division</option>
                {Object.values(classes).map(cls => (
                  <option key={cls.classId} value={cls.classId}>
                    {cls.className} - {cls.division}
                  </option>
                ))}
              </select>
              <button
                onClick={handleBulkAssign}
                disabled={selectedStudentIds.size === 0 || !bulkTargetClass}
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-blue-700 w-full sm:w-auto"
              >
                Assign ({selectedStudentIds.size})
              </button>
            </div>
          </div>

          {/* STUDENT TABLE (Desktop) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className={`text-xs uppercase ${isDark ? "bg-slate-700 text-slate-300" : "bg-gray-100 text-gray-700"}`}>
                <tr>
                  <th className="px-4 py-3">
                    <input type="checkbox"
                      checked={filteredStudents.slice((studentPage - 1) * itemsPerPage, studentPage * itemsPerPage).length > 0 && filteredStudents.slice((studentPage - 1) * itemsPerPage, studentPage * itemsPerPage).every(s => selectedStudentIds.has(s.studentId))}
                      onChange={toggleAllPageSelection}
                    />
                  </th>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Current Class</th>
                  <th className="px-4 py-3">Gender</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.slice((studentPage - 1) * itemsPerPage, studentPage * itemsPerPage).map((student) => (
                  <tr key={student.studentId} className={`border-b ${isDark ? "border-slate-700 hover:bg-slate-700/50" : "border-gray-200 hover:bg-gray-50"}`}>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedStudentIds.has(student.studentId)}
                        onChange={() => toggleStudentSelection(student.studentId)}
                      />
                    </td>
                    <td className="px-4 py-3">{student.studentId}</td>
                    <td className="px-4 py-3 font-medium">{student.fullName}</td>
                    <td className="px-4 py-3">{(student as any).className} - {(student as any).division}</td>
                    <td className="px-4 py-3">{student.gender}</td>
                  </tr>
                ))}
                {filteredStudents.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-4">No students found</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* STUDENT CARDS (Mobile) */}
          <div className="md:hidden space-y-3">
            <div className="flex items-center gap-2 mb-2 p-2 rounded bg-slate-100 dark:bg-slate-700">
              <input type="checkbox"
                checked={filteredStudents.slice((studentPage - 1) * itemsPerPage, studentPage * itemsPerPage).length > 0 && filteredStudents.slice((studentPage - 1) * itemsPerPage, studentPage * itemsPerPage).every(s => selectedStudentIds.has(s.studentId))}
                onChange={toggleAllPageSelection}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">Select All on Page</span>
            </div>
            {filteredStudents.slice((studentPage - 1) * itemsPerPage, studentPage * itemsPerPage).map((student) => (
              <div key={student.studentId}
                onClick={() => toggleStudentSelection(student.studentId)}
                className={`p-3 rounded border border-l-4 ${selectedStudentIds.has(student.studentId) ? 'border-l-blue-500 border-gray-300' : 'border-l-transparent border-gray-200'} ${isDark ? "bg-slate-700 border-slate-600" : "bg-white"}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <input
                      type="checkbox"
                      checked={selectedStudentIds.has(student.studentId)}
                      onChange={() => toggleStudentSelection(student.studentId)}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-semibold">{student.fullName}</p>
                      <p className="text-xs opacity-70">ID: {student.studentId}</p>
                    </div>
                  </div>
                  <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                    {(student as any).className}-{(student as any).division}
                  </span>
                </div>
              </div>
            ))}
            {filteredStudents.length === 0 && (
              <div className="text-center py-4">No students found</div>
            )}
          </div>

          {Math.ceil(filteredStudents.length / itemsPerPage) > 1 && (
            <Pagination
              currentPage={studentPage}
              totalPages={Math.ceil(filteredStudents.length / itemsPerPage)}
              onPageChange={setStudentPage}
            />
          )}
        </div>
        {/* ================= END BULK STUDENT ASSIGNMENT ================= */}


        {/* ================= FILTER ================= */}
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

        {/* ================= CLASS LIST ================= */}
        {Object.keys(filteredClasses).map((key) => {
          const cls = filteredClasses[key];

          return (
            <div key={cls.classId}
              className={`rounded-lg p-6 shadow-lg mb-6 ${isDark ? "bg-slate-800/50" : "bg-white"}`}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <h3 className="text-xl font-semibold">
                  Class {cls.className} - Division {cls.division}
                  <span className="block md:inline text-sm md:text-base text-green-500 md:ml-2">
                    {cls.classTeacher
                      ? `(Teacher: ${cls.classTeacher.name})`
                      : "(No teacher assigned)"}
                  </span>
                </h3>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
                  <select
                    value={selectedTeacher}
                    onChange={(e) => {
                      setSelectedTeacher(e.target.value);
                      setSelectedClassId(cls.classId);
                    }}
                    className="border px-2 py-1 rounded dark:bg-slate-700 w-full md:w-auto"
                  >
                    <option value="">Select Teacher</option>
                    {teachers.map((t) => (
                      <option key={t.teacherId} value={t.teacherId}>
                        {t.name}
                      </option>
                    ))}
                  </select>

                  <button
                    disabled={!selectedTeacher || !selectedClassId}
                    onClick={assignTeacher}
                    className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-3 py-1 rounded w-full md:w-auto"
                  >
                    Assign
                  </button>

                  <button
                    onClick={() => setDeleteTarget(cls.classId)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded w-full md:w-auto"
                  >
                    Delete
                  </button>

                </div>
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full border border-slate-400 text-sm">
                  <thead className={isDark ? "bg-slate-700" : "bg-slate-100"}>
                    <tr>
                      <th className="px-4 py-2 border-b">ID</th>
                      <th className="px-4 py-2 border-b">Name</th>
                      <th className="px-4 py-2 border-b">Gender</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cls.students.map((s) => (
                      <tr key={s.studentId}>
                        <td className="px-4 py-2">{s.studentId}</td>
                        <td className="px-4 py-2">{s.fullName}</td>
                        <td className="px-4 py-2">{s.gender}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-2">
                <p className="text-sm font-semibold mb-2">Students ({cls.students.length})</p>
                {cls.students.map((s) => (
                  <div key={s.studentId} className={`p-3 rounded border ${isDark ? "bg-slate-700 border-slate-600" : "bg-slate-50 border-gray-200"}`}>
                    <div className="flex justify-between">
                      <span className="font-medium">{s.fullName}</span>
                      <span className="text-xs opacity-70 p-1 bg-black/10 rounded">{s.gender}</span>
                    </div>
                    <p className="text-xs opacity-70">ID: {s.studentId}</p>
                  </div>
                ))}
                {cls.students.length === 0 && <p className="text-sm opacity-50 italic">No students in this class.</p>}
              </div>

            </div>
          );
        })}

      </div>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Class"
      >
        <div className="space-y-6">
          <ClassInfo
            mode="newClass"
            className={newClassName}
            setClassName={setNewClassName}
            division={division}
            setDivision={setDivision}
            isDark={isDark}
          />
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateClass}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Create Class
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Confirm Delete"
      >
        <p className="mb-4">
          Are you sure you want to delete this class/division?
          <br />
          <strong>This cannot be undone.</strong>
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setDeleteTarget(null)}
            className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            Cancel
          </button>

          <button
            onClick={handleDeleteClass}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Yes — Delete
          </button>
        </div>
      </Modal>

    </div>
  );
};

export default ClassBaseAccess;
