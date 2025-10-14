// import { Routes, Route } from "react-router-dom";
// import { ErrorBoundary } from "react-error-boundary";
// import SignupAdminPage from "./features/auth/Signup";
// import VerifyOtpPage from "./features/auth/Otp";
// import { ToastContainer } from "react-toastify";
// import MainAdminLogincheck from "./features/admin/Login";
// import "react-toastify/dist/ReactToastify.css";
// import SchoolLandingPage from "./components/common/Welcome";
// import Layout from "./components/layout/Layout";
// import Dashboard from "./pages/admin/dashboard";
// import Profile from "./pages/admin/profile";
// import { AdminManagement } from "./pages/admin/AdminManagement";
// import { ThemeProvider } from "./components/layout/ThemeContext"; 
// import { TeachersManagement } from "./pages/admin/TeacherManagement";
// import { StudentList } from "./pages/admin/StudentList";
// import { InstituteManagementPage } from "./pages/admin/InstituteProfile";
// import { AdminProfileManagement } from './pages/admin/AdminProfileManagement';
// import ParentForgotPassword from './features/auth/ForgotPassWord';
// import Logout from "./features/auth/Logout";
// import PrivateRoute from "./components/layout/PrivateRoute";

// import StudentLayout from "./components/layout/StudentLayout";
// import StudentDashboard from "./pages/Student/StudentDashboard";

// function ErrorFallback({ error }: { error: Error }) {
//   return <div role="alert">Something went wrong: {error.message}</div>;
// }

// function App() {
//   return (
//     <ErrorBoundary FallbackComponent={ErrorFallback}>
//       <ToastContainer />

//       <Routes>
   
//         <Route path="/" element={<SchoolLandingPage />} />
//         <Route path="/signup" element={<SignupAdminPage />} />
//         <Route path="/verify-otp" element={<VerifyOtpPage />} />
//         <Route path="/login" element={<MainAdminLogincheck />} />
//         <Route path="/forgot-password" element={<ParentForgotPassword />} />

//         <Route path="/logout" element={<Logout />} />

        
//         <Route element={ <ThemeProvider> <Layout /> </ThemeProvider> }>
//         <Route path="/dashboard" element={  <PrivateRoute>   <Dashboard />  </PrivateRoute>  } />
//           <Route path="/profile" element={<PrivateRoute>
//                 <Profile />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/admins"
//             element={
//               <PrivateRoute>
//                 <AdminManagement />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/teachers"
//             element={
//               <PrivateRoute>
//                 <TeachersManagement />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/students"
//             element={
//               <PrivateRoute>
//                 <StudentList />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/instituteprofile"
//             element={
//               <PrivateRoute>
//                 <InstituteManagementPage />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/adminprofile"
//             element={
//               <PrivateRoute>
//                 <AdminProfileManagement />
//               </PrivateRoute>
//             }
//           />
//         </Route>
//         <Route element={<ThemeProvider><StudentLayout/></ThemeProvider>}>
//           <Route path="/student/dashboard" element={
//             <SignupAdminPage/>
//           }/>
//         </Route>
//       </Routes>
//     </ErrorBoundary>
//   );
// }

// export default App;






import { Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import SignupAdminPage from "./features/auth/Signup";
import VerifyOtpPage from "./features/auth/Otp";
import MainAdminLogincheck from "./features/admin/Login";
import ParentForgotPassword from './features/auth/ForgotPassWord';
import Logout from "./features/auth/Logout";

import Layout from "./components/layout/Layout";
import Dashboard from "./pages/admin/dashboard";
import Profile from "./pages/admin/profile";
import { AdminManagement } from "./pages/admin/AdminManagement";
import { TeachersManagement } from "./pages/admin/TeacherManagement";
import { StudentList } from "./pages/admin/StudentList";
import { InstituteManagementPage } from "./pages/admin/InstituteProfile";
import { AdminProfileManagement } from './pages/admin/AdminProfileManagement';

import StudentLayout from "./components/layout/StudentLayout";
import StudentDashboard from "./pages/Student/StudentDashboard";


import SchoolLandingPage from "./components/common/Welcome";
import { ThemeProvider } from "./components/layout/ThemeContext"; 
import PrivateRoute from "./components/layout/PrivateRoute";
import { StudentProfilePage } from "./pages/Student/StudentProfile";
import TeacherLayout from "./components/layout/TeacherLayout";
import TeacherDashboard from "./pages/Teacher/TeacherDashboard";
import AdminClassDivisionView from "./pages/admin/ClassBaseStudentList";
import TimeTableManagement from "./pages/admin/TimeTableManagement";
import StudentTimeTableView from "./pages/Student/StudentTimeTableView";

function ErrorFallback({ error }: { error: Error }) {
  return <div role="alert">Something went wrong: {error.message}</div>;
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ToastContainer />

      <Routes>
        {/* ---------------- PUBLIC ROUTES ---------------- */}
        <Route path="/" element={<SchoolLandingPage />} />
        <Route path="/signup" element={<SignupAdminPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/login" element={<MainAdminLogincheck />} />
        <Route path="/forgot-password" element={<ParentForgotPassword />} />
        <Route path="/logout" element={<Logout />} />
        

        {/* ---------------- ADMIN ROUTES ---------------- */}
        <Route element={<ThemeProvider><Layout /></ThemeProvider>}>
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/admins" element={<PrivateRoute><AdminManagement /></PrivateRoute>} />
          <Route path="/teachers" element={<PrivateRoute><TeachersManagement /></PrivateRoute>} />
          <Route path="/students" element={<PrivateRoute><StudentList /></PrivateRoute>} />
          <Route path="/instituteprofile" element={<PrivateRoute><InstituteManagementPage /></PrivateRoute>} />
          <Route path="/adminprofile" element={<PrivateRoute><AdminProfileManagement /></PrivateRoute>} />
          <Route path="/classbaseview" element={<PrivateRoute><AdminClassDivisionView /></PrivateRoute>} />
          <Route path='/timetable-management' element={<PrivateRoute><TimeTableManagement/></PrivateRoute>}/>

        </Route>

        {/* ---------------- STUDENT ROUTES ---------------- */}
        <Route element={<ThemeProvider><StudentLayout /></ThemeProvider>}>
          <Route path="/student-dashboard" element={<StudentDashboard />} />
         <Route path="/student/profile" element={<StudentProfilePage />} />
         <Route path='/student/timetable-view' element={<StudentTimeTableView/>}/>




        </Route>

         {/* ---------------- TEACHER ROUTES ---------------- */}
          <Route element={<ThemeProvider><TeacherLayout/></ThemeProvider>}>
          <Route path="/teacher/dashboard" element={<TeacherDashboard/>}/>

          </Route>

      </Routes>
    </ErrorBoundary>
  );
}

export default App;
