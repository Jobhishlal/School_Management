



// import React, { useState } from "react";
// import {
//   Sun,
//   Moon,
//   School,
//   LayoutDashboard,
//   Users,
//   GraduationCap,
//   UserCheck,
//   Megaphone,
//   AlertCircle,
//   DollarSign,
//   MessageCircle,
//   FileText,
//   Calendar,
//   Settings,
//   LogOut,
//   Menu,
//   X,
// } from "lucide-react";
// import { Link, Outlet, useLocation } from "react-router-dom";
// import { useTheme } from "../../layout/ThemeContext";

// type Props = {
//   children?: React.ReactNode; 
// };

// export default function SchoolNavbar({ children }: Props) {
//   const { isDark, toggleTheme } = useTheme();
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

//   const location = useLocation();

//   const menuItems = [
//     { icon: LayoutDashboard, text: "Dashboard", path: "/dashboard" },
//     { icon: Users, text: "Admins Management", path: "/admins" },
//     { icon: GraduationCap, text: "Student Management", path: "/students" },
//     { icon: UserCheck, text: "Parents Management", path: "/parents" },
//     { icon: Megaphone, text: "Teacher Management", path: "/teachers" },
//     { icon: AlertCircle, text: "Raise & View Complaints", path: "/complaints" },
//     { icon: DollarSign, text: "Finance", path: "/finance" },
//     { icon: MessageCircle, text: "Communication", path: "/communication" },
//     { icon: FileText, text: "Leave Request", path: "/leave-request" },
//     { icon: Calendar, text: "Time Table", path: "/timetable" },
//     { icon: Settings, text: "Settings", path: "/profile" },
//   ];

//   const themeClasses = isDark
//     ? "bg-[#121A21] text-white border-gray-700"
//     : "bg-white text-gray-900 border-gray-200 shadow-lg";

//   const hoverClasses = isDark ? "hover:bg-gray-700/50" : "hover:bg-gray-50";

//   const activeClasses = isDark
//     ? "bg-blue-600/20 border-r-2 border-blue-400 text-blue-400"
//     : "bg-blue-50 border-r-2 border-blue-600 text-blue-600";

//   return (
//     <div
//       className={`h-screen overflow-hidden transition-colors duration-300 ${
//         isDark ? "bg-[#121A21]" : "bg-gray-50"
//       }`}
//     >
//       {/* Mobile Header */}
//       <div
//         className={`lg:hidden flex items-center justify-between p-4 ${themeClasses} border-b`}
//       >
//         <div className="flex items-center space-x-3">
//           <button
//             onClick={toggleMobileMenu}
//             className={`p-2 rounded-lg ${hoverClasses} transition-colors duration-200`}
//           >
//             {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
//           <School className="text-blue-500" size={28} />
//           <span className="text-xl font-bold">SCHOOL MANAGEMENT</span>
//         </div>
//         <div className="flex items-center space-x-3">
//           <button
//             onClick={toggleTheme}
//             className={`p-2 rounded-lg ${hoverClasses} transition-all duration-300 hover:scale-105`}
//           >
//             {isDark ? (
//               <Sun className="text-yellow-400" size={20} />
//             ) : (
//               <Moon className="text-gray-600" size={20} />
//             )}
//           </button>
//           <button
//             className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${hoverClasses} transition-all duration-200 hover:scale-105`}
//           >
//             <LogOut size={18} />
//             <span className="text-sm font-medium">Logout</span>
//           </button>
//         </div>
//       </div>

//       <div className="flex h-full">
//         {/* Sidebar */}
//         <div
//           className={`
//           fixed lg:relative top-0 left-0 z-50 h-full w-80
//           transform transition-transform duration-300 ease-in-out
//           ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
//           ${themeClasses} border-r
//         `}
//         >
//           {/* Header */}
//           <div className="p-6 border-b border-opacity-20">
//             <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
//               <div className="p-2 bg-blue-500/20 rounded-lg">
//                 <School className="text-blue-400" size={24} />
//               </div>
//               <span className="text-sm font-bold tracking-wide">BRAINNIX</span>
//             </div>
//           </div>

//           {/* Menu Items */}
//           <div className="flex-1 overflow-y-auto py-4 px-3">
//             <nav className="space-y-1">
//               {menuItems.map((item, index) => {
//                 const Icon = item.icon;
//                 const isActive = location.pathname === item.path;
//                 return (
//                   <Link
//                     key={index}
//                     to={item.path}
//                     className={`
//                       w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left
//                       transition-all duration-200 hover:scale-[1.02] group
//                       ${isActive ? activeClasses : hoverClasses}
//                     `}
//                   >
//                     <Icon
//                       size={20}
//                       className={`
//                         transition-all duration-200 group-hover:scale-110
//                         ${
//                           isActive
//                             ? "text-blue-400"
//                             : isDark
//                             ? "text-gray-400"
//                             : "text-gray-600"
//                         }
//                       `}
//                     />
//                     <span
//                       className={`text-sm font-medium ${
//                         isActive ? "font-semibold" : ""
//                       }`}
//                     >
//                       {item.text}
//                     </span>
//                     {isActive && (
//                       <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
//                     )}
//                   </Link>
//                 );
//               })}
//             </nav>
//           </div>

//           {/* Mobile close button */}
//           <div className="lg:hidden p-4 border-t border-opacity-20">
//             <button
//               onClick={toggleMobileMenu}
//               className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl ${hoverClasses} transition-all duration-200`}
//             >
//               <X size={18} />
//               <span className="text-sm font-medium">Close Menu</span>
//             </button>
//           </div>
//         </div>

//         {/* Main Content Area */}
//         <div
//           className={`flex-1 flex flex-col h-full lg:ml-0 ${
//             isDark ? "bg-[#121A21]" : "bg-gray-50"
//           }`}
//         >
//           {/* Desktop Header */}
//           <div
//             className={`hidden lg:flex items-center justify-between p-6 ${themeClasses} border-b flex-shrink-0`}
//           >
//             <div className="flex items-center space-x-4">
//               <div
//                 className={`px-4 py-2 rounded-lg ${
//                   isDark ? "bg-gray-800" : "bg-gray-100"
//                 }`}
//               >
//                 <span className="text-lg font-semibold">Dashboard</span>
//               </div>
//             </div>

//             <div className="flex items-center space-x-4">
//               <button
//                 onClick={toggleTheme}
//                 className={`
//                   flex items-center space-x-2 px-4 py-2 rounded-lg 
//                   ${hoverClasses} transition-all duration-300 hover:scale-105
//                 `}
//               >
//                 {isDark ? (
//                   <>
//                     <Sun className="text-yellow-400" size={18} />
//                     <span className="text-sm font-medium">Light Mode</span>
//                   </>
//                 ) : (
//                   <>
//                     <Moon className="text-gray-600" size={18} />
//                     <span className="text-sm font-medium">Dark Mode</span>
//                   </>
//                 )}
//               </button>

//               <button
//                 className={`
//                 flex items-center space-x-2 px-4 py-2 rounded-lg 
//                 ${
//                   isDark
//                     ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
//                     : "bg-red-50 text-red-600 hover:bg-red-100"
//                 }
//                 transition-all duration-200 hover:scale-105
//               `}
//               >
//                 <LogOut size={18} />
//                 <span className="text-sm font-medium">Logout</span>
//               </button>
//             </div>
//           </div>

//           {/* Main Content */}
//           <main className="flex-1 p-6 overflow-y-auto">
//             <Outlet />
//           </main>
//         </div>
//       </div>

//       {/* Mobile Overlay */}
//       {isMobileMenuOpen && (
//         <div
//           className="lg:hidden fixed inset-0 bg-black/50 z-40"
//           onClick={toggleMobileMenu}
//         />
//       )}
//     </div>
//   );
// }



// import React, { useState } from "react";
// import {
//   Sun,
//   Moon,
//   School,
//   LayoutDashboard,
//   Users,
//   GraduationCap,
//   UserCheck,
//   Megaphone,
//   AlertCircle,
//   DollarSign,
//   MessageCircle,
//   FileText,
//   Calendar,
//   Settings,
//   LogOut,
//   Menu,
//   X,
//   Bell,
//   Search,
//   ChevronDown,
//   User,
// } from "lucide-react";
// import { Link, Outlet, useLocation } from "react-router-dom";
// import { useTheme } from "../../layout/ThemeContext";

// type Props = {
//   children?: React.ReactNode; 
// };

// export default function SchoolNavbar({ children }: Props) {
//   const { isDark, toggleTheme } = useTheme();
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [showProfileDropdown, setShowProfileDropdown] = useState(false);

//   const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

//   const location = useLocation();

//   const menuItems = [
//     { icon: LayoutDashboard, text: "Dashboard", path: "/dashboard" },
//     { icon: Users, text: "Admins Management", path: "/admins" },
//     { icon: GraduationCap, text: "Student Management", path: "/students" },
//     { icon: UserCheck, text: "Parents Management", path: "/parents" },
//     { icon: Megaphone, text: "Teacher Management", path: "/teachers" },
//     { icon: AlertCircle, text: "Raise & View Complaints", path: "/complaints" },
//     { icon: DollarSign, text: "Finance", path: "/finance" },
//     { icon: MessageCircle, text: "Communication", path: "/communication" },
//     { icon: FileText, text: "Leave Request", path: "/leave-request" },
//     { icon: Calendar, text: "Time Table", path: "/timetable" },
//     { icon: Settings, text: "Settings", path: "/profile" },
//   ];

//   // Enhanced color scheme
//   const sidebarBg = isDark ? "#121A21" : "bg-[#fafbfc]";
//   const sidebarBorder = isDark ? "border-slate-700/50" : "border-slate-200/60";
//   const headerBg = isDark ? "bg-[#121A21]" : "bg-white";
//   const headerBorder = isDark ? "border-slate-700/30" : "border-slate-200/50";
//   const cardBg = isDark ? "bg-slate-800/50" : "bg-white";
//   const hoverBg = isDark ? "hover:bg-slate-700/30" : "hover:bg-slate-50";
//   const textPrimary = isDark ? "text-slate-100" : "text-slate-900";
//   const textSecondary = isDark ? "text-slate-400" : "text-slate-600";
//   const activeBg = isDark ? "bg-blue-600/20" : "bg-blue-50";
//   const activeText = isDark ? "text-blue-400" : "text-blue-600";
//   const activeBorder = isDark ? "border-blue-400/50" : "border-blue-500/50";

//   return (
//     <div
//       className={`h-screen overflow-hidden transition-all duration-500 ${
//         isDark ? "bg-[#121A21]" : "bg-slate-50"
//       }`}
//     >
//       {/* Mobile Header */}
//       <div
//         className={`lg:hidden flex items-center justify-between px-4 py-3 ${headerBg} ${headerBorder} border-b backdrop-blur-xl`}
//       >
//         <div className="flex items-center space-x-3">
//           <button
//             onClick={toggleMobileMenu}
//             className={`p-2.5 rounded-xl ${hoverBg} transition-all duration-200 hover:scale-105`}
//           >
//             {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
//           </button>
//           <div className="flex items-center space-x-2">
//             <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
//               <School className="text-white" size={24} />
//             </div>
//             <div className="flex flex-col">
//               <span className="text-lg font-bold tracking-tight">BRAINNIX</span>
//               <span className={`text-xs ${textSecondary} font-medium`}>School Management</span>
//             </div>
//           </div>
//         </div>
//         <div className="flex items-center space-x-2">
//           <button
//             onClick={toggleTheme}
//             className={`p-2.5 rounded-xl ${hoverBg} transition-all duration-300 hover:scale-105 hover:rotate-12`}
//           >
//             {isDark ? (
//               <Sun className="text-amber-400" size={20} />
//             ) : (
//               <Moon className="text-slate-600" size={20} />
//             )}
//           </button>
//         </div>
//       </div>

//       <div className="flex h-full">
//         {/* Enhanced Sidebar */}
//         <div
//           className={`
//           fixed lg:relative top-0 left-0 z-50 h-full w-72
//           transform transition-all duration-500 ease-out
//           ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
//           ${sidebarBg} ${sidebarBorder} border-r backdrop-blur-xl
//         `}
//         >
//           {/* Brand Header with Glass Effect */}
//           <div className="p-6 border-b border-opacity-10">
//             <div className={`flex items-center space-x-3 p-4 rounded-2xl ${cardBg} backdrop-blur-xl border ${sidebarBorder} shadow-lg hover:shadow-xl transition-all duration-300`}>
//               <div className="relative">
//                 <div className="p-3 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-xl shadow-lg">
//                   <School className="text-white" size={24} />
//                 </div>
//                 <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
//               </div>
//               <div className="flex flex-col">
//                 <span className={`font-bold text-lg tracking-tight ${textPrimary}`}>BRAINNIX</span>
//                 <span className={`text-xs ${textSecondary} font-medium`}>School Management System</span>
//               </div>
//             </div>
//           </div>

//           {/* Enhanced Navigation */}
//           <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
//             {menuItems.map((item, index) => {
//               const Icon = item.icon;
//               const isActive = location.pathname === item.path;
//               return (
//                 <Link
//                   key={index}
//                   to={item.path}
//                   className={`
//                     relative group flex items-center space-x-3 px-4 py-3.5 rounded-xl text-left
//                     transition-all duration-300 hover:scale-[1.02] hover:translate-x-1
//                     ${isActive 
//                       ? `${activeBg} ${activeText} shadow-lg border ${activeBorder} font-semibold` 
//                       : `${hoverBg} ${textSecondary} hover:${textPrimary}`
//                     }
//                   `}
//                 >
//                   {/* Active indicator */}
//                   {isActive && (
//                     <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-r-full"></div>
//                   )}
                  
//                   <div className={`p-2 rounded-lg transition-all duration-300 group-hover:scale-110 ${
//                     isActive ? 'bg-blue-500/20' : 'bg-transparent group-hover:bg-slate-500/10'
//                   }`}>
//                     <Icon
//                       size={18}
//                       className={`transition-all duration-300 ${
//                         isActive ? activeText : `${textSecondary} group-hover:${textPrimary}`
//                       }`}
//                     />
//                   </div>
                  
//                   <span className={`text-sm font-medium transition-all duration-300 ${
//                     isActive ? 'font-semibold' : 'group-hover:font-medium'
//                   }`}>
//                     {item.text}
//                   </span>
                  
//                   {isActive && (
//                     <div className="ml-auto flex items-center space-x-2">
//                       <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
//                     </div>
//                   )}
                  
//                   {/* Hover glow effect */}
//                   <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
//                     isDark ? 'bg-gradient-to-r from-blue-500/5 to-purple-500/5' : 'bg-gradient-to-r from-blue-50/50 to-purple-50/50'
//                   }`}></div>
//                 </Link>
//               );
//             })}
//           </div>

//           {/* Enhanced Footer */}
//           <div className="p-4 border-t border-opacity-10">
//             <div className={`p-3 rounded-xl ${cardBg} backdrop-blur-xl border ${sidebarBorder}`}>
//               <div className="flex items-center space-x-3">
//                 <div className="relative">
//                   <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center">
//                     <User size={16} className="text-white" />
//                   </div>
//                   <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className={`text-sm font-medium ${textPrimary} truncate`}>Admin User</p>
//                   <p className={`text-xs ${textSecondary}`}>Administrator</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Main Content Area */}
//         <div className={`flex-1 flex flex-col h-full ${isDark ? "bg-[#121A21]" : "bg-slate-50"}`}>
//           {/* Enhanced Desktop Header */}
//           <div className={`hidden lg:flex items-center justify-between px-8 py-4 ${headerBg} ${headerBorder} border-b backdrop-blur-xl shadow-sm`}>
//             {/* Left Section */}
//             <div className="flex items-center space-x-6">
//               <div className={`px-6 py-3 rounded-2xl ${cardBg} backdrop-blur-xl border ${headerBorder} shadow-sm`}>
//                 <span className={`text-xl font-bold ${textPrimary} tracking-tight`}>
//                   {menuItems.find(item => item.path === location.pathname)?.text || "Dashboard"}
//                 </span>
//               </div>
              
           
//             </div>

//             {/* Right Section */}
//             <div className="flex items-center space-x-4">
//               {/* Notifications */}
//               <button className={`relative p-3 rounded-xl ${hoverBg} transition-all duration-300 hover:scale-105`}>
//                 <Bell className={textSecondary} size={20} />
//                 <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
//                   <span className="text-white text-xs font-bold">3</span>
//                 </div>
//               </button>

//               {/* Theme Toggle */}
//               <button
//                 onClick={toggleTheme}
//                 className={`flex items-center space-x-3 px-4 py-3 rounded-xl ${hoverBg} transition-all duration-300 hover:scale-105`}
//               >
//                 {isDark ? (
//                   <>
//                     <Sun className="text-amber-400" size={18} />
//                     <span className={`text-sm font-medium ${textPrimary}`}>Light</span>
//                   </>
//                 ) : (
//                   <>
//                     <Moon className="text-slate-600" size={18} />
//                     <span className={`text-sm font-medium ${textPrimary}`}>Dark</span>
//                   </>
//                 )}
//               </button>

//               {/* Profile Dropdown */}
//               <div className="relative">
//                 <button
//                   onClick={() => setShowProfileDropdown(!showProfileDropdown)}
//                   className={`flex items-center space-x-3 px-4 py-3 rounded-xl ${hoverBg} transition-all duration-300 hover:scale-105`}
//                 >
//                   <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
//                     <User size={16} className="text-white" />
//                   </div>
//                   <span className={`text-sm font-medium ${textPrimary}`}>Admin</span>
//                   <ChevronDown size={16} className={`${textSecondary} transition-transform duration-200 ${showProfileDropdown ? 'rotate-180' : ''}`} />
//                 </button>

//                 {showProfileDropdown && (
//                   <div className={`absolute right-0 top-full mt-2 w-48 ${cardBg} backdrop-blur-xl border ${headerBorder} rounded-xl shadow-xl z-50 py-2`}>
//                     <Link to="/profile" className={`flex items-center space-x-3 px-4 py-3 ${hoverBg} transition-colors duration-200`}>
//                       <Settings size={16} className={textSecondary} />
//                       <span className={`text-sm ${textPrimary}`}>Settings</span>
//                     </Link>
//                     <button className={`w-full flex items-center space-x-3 px-4 py-3 ${hoverBg} transition-colors duration-200 text-red-500 hover:text-red-600`}>
//                       <LogOut size={16} />
//                       <span className="text-sm">Logout</span>
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Main Content with Enhanced Styling */}
//           <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
//             <div className="max-w-full mx-auto">
//               <Outlet />
//             </div>
//           </main>
//         </div>
//       </div>

//       {/* Enhanced Mobile Overlay */}
//       {isMobileMenuOpen && (
//         <div
//           className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
//           onClick={toggleMobileMenu}
//         />
//       )}
      
//       {/* Click outside to close profile dropdown */}
//       {showProfileDropdown && (
//         <div
//           className="fixed inset-0 z-30"
//           onClick={() => setShowProfileDropdown(false)}
//         />
//       )}
//     </div>
//   );
// }




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
  MessageCircle,
  FileText,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  User,
  ListPlus,
  Layers,
} from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useTheme } from "../../layout/ThemeContext";

type Props = {
  children?: React.ReactNode;
};

export default function SchoolNavbar({ children }: Props) {
  const { isDark, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const location = useLocation();

  const menuItems = [
    {
      label: "SCHOOL MANAGEMENT",
      links: [
        { icon: LayoutDashboard, text: "Dashboard", path: "/dashboard" },
    
        { icon: Users, text: "Admins Management", path: "/admins" },
        { icon: GraduationCap, text: "Student Management", path: "/students" },
        { icon: UserCheck, text: "Parents Management", path: "/parents" },
        { icon: Megaphone, text: "Teacher Management", path: "/teachers" },
        { icon: AlertCircle, text: "Raise & View Complaints", path: "/complaints" },
        { icon: DollarSign, text: "Finance", path: "/finance" },
        { icon: GraduationCap, text: "Student Management", path: "/student-management" },
      ],
    },
    {
      label: "COMMUNICATION",
      links: [
        { icon: MessageCircle, text: "Communication", path: "/communication" },
        { icon: FileText, text: "Leave Request", path: "/leave-request" },
        { icon: Calendar, text: "Time Table", path: "/timetable" },
        { icon: Settings, text: "Settings", path: "/settings" },
      ],
    },
  ];

  const sidebarBg = isDark ? "bg-[#121A21]" : "bg-[#fafbfc]";
  const sidebarBorder = isDark ? "border-slate-700/50" : "border-slate-200/60";
  const headerBg = isDark ? "bg-[#121A21]" : "bg-white";
  const headerBorder = isDark ? "border-slate-700/30" : "border-slate-200/50";
  const cardBg = isDark ? "bg-slate-800/50" : "bg-white";
  const hoverBg = isDark ? "hover:bg-slate-700/30" : "hover:bg-slate-50";
  const textPrimary = isDark ? "text-slate-100" : "text-slate-900";
  const textSecondary = isDark ? "text-slate-400" : "text-slate-600";
  const activeBg = isDark ? "bg-blue-600/20" : "bg-blue-50";
  const activeText = isDark ? "text-blue-400" : "text-blue-600";
  const activeBorder = isDark ? "border-blue-400/50" : "border-blue-500/50";

  return (
    <div
      className={`h-screen overflow-hidden transition-all duration-500 ${
        isDark ? "bg-[#121A21]" : "bg-slate-50"
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
              <School className="text-white" size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight">BRAINNIX</span>
              <span className={`text-xs ${textSecondary} font-medium`}>School Management</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-xl ${hoverBg} transition-all duration-300 hover:scale-105 hover:rotate-12`}
          >
            {isDark ? (
              <Sun className="text-amber-400" size={20} />
            ) : (
              <Moon className="text-slate-600" size={20} />
            )}
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
                  <School className="text-white" size={24} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className={`font-bold text-lg tracking-tight ${textPrimary}`}>
                  SCHOOL MANAGEMENT
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 px-4 space-y-4">
            {menuItems.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <h3 className="uppercase text-slate-500 text-xs font-semibold py-2">
                  {section.label}
                </h3>
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

          <div className="p-4">
            <button
              onClick={() => {}}
              className="w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-xl bg-gray-700/50 hover:bg-gray-700 text-white transition-colors duration-200"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>

        <div className={`flex-1 flex flex-col h-full ${isDark ? "bg-[#121A21]" : "bg-slate-50"}`}>
          <div className={`hidden lg:flex items-center justify-between px-8 py-4 ${headerBg} ${headerBorder} border-b backdrop-blur-xl shadow-sm`}>
            <div className="flex items-center space-x-6">
              <div className={`px-6 py-3 rounded-2xl ${cardBg} backdrop-blur-xl border ${headerBorder} shadow-sm`}>
                <span className={`text-xl font-bold ${textPrimary} tracking-tight`}>
                  {menuItems.find(section => section.links.find(link => link.path === location.pathname))?.links.find(link => link.path === location.pathname)?.text || "Dashboard"}
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
                  <ChevronDown size={16} className={`${textSecondary} transition-transform duration-200 ${showProfileDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showProfileDropdown && (
                  <div className={`absolute right-0 top-full mt-2 w-48 ${cardBg} backdrop-blur-xl border ${headerBorder} rounded-xl shadow-xl z-50 py-2`}>
                    <Link to="/profile" className={`flex items-center space-x-3 px-4 py-3 ${hoverBg} transition-colors duration-200`}>
                      <Settings size={16} className={textSecondary} />
                      <span className={`text-sm ${textPrimary}`}>Settings</span>
                    </Link>
                    <button className={`w-full flex items-center space-x-3 px-4 py-3 ${hoverBg} transition-colors duration-200 text-red-500 hover:text-red-600`}>
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
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowProfileDropdown(false)}
        />
      )}
    </div>
  );
}