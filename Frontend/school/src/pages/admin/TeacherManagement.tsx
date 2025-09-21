import { useState, useEffect } from "react";
import { Plus, X, Eye, Edit, UserX, Menu } from "lucide-react";
import { FaSearch } from "react-icons/fa";

import { GetAllteacher, CreateTeachers, UpdateTeacher, BlockTeacher } from "../../services/authapi";
import { showToast } from "../../utils/toast";
import { useTheme } from "../../components/layout/ThemeContext";
import { teacherSchema } from "../../validations/TeacherValidation";
import { Pagination } from "../../components/common/Pagination";
import { Modal } from "../../components/common/Modal";

interface Subject {
  name: string;
  code: string;
}

interface Teachers {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  position: string;
  blocked: boolean;
  department: "LP" | "UP" | "HS";
  subjects: Subject[];
}

export function TeachersManagement() {
  const { isDark } = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [teachers, setTeachers] = useState<Teachers[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teachers[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editId, setEditId] = useState<string | null>(null);
  const [files, setFiles] = useState<FileList | null>(null);
  const [department, setDepartment] = useState<"LP" | "UP" | "HS" | "">("");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  const itemsPerPage = 5;


  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const data = await GetAllteacher();
      const formatted = data.map((t: any) => ({
        id: t.id || t._id,
        name: t.name,
        email: t.email,
        phone: t.phone,
        gender: t.gender,
        position: t.position || "Teacher",
        blocked: t.blocked || false,
        subjects: t.Subject ?? [],
        department: t.department ?? "LP",
      }));
      setTeachers(formatted);
      setFilteredTeachers(formatted);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      showToast("Error fetching teachers", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    const filtered = teachers.filter(
      (t) =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTeachers(filtered);
    setCurrentPage(1);
  }, [searchTerm, teachers]);

const validateForm = (): boolean => {

  if (
    !name.trim() ||
    !email.trim() ||
    !phone.trim() ||
    !gender.trim() ||
    !department ||
    subjects.length === 0
  ) {
    showToast("All fields are required", "warning");
    return false;
  }
  const result = teacherSchema.safeParse({
    name,
    email,
    phone,
    gender,
    department,
    subjects,
  });

  if (!result.success) {
    
    const allFieldsError = result.error.issues.find(issue => issue.path[0] === "allFields");
    if (allFieldsError) {
      showToast(allFieldsError.message, "warning");
      return false;
    }


    const firstIssue = result.error.issues[0];
    showToast(firstIssue.message, "warning");
    return false;
  }
  return true;
};

  const handleAddSubject = () => {
    if (!newSubjectName.trim()) return;
    setSubjects([...subjects, { name: newSubjectName, code: "" }]);
    setNewSubjectName("");
  };

  const handleRemoveSubject = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);

    try {
      if (editId) {
        await UpdateTeacher(editId, name, email, phone, gender, department, subjects);
        showToast("Teacher updated successfully", "success");
      } else {
        await CreateTeachers(
          name,
          email,
          phone,
          gender,
          "Teacher",
          false,
          department as "LP" | "UP" | "HS",
          subjects,
          undefined,
          files
        );
        showToast("Teacher created successfully", "success");
      }

      setName("");
      setEmail("");
      setPhone("");
      setGender("");
      setDepartment("");
      setSubjects([]);
      setEditId(null);
      setFiles(null);
      setShowModal(false);
      await fetchTeachers();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Error saving teacher";
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setName("");
    setEmail("");
    setPhone("");
    setGender("");
    setDepartment("");
    setSubjects([]);
    setFiles(null);
    setEditId(null);
    setShowModal(false);
  };

  const handleEdit = (teacher: Teachers) => {
    setEditId(teacher.id);
    setName(teacher.name);
    setEmail(teacher.email);
    setPhone(teacher.phone);
    setGender(teacher.gender);
    setDepartment(teacher.department);
    setSubjects(teacher.subjects ?? []);
    setShowModal(true);
  };

  const handleBlock = async (teacher: Teachers) => {
    try {
      const newStatus = !teacher.blocked;
      await BlockTeacher(teacher.id, newStatus);
      showToast(newStatus ? "Teacher blocked successfully" : "Teacher unblocked successfully", "success");
      await fetchTeachers();
    } catch (error) {
      showToast("Error updating teacher status", "error");
      console.error(error);
    }
  };

  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTeachers = filteredTeachers.slice(startIndex, endIndex);

  const TeacherCard = ({ teacher }: { teacher: Teachers }) => (
    <div className={`p-4 rounded-lg border mb-4 ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg mb-1 truncate">{teacher.name}</h3>
          <p className={`text-sm mb-1 truncate ${isDark ? "text-slate-400" : "text-gray-600"}`}>{teacher.email}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-2 ${teacher.blocked ? "bg-red-500 text-red-50" : "bg-green-500 text-green-50"}`}>
          {teacher.blocked ? "Blocked" : "Active"}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <p className={`text-xs font-medium ${isDark ? "text-slate-400" : "text-gray-500"}`}>Phone</p>
          <p className="text-sm font-medium">{teacher.phone}</p>
        </div>
        <div>
          <p className={`text-xs font-medium ${isDark ? "text-slate-400" : "text-gray-500"}`}>Department</p>
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500 text-yellow-50">{teacher.department}</span>
        </div>
      </div>

      {teacher.subjects.length > 0 && (
        <div className="mb-3">
          <p className={`text-xs font-medium mb-1 ${isDark ? "text-slate-400" : "text-gray-500"}`}>Subjects</p>
          <div className="flex flex-wrap gap-1">
            {teacher.subjects.map((sub, index) => (
              <span key={index} className="px-2 py-1 rounded-full bg-orange-500 text-white text-xs">
                {sub.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-2 border-t border-opacity-20">
        <button className={`p-2 rounded-full transition-colors ${isDark ? "hover:bg-gray-700 text-blue-400" : "hover:bg-gray-100 text-blue-600"}`} title="View Details">
          <Eye size={16} />
        </button>
        <button onClick={() => handleEdit(teacher)} className={`p-2 rounded-full transition-colors ${isDark ? "hover:bg-gray-700 text-amber-400" : "hover:bg-gray-100 text-amber-600"}`} title="Edit">
          <Edit size={16} />
        </button>
        <button onClick={() => handleBlock(teacher)} className={`p-2 rounded-full transition-colors ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"} ${teacher.blocked ? "text-green-500" : "text-red-500"}`} title={teacher.blocked ? "Unblock" : "Block"}>
          <UserX size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen p-2 sm:p-4 md:p-6 lg:p-8 ${isDark ? "bg-[#121A21] text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col space-y-4 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Teacher Management</h2>
          
          {/* Search and Add Button */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search by name or email"
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
              <span className="hidden xs:inline">Add Teacher</span>
              <span className="xs:hidden">Add</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className={`rounded-lg overflow-hidden ${isDark ? "bg-slate-800/50" : "bg-white"} shadow-sm`}>
          {loading ? (
            <div className="p-8 sm:p-12 text-center">
              <div className="inline-flex items-center justify-center w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-base sm:text-lg font-medium">Loading teachers...</p>
            </div>
          ) : filteredTeachers.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <p className="text-base sm:text-lg font-medium">No teachers found</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className={`${isDark ? "bg-slate-800" : "bg-gray-50"}`}>
                    <tr className={`border-b ${isDark ? "border-slate-700" : "border-gray-200"}`}>
                      <th className="px-4 py-3 text-left font-semibold text-sm">Name</th>
                      <th className="px-4 py-3 text-left font-semibold text-sm">Email</th>
                      <th className="px-4 py-3 text-left font-semibold text-sm">Phone</th>
                      <th className="px-4 py-3 text-left font-semibold text-sm">Department</th>
                      <th className="px-4 py-3 text-left font-semibold text-sm">Subjects</th>
                      <th className="px-4 py-3 text-left font-semibold text-sm">Status</th>
                      <th className="px-4 py-3 text-center font-semibold text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTeachers.map((t) => (
                      <tr key={t.id} className={`border-b last:border-b-0 hover:bg-opacity-50 ${isDark ? "border-slate-700 hover:bg-slate-700" : "border-gray-200 hover:bg-gray-50"}`}>
                        <td className="px-4 py-3 font-medium text-sm">{t.name}</td>
                        <td className="px-4 py-3 text-sm max-w-[200px] truncate">{t.email}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500 text-blue-50">{t.phone}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500 text-yellow-50">{t.department}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1 max-w-[150px]">
                            {t.subjects.map((sub, index) => (
                              <span key={index} className="px-2 py-1 rounded-full bg-orange-500 text-white text-xs">
                                {sub.name}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${t.blocked ? "bg-red-500 text-red-50" : "bg-green-500 text-green-50"}`}>
                            {t.blocked ? "Blocked" : "Active"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button className={`p-2 rounded-full transition-colors ${isDark ? "hover:bg-gray-700 text-blue-400" : "hover:bg-gray-100 text-blue-600"}`} title="View Details">
                              <Eye size={16} />
                            </button>
                            <button onClick={() => handleEdit(t)} className={`p-2 rounded-full transition-colors ${isDark ? "hover:bg-gray-700 text-amber-400" : "hover:bg-gray-100 text-amber-600"}`} title="Edit">
                              <Edit size={16} />
                            </button>
                            <button onClick={() => handleBlock(t)} className={`p-2 rounded-full transition-colors ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"} ${t.blocked ? "text-green-500" : "text-red-500"}`} title={t.blocked ? "Unblock" : "Block"}>
                              <UserX size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden p-4">
                {currentTeachers.map((teacher) => (
                  <TeacherCard key={teacher.id} teacher={teacher} />
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

       
      

        <Modal
           isOpen={showModal}
           onClose={handleCloseModal}
           title={editId ? "Edit Teacher" : "Add New Teacher"}
             >
              <div className="space-y-4">
                 
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-gray-700"}`}>
                      Full Name *
                    </label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="Enter full name" 
                      className={`w-full px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${isDark ? "bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400" : "bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500"}`} 
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-gray-700"}`}>
                      Email *
                    </label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="Enter email" 
                      className={`w-full px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${isDark ? "bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400" : "bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500"}`} 
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-gray-700"}`}>
                      Phone *
                    </label>
                    <input 
                      type="tel" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      placeholder="Enter 10-digit phone" 
                      className={`w-full px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${isDark ? "bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400" : "bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500"}`} 
                    />
                  </div>

                  {/* Gender and Department in row for desktop */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-gray-700"}`}>
                        Gender *
                      </label>
                      <select 
                        value={gender} 
                        onChange={(e) => setGender(e.target.value)} 
                        className={`w-full px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${isDark ? "bg-slate-700 border-slate-600 text-slate-100" : "bg-gray-50 border-gray-300 text-gray-800"}`}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-gray-700"}`}>
                        Department *
                      </label>
                      <select 
                        value={department} 
                        onChange={(e) => setDepartment(e.target.value as "LP"|"UP"|"HS")} 
                        className={`w-full px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${isDark ? "bg-slate-700 border-slate-600 text-slate-100" : "bg-gray-50 border-gray-300 text-gray-800"}`}
                      >
                        <option value="">Select Department</option>
                        <option value="LP">LP</option>
                        <option value="UP">UP</option>
                        <option value="HS">HS</option>
                      </select>
                    </div>
                  </div>

                  {/* Subjects */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-gray-700"}`}>
                      Subjects
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input 
                        type="text" 
                        value={newSubjectName} 
                        onChange={(e) => setNewSubjectName(e.target.value)} 
                        placeholder="Add subject" 
                        className={`flex-1 px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${isDark ? "bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400" : "bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500"}`} 
                      />
                      <button 
                        type="button" 
                        onClick={handleAddSubject} 
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors flex-shrink-0"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {subjects.map((sub, index) => (
                        <span 
                          key={index} 
                          className={`px-3 py-1 rounded-full text-xs flex items-center gap-2 ${isDark ? "bg-slate-600 text-slate-200" : "bg-gray-200 text-gray-700"}`}
                        >
                          {sub.name} 
                          <X 
                            size={12} 
                            className="cursor-pointer hover:text-red-500" 
                            onClick={() => handleRemoveSubject(index)} 
                          />
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Documents */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-gray-700"}`}>
                      Upload Documents
                    </label>
                    <input 
                      type="file" 
                      multiple 
                      onChange={(e) => setFiles(e.target.files)} 
                      className={`block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:transition-colors ${isDark ? "text-slate-300 file:bg-slate-700 file:text-slate-200 hover:file:bg-slate-600" : "text-gray-500 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"}`} 
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 sm:pt-6">
                    <button 
                      onClick={handleCloseModal} 
                      disabled={loading} 
                      className={`px-4 py-2.5 rounded-lg font-medium border text-sm transition-colors ${isDark ? "bg-transparent border-slate-600 text-slate-400 hover:bg-slate-700" : "bg-transparent border-gray-300 text-gray-500 hover:bg-gray-50"} disabled:opacity-50`}
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSubmit} 
                      disabled={loading} 
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 text-sm transition-colors disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        editId ? "Update Teacher" : "Create Teacher"
                      )}
                    </button>
                  </div>
                </div>
</Modal>

      </div>
    </div>
  );
}