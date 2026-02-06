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
import Dashboard from "./pages/admin/AdminDashboard";
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
import AssignmentManage from "./pages/Teacher/AssignMentManage";
import { StudentAssignmentList } from "./pages/Student/StudentAssignmentView";
import { StudentAnnouncementView } from "./pages/Student/StudentAnnouncementView";
import AssignmentSubmissions from "./pages/Teacher/AssignmentSubmissions";
import { StudentExamResultsPage } from "./pages/Student/StudentExamResultView";
import { StudentAttendanceView } from "./pages/Student/StudentAttendanceView";
import CreateFeeStructureForm from "./pages/admin/FeeStructureManagement";

import ParentLayout from "./components/layout/ParentLayout";
import ParentDashboard from "./pages/Parents/ParentDashboard";
import FinanceParentList from "./pages/Parents/ParentFinancePage";
import CreateExpenseForm from "./pages/admin/ExpenseManagement";
import SuperAdminExpenseApproval from "./pages/admin/SuperAdminApproval";
import RevenueGenerateReport from "./pages/admin/FinanceReport/RevenueGenarateReport";
import CreateAnnouncement from "./pages/admin/Announcement/Announcement";

import AttendanceCreatePage from "./pages/Teacher/AttendanceCreatePage";
import ParentAttendance from "./pages/Parents/AttendanceViewPage";
import CreateExam from "./pages/Teacher/Exam/CreateExam";
import { TeacherParentList } from "./pages/Teacher/TeacherParentList";
import ParentExamResults from "./pages/Parents/ParentExamResults";
import ParentProfile from "./pages/Parents/ParentProfile";
import { LeaveManagement } from "./pages/Teacher/LeaveManagement/LeaveManagement";
import { AdminLeaveRequest } from "./pages/admin/LeaveManagement/AdminLeaveRequest";
import { SubAdminLeaveApplication } from "./pages/admin/LeaveManagement/SubAdminLeaveApplication";
import TeacherMyClass from "./pages/Teacher/Class/TeacherMyClass";
import TeacherScheduleView from "./pages/Teacher/TeacherScheduleView";
import ParentLeavePage from "./pages/Parents/ParentLeavePage";
import TeacherStudentLeavePage from "./pages/Teacher/LeaveManagement/TeacherStudentLeavePage";
import CreateMeeting from "./pages/admin/VideoConference/CreateMeeting";
import VideoMeeting from "./pages/common/VideoMeeting";
import ParentComplaints from "./pages/Parents/ParentComplaints";
import { MeetingList } from "./pages/common/MeetingList";
import ComplaintList from "./pages/admin/Complaint/ComplaintList";
import StudentAIAssistant from "./pages/Student/AIAssistant/StudentAIAssistant";
import ChatLayout from "./pages/Student/Chat/ChatLayout";
import TeacherChat from "./pages/Teacher/Chat/TeacherChat";
import NotFound from "./pages/NotFound";

import PublicRoute from "./components/layout/PublicRoute";


function ErrorFallback({ error }: { error: Error }) {
  return <div role="alert">Something went wrong: {error.message}</div>;
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ToastContainer />

      <Routes>
        {/* ---------------- PUBLIC ROUTES ---------------- */}
        <Route path="/" element={<PublicRoute restricted={true}><SchoolLandingPage /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute restricted={true}><SignupAdminPage /></PublicRoute>} />
        <Route path="/verify-otp" element={<PublicRoute restricted={true}><VerifyOtpPage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute restricted={true}><MainAdminLogincheck /></PublicRoute>} />
        <Route path="/forgot-password" element={<ParentForgotPassword />} />
        <Route path="/logout" element={<Logout />} />

        {/* ---------------- ADMIN ROUTES ---------------- */}
        <Route element={<ThemeProvider><Layout /></ThemeProvider>}>
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/admins" element={<PrivateRoute><AdminManagement /></PrivateRoute>} />
          <Route path="/teachers" element={<PrivateRoute><TeachersManagement /></PrivateRoute>} />
          <Route path="/student-management" element={<PrivateRoute><StudentList /></PrivateRoute>} />
          <Route path="/instituteprofile" element={<PrivateRoute><InstituteManagementPage /></PrivateRoute>} />
          <Route path="/adminprofile" element={<PrivateRoute><AdminProfileManagement /></PrivateRoute>} />
          <Route path="/classbaseview" element={<PrivateRoute><AdminClassDivisionView /></PrivateRoute>} />
          <Route path='/timetable-management' element={<PrivateRoute><TimeTableManagement /></PrivateRoute>} />
          <Route path='/finance-management' element={<PrivateRoute><CreateFeeStructureForm /></PrivateRoute>} />
          <Route path='/expense-management' element={<PrivateRoute><CreateExpenseForm /></PrivateRoute>} />
          <Route path='/admin-approval' element={<PrivateRoute><SuperAdminExpenseApproval /></PrivateRoute>} />
          <Route path='/finance-report' element={<PrivateRoute><RevenueGenerateReport /></PrivateRoute>} />
          <Route path='/Announcement' element={<PrivateRoute><CreateAnnouncement /></PrivateRoute>} />
          <Route path='/leave-management' element={<PrivateRoute><AdminLeaveRequest /></PrivateRoute>} />
          <Route path='/subadmin-leave-application' element={<PrivateRoute><SubAdminLeaveApplication /></PrivateRoute>} />
          <Route path='/create-meeting' element={<PrivateRoute><CreateMeeting /></PrivateRoute>} />
          <Route path='/meeting/:meetingLink' element={<PrivateRoute><VideoMeeting /></PrivateRoute>} />
          <Route path='/complaints' element={<PrivateRoute><ComplaintList /></PrivateRoute>} />
        </Route>

        {/* ---------------- STUDENT ROUTES ---------------- */}
        <Route element={<ThemeProvider><PrivateRoute><StudentLayout /></PrivateRoute></ThemeProvider>}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/profile" element={<StudentProfilePage />} />
          <Route path='/student/timetable-view' element={<StudentTimeTableView />} />
          <Route path='/student/assignment' element={<StudentAssignmentList />} />
          <Route path='/student/exam-list' element={<StudentExamResultsPage />} />
          <Route path='/student/attendance-view' element={<StudentAttendanceView />} />
          <Route path='/student/notices' element={<StudentAnnouncementView />} />
          <Route path="/student/chat" element={<ChatLayout />} />
          <Route path='/student/ai-assistant' element={<StudentAIAssistant />} />
          <Route path="/student/meet" element={<MeetingList />} />
        </Route>

        {/* ---------------- TEACHER ROUTES ---------------- */}
        <Route element={<ThemeProvider><PrivateRoute><TeacherLayout /></PrivateRoute></ThemeProvider>}>
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/assignments" element={<AssignmentManage />} />
          <Route path="/teacher/assignment/:id/submissions" element={<AssignmentSubmissions />} />
          <Route path="/teacher/attandance" element={<AttendanceCreatePage />} />
          <Route path="/teacher/exam-management" element={<CreateExam />} />
          <Route path="/teacher/parents" element={<TeacherParentList />} />
          <Route path="/teacher/leave-management" element={<LeaveManagement />} />
          <Route path="/teacher/schedule" element={<TeacherScheduleView />} />
          <Route path="/teacher/classes" element={<TeacherMyClass />} />
          <Route path="/teacher/student-leave" element={<TeacherStudentLeavePage />} />
          <Route path="/teacher/chat" element={<TeacherChat />} />
          <Route path="/teacher/meet" element={<MeetingList />} />
        </Route>



        {/* --------------------PARENT ROUTES ------------------- */}
        <Route element={<ThemeProvider><PrivateRoute><ParentLayout /></PrivateRoute></ThemeProvider>}>
          <Route path="/parent/dashboard" element={<ParentDashboard />} />
          <Route path="/parent/financelist" element={<FinanceParentList />} />
          <Route path="/parent/attendacelist" element={<ParentAttendance />} />
          <Route path="/parent/exams" element={<ParentExamResults />} />
          <Route path="/parent/profile" element={<ParentProfile />} />
          <Route path="/parent/leave" element={<ParentLeavePage />} />
          <Route path="/parent/complaints" element={<ParentComplaints />} />
          <Route path="/parent/meet" element={<MeetingList />} />

        </Route>

        {/* ---------------- 404 ROUTE ---------------- */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </ErrorBoundary>
  );
}

export default App;
