
import { useState, useEffect } from "react";
import { Eye, Edit, UserX, Plus } from "lucide-react";
import { FaSearch, } from "react-icons/fa";

import { SubAdminCreate, GetSubAdmins, UpdateSubAdmin, SubAdminBlock } from "../../services/authapi";
import { showToast } from "../../utils/toast";
import { useTheme } from "../../components/layout/ThemeContext";
import { AdminSchema } from "../../validations/AdminValidation";
import { Pagination } from "../../components/common/Pagination";
import { Modal } from "../../components/common/Modal";
import { AdminForm } from "../../components/Form/AdminManagement/AdminForm";
import { Table, type Column } from "../../components/Table/Table";

interface SubAdmin {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  blocked: boolean;
  status?: string;
}

export function AdminManagement() {
  const { isDark } = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("Finance");
  const [subAdmins, setSubAdmins] = useState<SubAdmin[]>([]);
  const [filteredAdmins, setFilteredAdmins] = useState<SubAdmin[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [editingId, setEditingId] = useState<string | null>(null);
  const itemsPerPage = 5;




  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const data = await GetSubAdmins();

      const adminsWithStatus = data.map((admin: any) => ({
        id: admin.id || admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
        blocked: admin.blocked,
        status: admin.blocked ? "Blocked" : "Active",
      }));

      setSubAdmins(adminsWithStatus);
      setFilteredAdmins(adminsWithStatus);
    } catch (error) {
      console.error("Error fetching admins:", error);
      showToast("Error fetching admins", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  useEffect(() => {
    const filtered = subAdmins.filter(admin => {
      const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.role.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = filterRole === "All" || admin.role === filterRole;
      const matchesStatus = filterStatus === "All" || admin.status === filterStatus;

      return matchesSearch && matchesRole && matchesStatus;
    });

    setFilteredAdmins(filtered);
    setCurrentPage(1);
  }, [searchTerm, subAdmins, filterRole, filterStatus]);

  const validateForm = (): boolean => {

    if (!name || !phone || !email || !role) {
      showToast("All fields are required", "warning");
      return false;
    }


    const result = AdminSchema.safeParse({
      name,
      email,
      phone,
      role,
      blocked: false,
    });

    if (!result.success) {

      const firstError = result.error.issues[0].message;
      showToast(firstError, "warning");
      return false;
    }

    return true;
  };

  const superadmin = localStorage.getItem("role")



  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (editingId) {

        await UpdateSubAdmin(editingId, {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          role,
        });
        showToast("Admin updated successfully", "success");
      } else {

        await SubAdminCreate(name, email, phone, role);
        showToast("Admin created successfully", "success");
      }

      setEditingId(null);
      setName("");
      setEmail("");
      setPhone("");
      setRole("Finance");
      setShowModal(false);

      await fetchAdmins();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Error saving admin";
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };





  const handleView = (admin: SubAdmin) => {
    console.log("Viewing admin details:", admin);
    showToast("not complete", "info");
  };

  const handleEdit = (admin: SubAdmin) => {
    setEditingId(admin.id)

    setName(admin.name)
    setEmail(admin.email)
    setPhone(admin.phone)
    setRole(admin.role)
    setShowModal(true)
  };

  const handleToggleBlock = async (admin: SubAdmin) => {
    try {
      const newStatus = !admin.blocked;
      await SubAdminBlock(admin.id, newStatus);

      showToast(
        `Admin ${newStatus ? "blocked" : "unblocked"} successfully`,
        "success"
      );

      await fetchAdmins();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Error updating block status";
      showToast(errorMessage, "error");
    }
  };

  const handleCloseModal = () => {
    setName("");
    setEmail("");
    setPhone("");
    setRole("Finance");
    setShowModal(false);
  };

  const getRoleColor = (role: string) => {
    const colors = {
      'Finance': isDark ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-600 border-blue-200',
      'Communication': isDark ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-green-50 text-green-600 border-green-200',
      'School_Management': isDark ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-purple-50 text-purple-600 border-purple-200',
      'Student_Management': isDark ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-orange-50 text-orange-600 border-orange-200',
      'Parents_Management': isDark ? 'bg-pink-500/10 text-pink-400 border-pink-500/20' : 'bg-pink-50 text-pink-600 border-pink-200',

    };
    return colors[role as keyof typeof colors] || (isDark ? 'bg-gray-500/10 text-gray-400 border-gray-500/20' : 'bg-gray-50 text-gray-600 border-gray-200');
  };

  const getStatusColor = (status: string) => {
    if (status === 'Active') {
      return isDark ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-green-50 text-green-600 border-green-200';
    }
    return isDark ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-red-50 text-red-600 border-red-200';
  };

  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAdmins = filteredAdmins.slice(startIndex, endIndex);

  const bgMain = isDark ? '#121A21' : '#f8fafc';
  const bgCard = isDark ? '#1e293b' : '#ffffff';
  const bgInput = isDark ? '#334155' : '#ffffff';
  const textPrimary = isDark ? '#f8fafc' : '#1e293b';
  const textSecondary = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#374151' : '#e2e8f0';


  const adminColumns: Column<SubAdmin>[] = [
    {
      label: "Name", render: (admin: SubAdmin, index: number) => (
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-white text-sm bg-gradient-to-r ${index % 4 === 0 ? "from-blue-500 to-purple-500" :
            index % 4 === 1 ? "from-green-500 to-teal-500" :
              index % 4 === 2 ? "from-orange-500 to-red-500" :
                "from-pink-500 to-rose-500"
            }`}>{admin.name.charAt(0).toUpperCase()}</div>
          <div>
            <div className="font-medium text-sm">{admin.name}</div>
            <div className="text-xs">{admin.phone}</div>
          </div>
        </div>
      )
    },
    { label: "Email", key: "email" },
    { label: "Position", key: "role", render: (admin: SubAdmin) => <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getRoleColor(admin.role)}`}>{admin.role.replace(/_/g, " ")}</span> },
    { label: "Status", key: "status", render: (admin: SubAdmin) => <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(admin.status || 'Active')}`}>{admin.status}</span> },
  ];

  return (

    <div
      style={{ backgroundColor: bgMain, color: textPrimary, minHeight: '100vh' }}
      className="overflow-x-hidden"
    >

      <div className="max-w-7xl mx-auto p-4 sm:p-6">

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Admin Management</h1>
          <p style={{ color: textSecondary }} className="text-sm">
            Manage your administrative staff and their roles
          </p>
        </div>

        {/* Search and Filters Header */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: textSecondary }} />
              <input
                type="text"
                placeholder="Search by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm transition-all"
                style={{
                  backgroundColor: bgInput,
                  borderColor: borderColor,
                  color: textPrimary
                }}
              />
            </div>

            {superadmin === "super_admin" && (
              <button
                onClick={() => setShowModal(true)}
                className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all text-sm whitespace-nowrap shadow-lg shadow-blue-500/20 active:scale-95"
              >
                <Plus size={18} />
                Add New Staff
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-4">
            <div className="flex-1 min-w-[140px]">
              <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1.5 ml-1 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                Filter by Role
              </label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm transition-all appearance-none cursor-pointer"
                style={{
                  backgroundColor: bgInput,
                  borderColor: borderColor,
                  color: textPrimary
                }}
              >
                <option value="All">All Roles</option>
                <option value="Finance">Finance</option>
                <option value="Communication">Communication</option>
                <option value="School_Management">School Management</option>
                <option value="Student_Management">Student Management</option>
                <option value="Parents_Management">Parents Management</option>
              </select>
            </div>

            <div className="flex-1 min-w-[140px]">
              <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1.5 ml-1 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm transition-all appearance-none cursor-pointer"
                style={{
                  backgroundColor: bgInput,
                  borderColor: borderColor,
                  color: textPrimary
                }}
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>
          </div>
        </div>


        <div
          className="rounded-lg shadow-sm overflow-hidden"
          style={{ backgroundColor: bgCard, borderColor: borderColor }}
        >
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-lg font-medium">Loading admins...</p>
            </div>
          ) : filteredAdmins.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-4xl mb-4" style={{ color: textSecondary }}>👥</div>
              <p className="text-lg font-medium mb-2">No admins found</p>
              <p className="text-sm" style={{ color: textSecondary }}>
                {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first admin'}
              </p>
            </div>
          ) : (
            <>

              <div className="hidden lg:block overflow-x-auto">
                <Table
                  columns={adminColumns}
                  data={currentAdmins}
                  actions={(admin) => (
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleView(admin)}><Eye size={16} /></button>
                      {superadmin === "super_admin" && (
                        <button onClick={() => handleEdit(admin)}><Edit size={16} /></button>
                      )}

                      {
                        superadmin === "super_admin" && (
                          <button onClick={() => handleToggleBlock(admin)}><UserX size={16} /></button>
                        )
                      }

                    </div>
                  )}
                  isDark={isDark}
                />
              </div>

              <div className="lg:hidden space-y-4 p-4">
                {currentAdmins.map((admin, index) => (
                  <div
                    key={admin.id || admin._id}
                    className="p-5 rounded-2xl border transition-all duration-300 hover:shadow-lg"
                    style={{ backgroundColor: bgCard, borderColor: borderColor }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-lg bg-gradient-to-br shadow-lg ${index % 4 === 0 ? 'from-blue-500 to-indigo-600 shadow-blue-500/20' :
                          index % 4 === 1 ? 'from-emerald-500 to-teal-600 shadow-emerald-500/20' :
                            index % 4 === 2 ? 'from-orange-500 to-amber-600 shadow-orange-500/20' :
                              'from-pink-500 to-rose-600 shadow-pink-500/20'
                          }`}>
                          {admin.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-base truncate">{admin.name}</h3>
                          <div className={`px-2 py-0.5 mt-1 rounded text-[10px] font-black uppercase tracking-widest inline-block border ${getRoleColor(admin.role)}`}>
                            {admin.role.replace(/_/g, ' ')}
                          </div>
                        </div>
                      </div>
                      <div className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm ${getStatusColor(admin.status || 'Active')}`}>
                        {admin.status || 'Active'}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 mb-5">
                      <div className="flex items-center gap-2 group">
                        <div className={`p-2 rounded-lg ${isDark ? "bg-slate-700/50" : "bg-slate-50"}`}>
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </div>
                        <p className="text-sm font-medium truncate opacity-80">{admin.email}</p>
                      </div>
                      <div className="flex items-center gap-2 group">
                        <div className={`p-2 rounded-lg ${isDark ? "bg-slate-700/50" : "bg-slate-50"}`}>
                          <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        </div>
                        <p className="text-sm font-medium opacity-80">{admin.phone}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-dashed border-slate-700/30">
                      <button
                        onClick={() => handleView(admin)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${isDark ? "bg-blue-600/10 text-blue-400 hover:bg-blue-600/20" : "bg-blue-50 text-blue-600 hover:bg-blue-100"}`}
                      >
                        <Eye size={14} /> View
                      </button>
                      {superadmin === "super_admin" && (
                        <>
                          <button
                            onClick={() => handleEdit(admin)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${isDark ? "bg-amber-600/10 text-amber-400 hover:bg-amber-600/20" : "bg-amber-50 text-amber-600 hover:bg-amber-100"}`}
                          >
                            <Edit size={14} /> Edit
                          </button>
                          <button
                            onClick={() => handleToggleBlock(admin)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${isDark ? "bg-red-600/10 text-red-400 hover:bg-red-600/20" : "bg-red-50 text-red-600 hover:bg-red-100"}`}
                          >
                            <UserX size={14} /> {admin.blocked ? "Unblock" : "Block"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
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
          title={editingId ? "Edit Admin" : "Add New Admin"}
          isOpen={showModal}
          onClose={handleCloseModal}>

          <AdminForm
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            phone={phone}
            setPhone={setPhone}
            role={role}
            setRole={setRole}
            onSubmit={handleSubmit}
            loading={loading}
            isDark={isDark}
            onCancel={handleCloseModal}
            editing={!!editingId}
          />

        </Modal>
      </div>
    </div>
  );
}