
import React, { useState } from "react";
import {
  Sun,
  Moon,
  School,
  LayoutDashboard,
  Users,
  GraduationCap,
  UserCheck,
  Megaphone,
  AlertCircle,
  DollarSign,
  FileText,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  User,
  Video,
} from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../layout/ThemeContext";
import { getInstituteProfile } from "../../../services/authapi";

type Props = {
  children?: React.ReactNode;
};

export default function SchoolNavbar({ children }: Props) {
  const { isDark, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [instituteDetails, setInstituteDetails] = useState({
    name: 'BRAINNIX',
    logo: ''
  });

  React.useEffect(() => {
    const fetchInstituteDetails = async () => {
      try {
        const res = await getInstituteProfile();
        if (res?.institute?.length > 0) {
          const inst = res.institute[0];
          setInstituteDetails({
            name: inst.instituteName || 'BRAINNIX',
            logo: inst.logo?.[0]?.url || ''
          });
        }
      } catch (error) {
        console.error("Failed to fetch institute details", error);
      }
    };
    fetchInstituteDetails();
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const location = useLocation();
  const navigate = useNavigate();

  const userRole = localStorage.getItem("role");




  React.useEffect(() => {

    if (userRole !== "sub_admin") {
      localStorage.setItem("role", "super_admin");
    }
  }, [userRole]);

  const menuItems = [
    {
      label: "SCHOOL MANAGEMENT",
      links: [
        { icon: LayoutDashboard, text: "Dashboard", path: "/dashboard" },
        { icon: Users, text: "Admins Management", path: "/admins" },
        { icon: GraduationCap, text: "Student Management", path: "/student-management" },

        ...(userRole === "sub_admin"
          ? [{ icon: UserCheck, text: "Admin Profile", path: "/adminprofile" }]
          : []),

        ...(userRole === "super_admin"
          ? [
            { icon: Settings, text: "Institute Profile", path: "/instituteprofile" },
            { icon: GraduationCap, text: "Approvals", path: "/admin-approval" },
          ]
          : []),

        { icon: Megaphone, text: "Teacher Management", path: "/teachers" },
        { icon: AlertCircle, text: "Class Base Access", path: "/classbaseview" },
        { icon: DollarSign, text: "Finance", path: "/finance-management" },
        { icon: AlertCircle, text: "Announcement", path: '/Announcement' },
      ],
    },

    {
      label: "COMMUNICATION",
      links: [

        { icon: FileText, text: "Leave Request", path: "/leave-management" },
        ...(userRole === "sub_admin"
          ? [{ icon: FileText, text: "My Leave", path: "/subadmin-leave-application" }]
          : []),
        { icon: Calendar, text: "Time Table", path: "/timetable-management" },
        { icon: AlertCircle, text: "Complaints", path: "/complaints" },
        { icon: Video, text: "Video Conference", path: "/create-meeting" },
      ],
    },
  ];

  const sidebarBg = isDark ? "bg-[#121A21]" : "bg-[#fafbfc]";

  const headerBg = isDark ? "bg-[#121A21]" : "bg-white";
  const headerBorder = isDark ? "border-slate-700/30" : "border-slate-200/50";
  const cardBg = isDark ? "bg-slate-800/50" : "bg-white";
  const hoverBg = isDark ? "hover:bg-slate-700/30" : "hover:bg-slate-50";
  const textPrimary = isDark ? "text-slate-100" : "text-slate-900";
  const textSecondary = isDark ? "text-slate-400" : "text-slate-600";
  const activeBg = isDark ? "bg-blue-600/20" : "bg-blue-50";
  const activeText = isDark ? "text-blue-400" : "text-blue-600";

  // ------------------ LOGOUT FUNCTION ------------------
  const handleLogout = () => {

    localStorage.removeItem("adminAccessToken");



    if (localStorage.getItem("role") === "super_admin" || localStorage.getItem("role") === "sub_admin") {
      localStorage.removeItem("role");
      localStorage.removeItem("accessToken");
    }


    navigate("/login", { replace: true });
  };

  return (
    <div
      className={`h-screen overflow-hidden transition-all duration-500 ${isDark ? "bg-[#121A21]" : "bg-slate-50"
        }`}
    >
      <div
        className={`lg:hidden flex items-center justify-between px-4 py-3 ${headerBg} ${headerBorder} border-b backdrop-blur-xl`}
      >
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleMobileMenu}
            className={`p-2.5 rounded-xl ${hoverBg} transition-all duration-200 hover:scale-105`}
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              {instituteDetails.logo ? (
                <img src={instituteDetails.logo} alt="Logo" className="w-6 h-6 object-cover rounded" />
              ) : (
                <School className="text-white" size={24} />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight">{instituteDetails.name}</span>
              <span className={`text-xs ${textSecondary} font-medium`}>School Management</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-xl ${hoverBg} transition-all duration-300 hover:scale-105 hover:rotate-12`}
          >
            {isDark ? <Sun className="text-amber-400" size={20} /> : <Moon className="text-slate-600" size={20} />}
          </button>
        </div>
      </div>

      <div className="flex h-full">
        <div
          className={`
            fixed lg:relative top-0 left-0 z-50 h-full w-72
            transform transition-all duration-500 ease-out
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            ${sidebarBg} backdrop-blur-xl
            overflow-y-auto no-scrollbar
          `}
        >
          <div className="p-6">
            <div className={`flex items-center space-x-3 p-4 rounded-2xl`}>
              <div className="relative">
                <div className="p-3">
                  {instituteDetails.logo ? (
                    <img src={instituteDetails.logo} alt="Logo" className="w-8 h-8 object-cover rounded" />
                  ) : (
                    <School className="text-white" size={24} />
                  )}
                </div>
              </div>
              <div className="flex flex-col">
                <span className={`font-bold text-lg tracking-tight ${textPrimary}`}>{instituteDetails.name}</span>
              </div>
            </div>
          </div>

          <div className="flex-1 px-4 space-y-4">
            {menuItems.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <h3 className="uppercase text-slate-500 text-xs font-semibold py-2">{section.label}</h3>
                <div className="space-y-1">
                  {section.links.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={index}
                        to={item.path}
                        className={`
                          relative group flex items-center space-x-3 px-4 py-3 rounded-xl text-left
                          transition-all duration-300
                          ${isActive ? `${activeBg} ${activeText} font-semibold` : `${hoverBg} ${textSecondary} hover:text-white`}
                        `}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full"></div>
                        )}
                        <Icon size={18} />
                        <span className="text-sm font-medium">{item.text}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Logout */}
          <div className="p-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-xl bg-gray-700/50 hover:bg-gray-700 text-white transition-colors duration-200"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>

        <div className={`flex-1 flex flex-col h-full ${isDark ? "bg-[#121A21]" : "bg-slate-50"}`}>
          {/* Header */}
          <div className={`hidden lg:flex items-center justify-between px-8 py-4 ${headerBg} ${headerBorder} border-b backdrop-blur-xl shadow-sm`}>
            <div className="flex items-center space-x-6">
              <div className={`px-6 py-3 rounded-2xl ${cardBg} backdrop-blur-xl border ${headerBorder} shadow-sm`}>
                <span className={`text-xl font-bold ${textPrimary} tracking-tight`}>
                  {menuItems.find(section => section.links.find(link => link.path === location.pathname))
                    ?.links.find(link => link.path === location.pathname)?.text || "Dashboard"}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className={`relative p-3 rounded-xl ${hoverBg} transition-all duration-300 hover:scale-105`}>
                <Bell className={textSecondary} size={20} />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
              </button>

              <button
                onClick={toggleTheme}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl ${hoverBg} transition-all duration-300 hover:scale-105`}
              >
                {isDark ? (
                  <>
                    <Sun className="text-amber-400" size={18} />
                    <span className={`text-sm font-medium ${textPrimary}`}>Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="text-slate-600" size={18} />
                    <span className={`text-sm font-medium ${textPrimary}`}>Dark</span>
                  </>
                )}
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl ${hoverBg} transition-all duration-300 hover:scale-105`}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                  <span className={`text-sm font-medium ${textPrimary}`}>Admin</span>
                  <ChevronDown
                    size={16}
                    className={`${textSecondary} transition-transform duration-200 ${showProfileDropdown ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Profile Dropdown Logout */}
                {showProfileDropdown && (
                  <div className={`absolute right-0 top-full mt-2 w-48 ${cardBg} backdrop-blur-xl border ${headerBorder} rounded-xl shadow-xl z-50 py-2`}>
                    <Link to="/profile" className={`flex items-center space-x-3 px-4 py-3 ${hoverBg} transition-colors duration-200`}>
                      <Settings size={16} className={textSecondary} />
                      <span className={`text-sm ${textPrimary}`}>Settings</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className={`w-full flex items-center space-x-3 px-4 py-3 ${hoverBg} transition-colors duration-200 text-red-500 hover:text-red-600`}
                    >
                      <LogOut size={16} />
                      <span className="text-sm">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <main className="flex-1 p-6 lg:p-8 overflow-y-auto no-scrollbar">
            <div className="max-w-full mx-auto">
              {children || <Outlet />}
            </div>
          </main>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={toggleMobileMenu}
        />
      )}

      {showProfileDropdown && (
        <div className="fixed inset-0 z-30" onClick={() => setShowProfileDropdown(false)} />
      )}
    </div>
  );
}
