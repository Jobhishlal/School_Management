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
// import {AdminProfileManagement} from './pages/admin/AdminProfileManagement'
// import ParentForgotPassword from './features/auth/ForgotPassWord'
// import Logout from "./features/auth/Logout";


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
//         <Route path='/forgot-password' element={<ParentForgotPassword/>}/>

       
//         <Route
//           element={
//             <ThemeProvider>
//               <Layout />
//             </ThemeProvider>
//           }
//         >
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/profile" element={<Profile />} />
//           <Route path="/admins" element={<AdminManagement />} />
//           <Route path="/teachers" element={<TeachersManagement />} />
//            <Route path="/students" element={<StudentList />} />
//           <Route path="/instituteprofile" element={<InstituteManagementPage />} />
//           <Route path="/adminprofile" element={<AdminProfileManagement />} />
//         </Route>
//       </Routes>
//     </ErrorBoundary>
//   );
// }

// export default App;






import { Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import SignupAdminPage from "./features/auth/Signup";
import VerifyOtpPage from "./features/auth/Otp";
import { ToastContainer } from "react-toastify";
import MainAdminLogincheck from "./features/admin/Login";
import "react-toastify/dist/ReactToastify.css";
import SchoolLandingPage from "./components/common/Welcome";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/admin/dashboard";
import Profile from "./pages/admin/profile";
import { AdminManagement } from "./pages/admin/AdminManagement";
import { ThemeProvider } from "./components/layout/ThemeContext"; 
import { TeachersManagement } from "./pages/admin/TeacherManagement";
import { StudentList } from "./pages/admin/StudentList";
import { InstituteManagementPage } from "./pages/admin/InstituteProfile";
import { AdminProfileManagement } from './pages/admin/AdminProfileManagement';
import ParentForgotPassword from './features/auth/ForgotPassWord';
import Logout from "./features/auth/Logout";
import PrivateRoute from "./components/layout/PrivateRoute";

function ErrorFallback({ error }: { error: Error }) {
  return <div role="alert">Something went wrong: {error.message}</div>;
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ToastContainer />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<SchoolLandingPage />} />
        <Route path="/signup" element={<SignupAdminPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/login" element={<MainAdminLogincheck />} />
        <Route path="/forgot-password" element={<ParentForgotPassword />} />

        {/* Logout Route */}
        <Route path="/logout" element={<Logout />} />

        {/* Protected Routes */}
        <Route
          element={
            <ThemeProvider>
              <Layout />
            </ThemeProvider>
          }
        >
        <Route
           path="/dashboard"
           element={
        <PrivateRoute>
           <Dashboard />
         </PrivateRoute>
       }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/admins"
            element={
              <PrivateRoute>
                <AdminManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/teachers"
            element={
              <PrivateRoute>
                <TeachersManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/students"
            element={
              <PrivateRoute>
                <StudentList />
              </PrivateRoute>
            }
          />
          <Route
            path="/instituteprofile"
            element={
              <PrivateRoute>
                <InstituteManagementPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/adminprofile"
            element={
              <PrivateRoute>
                <AdminProfileManagement />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
