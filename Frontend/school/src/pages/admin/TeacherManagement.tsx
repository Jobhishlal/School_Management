import { useState, useEffect } from "react";
import { Plus, X, Eye, Edit, UserX } from "lucide-react";
import { FaSearch } from "react-icons/fa";

import { GetAllteacher, CreateTeachers,UpdateTeacher,BlockTeacher } from "../../services/authapi";
import { showToast } from "../../utils/toast";
import { useTheme } from "../../components/layout/ThemeContext";

interface Teachers {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  position: string;
  blocked:boolean
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
  const [editId,seteditId]=useState<string | null >(null)
  const itemsPerPage = 5;

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
        status: t.status || "Active",
        blocked: t.blocked || false, 
      } ));

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
    if (!name.trim()) {
      showToast("Name is required", "warning");
      return false;
    }
    if (!email.trim()) {
      showToast("Email is required", "warning");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      showToast("Please enter a valid email", "warning");
      return false;
    }
    if (!phone.trim()) {
      showToast("Phone number is required", "warning");
      return false;
    }
    if (!/^\d{10}$/.test(phone)) {
      showToast("Phone number must be 10 digits", "warning");
      return false;
    }
    if (!gender.trim()) {
      showToast("Gender is required", "warning");
      return false;
    }
    return true;
  };

 const handleSubmit = async () => {
  if (!validateForm()) return;
  setLoading(true);

  try {
    if (editId) {
     await UpdateTeacher(
     editId,               
     name.trim(),
     email.trim(),
     phone.trim(),
     gender.trim()
    );

      showToast("Teacher updated successfully", "success");
    } else {
      await CreateTeachers(name, email, phone, gender);
      showToast("Teacher created successfully", "success");
    }

   
    setName("");
    setEmail("");
    setPhone("");
    setGender("");
    seteditId(null);
    setShowModal(false);
    await fetchTeachers();
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error saving teacher";
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
    setShowModal(false);
  };
  
  const handleAction = (action: string, teacherName: string) => {
    showToast(`${action.charAt(0).toUpperCase() + action.slice(1)} action for ${teacherName}`, "info");
  };


const handleEdit = (teacher: Teachers) => {
  seteditId(teacher.id);
  setName(teacher.name);
  setEmail(teacher.email);
  setPhone(teacher.phone || "");
  setGender(teacher.gender || "");
  setShowModal(true);
};

const handleblock = async (teachers:Teachers)=>{
    try {
        const newStatus = !teachers.blocked;
        await BlockTeacher(teachers.id,newStatus)
        showToast(newStatus?"Teacher blocked Successfully":"Teacher Unblocked Successfully","success")
        await fetchTeachers()
    } catch (error) {
        showToast("Error Updating Teacher Status","error")
        console.error(error)
    }
}


  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTeachers = filteredTeachers.slice(startIndex, endIndex);

  return (
    <div
      className={`min-h-screen p-4 sm:p-6 lg:p-8 ${isDark ? 'bg-[#121A21] text-slate-100' : 'bg-slate-50 text-slate-900'}`}
    >
      <div className="max-w-7xl mx-auto">
       
        <div className="mt-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4">Teacher Management</h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex-1 relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search by name or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full py-2.5 pl-10 pr-4 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${isDark ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400' : 'bg-gray-100 border-gray-300 text-gray-800 placeholder-gray-500'}`}
              />
              <FaSearch
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}
              />
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 sm:px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors whitespace-nowrap text-sm"
            >
              <Plus className="inline-block mr-2" size={16} /> Add New Staff
            </button>
          </div>

          <div className={`rounded-lg overflow-x-auto ${isDark ? 'bg-slate-800/50' : 'bg-white'}`}>
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-lg font-medium">Loading teachers...</p>
              </div>
            ) : filteredTeachers.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-lg font-medium">No teachers found</p>
              </div>
            ) : (
              <table className="min-w-full md:min-w-[800px] lg:min-w-[1000px]">
                <thead className={`${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
                  <tr className={`border-b ${isDark ? 'border-slate-700/50' : 'border-gray-200'}`}>
                    <th className={`px-4 py-3 text-left font-semibold text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Name</th>
                    <th className={`px-4 py-3 text-left font-semibold text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Email</th>
                    <th className={`px-4 py-3 text-left font-semibold text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Phone</th>
                    <th className={`px-4 py-3 text-left font-semibold text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Status</th>
                    <th className={`px-4 py-3 text-center font-semibold text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTeachers.map((t) => (
                    <tr key={t.id} className={`border-b last:border-b-0 ${isDark ? 'border-slate-700/50' : 'border-gray-200'}`}>
                      <td className="px-4 py-3 font-medium text-sm">{t.name}</td>
                      <td className="px-4 py-3 text-sm">{t.email}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: "#3b82f6", color: "#eff6ff" }}>
                          {t.phone}
                        </span>
                      </td>
                     <td className="px-4 py-3">
                    <span
               className={`px-2 py-1 rounded-full text-xs font-medium ${
                 !t.blocked ? "bg-green-500 text-green-50" : "bg-red-500 text-red-50"
                   }`}
               >
               {t.blocked ? "Blocked" : "Active"}
                </span>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleAction("view", t.name)}
                            className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-gray-700 text-blue-400' : 'hover:bg-gray-100 text-blue-600'}`}
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          
                         <button
                         onClick={() => handleEdit(t)}
                           className={`p-2 rounded-full transition-colors ${
                          isDark ? 'hover:bg-gray-700 text-amber-400' : 'hover:bg-gray-100 text-amber-600'
                          }`}
                       title="Edit"
                   >
                    <Edit size={16} />
                        </button>

                          
                         <button
                         onClick={() => handleblock(t)}
                         className={`p-2 rounded-full transition-colors ${
                          isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                          } ${t.blocked ? "text-green-500" : "text-red-500"}`}
                         title={t.blocked ? "Unblock" : "Block"}
                          >
                        <UserX size={16} />
                         </button>

                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4 sm:mt-6">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`
                  px-3 py-1.5 rounded-lg font-medium transition-colors text-xs sm:text-sm
                  ${isDark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                Prev
              </button>
              <span
                className={`text-xs sm:text-sm px-3 py-1.5 rounded-lg ${isDark ? 'bg-slate-700/50 text-slate-300' : 'bg-gray-200 text-gray-700'}`}
              >
                {currentPage}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`
                  px-3 py-1.5 rounded-lg font-medium transition-colors text-xs sm:text-sm
                  ${isDark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                Next
              </button>
            </div>
          )}
        </div>

        {showModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-gray-900 bg-opacity-75">
            <div
            className={`w-full md:max-w-md max-h-[90vh] overflow-y-auto rounded-lg shadow-xl border ${isDark ? 'bg-slate-800 border-slate-700/50' : 'bg-white border-gray-200'}`}
        >
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-bold">Add New Teacher</h3>
                  <button
                    onClick={handleCloseModal}
                    className={`p-2 rounded-lg hover:bg-gray-500/10 transition-colors ${isDark ? 'text-slate-400' : 'text-gray-500'}`}
                  >
                    <X size={16} className="sm:w-5 sm:h-5" />
                  </button>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label
                      className={`block text-xs sm:text-sm font-medium mb-1 sm:mb-2 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      placeholder="Enter full name"
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full px-3 py-2 sm:py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${isDark ? 'bg-slate-700 border-slate-600 text-slate-100' : 'bg-gray-100 border-gray-300 text-gray-800'}`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-xs sm:text-sm font-medium mb-1 sm:mb-2 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      placeholder="Enter email address"
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-3 py-2 sm:py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${isDark ? 'bg-slate-700 border-slate-600 text-slate-100' : 'bg-gray-100 border-gray-300 text-gray-800'}`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-xs sm:text-sm font-medium mb-1 sm:mb-2 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      placeholder="Enter 10-digit phone number"
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full px-3 py-2 sm:py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${isDark ? 'bg-slate-700 border-slate-600 text-slate-100' : 'bg-gray-100 border-gray-300 text-gray-800'}`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-xs sm:text-sm font-medium mb-1 sm:mb-2 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}
                    >
                      Gender
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className={`w-full px-3 py-2 sm:py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${isDark ? 'bg-slate-700 border-slate-600 text-slate-100' : 'bg-gray-100 border-gray-300 text-gray-800'}`}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 sm:pt-6">
                    <button
                      onClick={handleCloseModal}
                      disabled={loading}
                      className={`px-4 py-2 sm:py-2.5 rounded-lg font-medium border transition-colors text-sm order-2 sm:order-1 ${isDark ? 'bg-transparent border-slate-700/50 text-slate-400' : 'bg-transparent border-gray-300 text-gray-500'}`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="px-4 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors text-sm order-1 sm:order-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Creating...
                        </>
                      ) : (
                        "Create Teacher"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}