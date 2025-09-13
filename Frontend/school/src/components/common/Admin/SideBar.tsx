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
//   type Props = {
//   children?: React.ReactNode; 
// };

// export default function SchoolNavbar({ children }:Props) {
//   const [isDark, setIsDark] = useState(true);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


//   const toggleTheme = () => setIsDark(!isDark);
//   const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

//   const location = useLocation();

//   const menuItems = [
//     { icon: LayoutDashboard, text: "Dashboard", path: "/dashboard" },
    
//     { icon: Users, text: "Admins Management", path: "/admins" },
//     { icon: GraduationCap, text: "Student Management", path: "/students" },
//     { icon: UserCheck, text: "Parents Management", path: "/parents" },
//     { icon: Megaphone, text: "Announcement", path: "/announcements" },
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

        
//           <main className="flex-1 p-6 overflow-y-auto">
//             <Outlet />
//           </main>
//         </div>
//       </div>

 
//       {isMobileMenuOpen && (
//         <div
//           className="lg:hidden fixed inset-0 bg-black/50 z-40"
//           onClick={toggleMobileMenu}
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
} from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useTheme } from "../../layout/ThemeContext";

type Props = {
  children?: React.ReactNode; 
};

export default function SchoolNavbar({ children }: Props) {
  const { isDark, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, text: "Dashboard", path: "/dashboard" },
    { icon: Users, text: "Admins Management", path: "/admins" },
    { icon: GraduationCap, text: "Student Management", path: "/students" },
    { icon: UserCheck, text: "Parents Management", path: "/parents" },
    { icon: Megaphone, text: "Announcement", path: "/announcements" },
    { icon: AlertCircle, text: "Raise & View Complaints", path: "/complaints" },
    { icon: DollarSign, text: "Finance", path: "/finance" },
    { icon: MessageCircle, text: "Communication", path: "/communication" },
    { icon: FileText, text: "Leave Request", path: "/leave-request" },
    { icon: Calendar, text: "Time Table", path: "/timetable" },
    { icon: Settings, text: "Settings", path: "/profile" },
  ];

  const themeClasses = isDark
    ? "bg-[#121A21] text-white border-gray-700"
    : "bg-white text-gray-900 border-gray-200 shadow-lg";

  const hoverClasses = isDark ? "hover:bg-gray-700/50" : "hover:bg-gray-50";

  const activeClasses = isDark
    ? "bg-blue-600/20 border-r-2 border-blue-400 text-blue-400"
    : "bg-blue-50 border-r-2 border-blue-600 text-blue-600";

  return (
    <div
      className={`h-screen overflow-hidden transition-colors duration-300 ${
        isDark ? "bg-[#121A21]" : "bg-gray-50"
      }`}
    >
      {/* Mobile Header */}
      <div
        className={`lg:hidden flex items-center justify-between p-4 ${themeClasses} border-b`}
      >
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleMobileMenu}
            className={`p-2 rounded-lg ${hoverClasses} transition-colors duration-200`}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <School className="text-blue-500" size={28} />
          <span className="text-xl font-bold">SCHOOL MANAGEMENT</span>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg ${hoverClasses} transition-all duration-300 hover:scale-105`}
          >
            {isDark ? (
              <Sun className="text-yellow-400" size={20} />
            ) : (
              <Moon className="text-gray-600" size={20} />
            )}
          </button>
          <button
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${hoverClasses} transition-all duration-200 hover:scale-105`}
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>

      <div className="flex h-full">
        {/* Sidebar */}
        <div
          className={`
          fixed lg:relative top-0 left-0 z-50 h-full w-80
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${themeClasses} border-r
        `}
        >
          {/* Header */}
          <div className="p-6 border-b border-opacity-20">
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <School className="text-blue-400" size={24} />
              </div>
              <span className="text-sm font-bold tracking-wide">BRAINNIX</span>
            </div>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto py-4 px-3">
            <nav className="space-y-1">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={index}
                    to={item.path}
                    className={`
                      w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left
                      transition-all duration-200 hover:scale-[1.02] group
                      ${isActive ? activeClasses : hoverClasses}
                    `}
                  >
                    <Icon
                      size={20}
                      className={`
                        transition-all duration-200 group-hover:scale-110
                        ${
                          isActive
                            ? "text-blue-400"
                            : isDark
                            ? "text-gray-400"
                            : "text-gray-600"
                        }
                      `}
                    />
                    <span
                      className={`text-sm font-medium ${
                        isActive ? "font-semibold" : ""
                      }`}
                    >
                      {item.text}
                    </span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Mobile close button */}
          <div className="lg:hidden p-4 border-t border-opacity-20">
            <button
              onClick={toggleMobileMenu}
              className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl ${hoverClasses} transition-all duration-200`}
            >
              <X size={18} />
              <span className="text-sm font-medium">Close Menu</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div
          className={`flex-1 flex flex-col h-full lg:ml-0 ${
            isDark ? "bg-[#121A21]" : "bg-gray-50"
          }`}
        >
          {/* Desktop Header */}
          <div
            className={`hidden lg:flex items-center justify-between p-6 ${themeClasses} border-b flex-shrink-0`}
          >
            <div className="flex items-center space-x-4">
              <div
                className={`px-4 py-2 rounded-lg ${
                  isDark ? "bg-gray-800" : "bg-gray-100"
                }`}
              >
                <span className="text-lg font-semibold">Dashboard</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg 
                  ${hoverClasses} transition-all duration-300 hover:scale-105
                `}
              >
                {isDark ? (
                  <>
                    <Sun className="text-yellow-400" size={18} />
                    <span className="text-sm font-medium">Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="text-gray-600" size={18} />
                    <span className="text-sm font-medium">Dark Mode</span>
                  </>
                )}
              </button>

              <button
                className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg 
                ${
                  isDark
                    ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    : "bg-red-50 text-red-600 hover:bg-red-100"
                }
                transition-all duration-200 hover:scale-105
              `}
              >
                <LogOut size={18} />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={toggleMobileMenu}
        />
      )}
    </div>
  );
}