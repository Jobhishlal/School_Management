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

function ErrorFallback({ error }: { error: Error }) {
  return <div role="alert">Something went wrong: {error.message}</div>;
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ToastContainer />

      <Routes>
        <Route path="/" element={<SchoolLandingPage />} />
        <Route path="/signup" element={<SignupAdminPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/login" element={<MainAdminLogincheck />} />

       
        <Route
          element={
            <ThemeProvider>
              <Layout />
            </ThemeProvider>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admins" element={<AdminManagement />} />
          <Route path="/teachers" element={<TeachersManagement />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
