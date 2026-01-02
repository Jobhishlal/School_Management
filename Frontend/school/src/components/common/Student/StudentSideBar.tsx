import React, { useState } from "react";
import { NotificationDropdown } from "../../../pages/Student/NotificationDropdown";
import {
  Sun,
  Moon,
  LayoutDashboard,
  User,
  Calendar,
  FileText,
  MessageCircle,
  Users,
  GraduationCap,
  BookOpen,
  CreditCard,
  Bell,
  ChevronDown,
  X,
  Menu,
  LogOut,
  School,
} from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../layout/ThemeContext";

type Props = { children?: React.ReactNode };

export default function StudentSidebar({ children }: Props) {
  const { isDark, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const studentId = localStorage.getItem("studentId");
  console.log(studentId)
  const [showNotifications, setShowNotifications] = useState(false);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch announcements on mount and calculate unread count
  React.useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const { AnnouncementFetch } = await import("../../../services/authapi"); // Dynamic import to avoid circular dependency if any
        const res = await AnnouncementFetch();

        let fetchedData: any[] = [];
        if (res && res.success && Array.isArray(res.data)) {
          fetchedData = res.data;
        } else if (Array.isArray(res)) {
          fetchedData = res;
        }

        setAnnouncements(fetchedData);

        // Calculate unread count
        const readIds = JSON.parse(localStorage.getItem("readAnnouncementIds") || "[]");
        const unread = fetchedData.filter((a: any) => !readIds.includes(a._id)).length;
        setUnreadCount(unread);

      } catch (err) {
        console.error("Failed to fetch notifications", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
    // Poll every 60 seconds to keep updated
    const interval = setInterval(fetchAnnouncements, 60000);
    return () => clearInterval(interval);
  }, []);

  const markAllAsRead = () => {
    if (announcements.length === 0) return;

    const allIds = announcements.map(a => a._id);
    localStorage.setItem("readAnnouncementIds", JSON.stringify(allIds));
    setUnreadCount(0);
  };

  const location = useLocation();
  const navigate = useNavigate();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  React.useEffect(() => {
    localStorage.setItem("role", "students");
  }, []);

  const menuItems = [
    { icon: LayoutDashboard, text: "Dashboard", path: "/student-dashboard" },
    { icon: User, text: "Profile", path: "/student/profile" },
    { icon: Calendar, text: "Attendance", path: "/student/attendance-view" },
    { icon: FileText, text: "Assignments", path: "/student/assignment" },
    { icon: Calendar, text: "Time Table", path: "/student/timetable-view" },
    { icon: BookOpen, text: "Exams & Results", path: '/student/exam-list' },
    { icon: CreditCard, text: "Fees", path: "/student/fees" },
    { icon: MessageCircle, text: "Notices / Messages", path: "/student/notices" },
    { icon: Users, text: "Meet", path: "/student/meet" },
    { icon: GraduationCap, text: "AI Study Helper", path: "/student/ai-helper" },
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

  const handleLogout = () => {
    localStorage.removeItem("studentAccessToken");
    if (localStorage.getItem("role") === "students") {
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

          <h1 className={`text-lg font-bold ${textPrimary}`}>Student Portal</h1>
        </div>
        <button
          onClick={toggleTheme}
          className={`p-2.5 rounded-xl ${hoverBg} transition-all duration-300 hover:scale-105 hover:rotate-12`}
        >
          {isDark ? <Sun className="text-amber-400" size={20} /> : <Moon className="text-slate-600" size={20} />}
        </button>
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
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <School className="text-white" size={24} />
              </div>
              <div className="flex flex-col">
                <span className={`font-bold text-lg tracking-tight ${textPrimary}`}>
                  Student Portal
                </span>
                <span className={`text-xs ${textSecondary} font-medium`}>
                  School Management
                </span>
              </div>
            </div>
          </div>


          <div className="px-4 space-y-1">
            {menuItems.map((item, index) => {
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


          <div className="p-4 mt-auto">
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


          <div
            className={`hidden lg:flex items-center justify-between px-8 py-4 ${headerBg} ${headerBorder} border-b backdrop-blur-xl shadow-sm`}
          >

            <div className={`px-6 py-3 rounded-2xl ${cardBg} backdrop-blur-xl border ${headerBorder} shadow-sm`}>
              <span className={`text-xl font-bold ${textPrimary} tracking-tight`}>
                {menuItems.find((m) => m.path === location.pathname)?.text || "Dashboard"}
              </span>
            </div>

            <div className="flex items-center space-x-4">

              <button
                className={`relative p-3 rounded-xl ${hoverBg} transition-all duration-300 hover:scale-105`}
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className={textSecondary} size={20} />
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{unreadCount}</span>
                  </div>
                )}
              </button>

              <NotificationDropdown
                isOpen={showNotifications}
                onClose={() => setShowNotifications(false)}
                announcements={announcements}
                loading={loading}
                onClear={markAllAsRead}
                unreadCount={unreadCount}
              />

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
                  <span className={`text-sm font-medium ${textPrimary}`}>Student</span>
                  <ChevronDown
                    size={16}
                    className={`${textSecondary} transition-transform duration-200 ${showProfileDropdown ? "rotate-180" : ""}`}
                  />
                </button>


                {showProfileDropdown && (
                  <div
                    className={`absolute right-0 top-full mt-2 w-48 ${cardBg} backdrop-blur-xl border ${headerBorder} rounded-xl shadow-xl z-50 py-2`}
                  >
                    <Link to="/student/profile">
                      <User size={16} className={textSecondary} />
                      <span className={`text-sm ${textPrimary}`}>Profile</span>
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
              <Outlet />
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
