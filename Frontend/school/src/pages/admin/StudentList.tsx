import React, { useEffect, useState } from "react";

import { Plus,  Eye, Edit, UserX,ChevronDown } from "lucide-react";
import { FaSearch } from "react-icons/fa";
import { showToast } from "../../utils/toast";
import { GetAllStudents } from "../../services/authapi";
import { useTheme } from "../../components/layout/ThemeContext";
import { Pagination } from "../../components/common/Pagination";
import { Modal } from "../../components/common/Modal";
import {AddStudentForm} from '../../pages/admin/StudentManagement'
import { Table } from "../../components/Table/Table";

interface Student {
  _id: string;
  fullName: string;
  studentId: string;
  classDetails: {
    className: string;
    section: string;
  };
  guardian: {
    name: string;
    phone: string;
  };
  status: string;
  photos: {
    url: string;
  }[];
}


export function StudentList() {
  const { isDark } = useTheme();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [newStudent, setNewStudent] = useState({
    fullName: "",
    studentId: "",
    class: "",
    section: "",
    guardianName: "",
    guardianPhone: "",
    status: "Active",
    profilePic: null as File | null,
  });

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await GetAllStudents();
      console.log(data)
      const formattedData = data.map((student: any) => ({
        _id: student._id,
        fullName: student.fullName,
        studentId: student.studentId || "N/A",
      classDetails: {
  className: student.classDetails?.className || "N/A",
  division: student.classDetails?.division || "N/A",
},
  guardian: {                 
    name: student.parent?.name || "N/A",
    phone: student.parent?.contactNumber || "N/A",
  },
        status: student.status || "Active",
        photos: student.photos || [],
      }));
      setStudents(formattedData);
      setFilteredStudents(formattedData);
    } catch (err) {
      console.error(err);
      setError("Cannot fetch students");
      showToast("Cannot fetch student details", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    const filtered = students.filter(
      (student) =>
        student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
    setCurrentPage(1);
  }, [searchTerm, students]);

  const handleCloseModal = () => {
    setNewStudent({
      fullName: "",
      studentId: "",
      class: "",
      section: "",
      guardianName: "",
      guardianPhone: "",
      status: "Active",
      profilePic: null,
    });
    setShowModal(false);
  };

  const handleAddStudent = async () => {
    setLoading(true);
    try {
      const { fullName, studentId, class: className, section, guardianName, guardianPhone, status, profilePic } = newStudent;
      
      await CreateStudent({
        fullName,
        studentId,
        classDetails: { className, section },
        guardian: { name: guardianName, phone: guardianPhone },
        status,
        profilePic,
      });
      showToast("Student added successfully", "success");
      handleCloseModal();
      await fetchStudents();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Error adding student";
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);
const studentColumns: Column<Student>[] = [
  {
    label: "Profile Pic",
    render: (s) => (
      <div className="w-10 h-10 rounded-full overflow-hidden">
        {s.photos.length ? (
          <img src={s.photos[0].url} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-slate-600 flex items-center justify-center text-slate-300 font-medium text-xs">
            {s.fullName.charAt(0)}
          </div>
        )}
      </div>
    ),
  },
  { label: "Name", key: "fullName" },
  { label: "Roll No/Student ID", key: "studentId" },
  {
    label: "Class & Section",
    render: (s) => `${s.classDetails?.className || "N/A"} - ${s.classDetails?.division || "N/A"}`,
  },
{
  label: "Guardian Name",
  render: (s) => s.guardian?.name || "N/A"
},
{
  label: "Phone",
  render: (s) => s.guardian?.phone || "N/A"
}

,
  {
    label: "Status",
    render: (s) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          s.status === "Active" ? "bg-green-500 text-green-50" : "bg-red-500 text-red-50"
        }`}
      >
        {s.status}
      </span>
    ),
  },
];



  const StudentCard = ({ student }: { student: Student }) => (
    <div className={`p-4 rounded-lg border mb-4 ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}>
      <div className="flex items-center space-x-4 mb-3">
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
          {student.photos.length > 0 ? (
            <img src={student.photos[0].url} alt={student.fullName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-slate-600 flex items-center justify-center text-slate-300 font-medium">
              {student.fullName.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg truncate">{student.fullName}</h3>
          <p className={`text-sm mb-1 truncate ${isDark ? "text-slate-400" : "text-gray-600"}`}>
            ID: {student.studentId}
          </p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-2 ${student.status === "Active" ? "bg-green-500 text-green-50" : "bg-red-500 text-red-50"}`}>
          {student.status}
        </span>
      </div>

      {/* <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <p className={`text-xs font-medium ${isDark ? "text-slate-400" : "text-gray-500"}`}>Class</p>
          <p className="text-sm font-medium">{student.classDetails.className} - {student.classDetails.section}</p>
        </div>
        <div>
          <p className={`text-xs font-medium ${isDark ? "text-slate-400" : "text-gray-500"}`}>Guardian</p>
          <p className="text-sm font-medium">{student.guardian.name}</p>
        </div>
        <div>
          <p className={`text-xs font-medium ${isDark ? "text-slate-400" : "text-gray-500"}`}>Phone</p>
          <p className="text-sm font-medium">{student.guardian.phone}</p>
        </div>
      </div> */}
      <div className="flex justify-end space-x-2 pt-2 border-t border-opacity-20">
        <button className={`p-2 rounded-full transition-colors ${isDark ? "hover:bg-gray-700 text-blue-400" : "hover:bg-gray-100 text-blue-600"}`} title="View Details">
          <Eye size={16} />
        </button>
      </div>
    </div>
  );

  if (loading) return <div className="p-8 text-center text-slate-400">Loading Students...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className={`min-h-screen p-2 sm:p-4 md:p-6 lg:p-8 ${isDark ? "bg-[#121A21] text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col space-y-4 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Student List</h2>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full py-2.5 pl-10 pr-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${isDark ? "bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400" : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"}`}
              />
              <FaSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-slate-400" : "text-gray-500"}`} />
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              <span className="hidden xs:inline">Add Student</span>
              <span className="xs:hidden">Add</span>
            </button>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <div className={`relative ${isDark ? "text-slate-400" : "text-gray-500"}`}>
              <select className={`w-full py-2 pl-3 pr-8 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${isDark ? "bg-slate-700 border-slate-600 text-slate-100" : "bg-white border-gray-300 text-gray-800"}`}>
                <option>Class</option>
                <option>Grade 5</option>
                <option>Grade 6</option>
                <option>Grade 7</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <div className={`relative ${isDark ? "text-slate-400" : "text-gray-500"}`}>
              <select className={`w-full py-2 pl-3 pr-8 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${isDark ? "bg-slate-700 border-slate-600 text-slate-100" : "bg-white border-gray-300 text-gray-800"}`}>
                <option>Section</option>
                <option>A</option>
                <option>B</option>
                <option>C</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <div className={`relative ${isDark ? "text-slate-400" : "text-gray-500"}`}>
              <select className={`w-full py-2 pl-3 pr-8 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${isDark ? "bg-slate-700 border-slate-600 text-slate-100" : "bg-white border-gray-300 text-gray-800"}`}>
                <option>Status</option>
                <option>Active</option>
                <option>Blocked</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

       
        <div className={`rounded-lg overflow-hidden ${isDark ? "bg-slate-800/50" : "bg-white"} shadow-sm`}>
          {filteredStudents.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <p className="text-base sm:text-lg font-medium">No students found</p>
            </div>
          ) : (
            <>
         
              <div className="hidden md:block overflow-x-auto">
              <Table
  columns={studentColumns}
  data={currentStudents}
  actions={(t) => (
    <div className="flex justify-center gap-2">
      <button onClick={() => handleView(t)}><Eye size={16} /></button>
      <button onClick={() => handleEdit(t)}><Edit size={16} /></button>
      <button onClick={() => handleBlock(t)}><UserX size={16} /></button>
    </div>
  )}
  isDark={isDark}
/>

              </div>

            
              <div className="md:hidden p-4">
                {currentStudents.map((student) => (
                  <StudentCard key={student._id} student={student} />
                ))}
              </div>
            </>
          )}
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title="Add New Student"
      >
       <AddStudentForm/>
      </Modal>
    </div>
  );
}