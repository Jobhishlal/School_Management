import { AssignmentManageController } from "../../presentation/http/controllers/Teacher/AssignmentCreateController";
import { AssignmentCreate } from "../../applications/useCases/Assignment/AssignmentCreateUseCase";
import { GetTimeTableteacherList } from "../../applications/useCases/Assignment/GetAssignmentTeacherList";
import { UpdateAssignment } from "../../applications/useCases/Assignment/UpdateAssignmentUseCase";
import { GetAllTeacherAssignment } from "../../applications/useCases/Assignment/GetTeacherAssignment";
import { ValidateAssignment } from "../../applications/useCases/Assignment/ValidateAssignment";
import { GetAssignmentSubmissions } from "../../applications/useCases/Assignment/GetAssignmentSubmissions";

import { ClassManagementController } from "../../presentation/http/controllers/Classroom/ClassController";
import { CreateClassUseCase } from "../../applications/useCases/Classdata/CreateClass";
import { GetAllClass } from "../../applications/useCases/Classdata/GeallClass";
import { UpdateClassUseCase } from "../../applications/useCases/Classdata/ClassUpdate";
import { AssignClass } from "../../applications/useCases/Classdata/ClassAssignUseCase";
import { DeleteClassUseCase } from "../../applications/useCases/Classdata/deleteClassUseCase";

import { AttendanceController } from "../../presentation/http/controllers/AttendanceController/AttendanceController";
import { AttendanceCreateUseCase } from "../../applications/useCases/Attendance/AttendanceCreateUseCase";
import { StudentFindClassBaseUseCase } from "../../applications/useCases/Students/StudentFindClassIDbaseUseCase";
import { FindStudentsByTeacherUseCase } from "../../applications/useCases/Attendance/FindTeacherIdBaseAttendance";
import { AttendanceListUseCase } from "../../applications/useCases/Attendance/AttendanceList";
import { GetAttendanceReportUseCase } from "../../applications/useCases/Attendance/GetAttendanceReportUseCase";
import { GetStudentAttendanceHistoryUseCase } from "../../applications/useCases/Attendance/GetStudentAttendanceHistoryUseCase";
import { UpdateAttendanceUseCase } from "../../applications/useCases/Attendance/UpdateAttendanceUseCase";

import { ExamMarkManagementController } from "../../presentation/http/controllers/ExamManagement/ExamMarkManagementController";
import { ExamMarkCreateUseCase } from "../../applications/useCases/Exam/ExamMarkCreateUseCase";
import { GetStudentsByExamUseCase } from "../../applications/useCases/Exam/exammarkviewgetusecase";
import { UpdateExamMarkUseCase } from "../../applications/useCases/Exam/UpdateExamMarkUseCase";
import { ResolveExamConcernUseCase } from "../../applications/useCases/Exam/ResolveExamConcernUseCase";

import { ExamManagementController } from "../../presentation/http/controllers/ExamManagement/ExamManagementController";
import { ExamCreateUseCase } from "../../applications/useCases/Exam/ExamCreateUseCase";
import { ExamUpdateTeacherUseCase } from "../../applications/useCases/Exam/ExamUpdateUseCase";
import { GetTeacherExamsUseCase } from "../../applications/useCases/Exam/GetTeacherExamsUseCase";
import { ExamFindClassBase } from "../../applications/useCases/Exam/ExamFindClassBaseUseCase";

import { TeacherDailyScheduleView } from "../../presentation/http/controllers/Teacher/TeacherDayBydaySchedule";
import { TeacherDaybydayschedule } from "../../applications/useCases/Teacher/TeacherDayBydaySchedule";

import { TeacherClassStatsController } from "../../presentation/http/controllers/Teacher/TeacherClassStatsController";
import { GetTeacherClassDetailsUseCase } from "../../applications/useCases/Teacher/GetTeacherClassDetailsUseCase";
import { GetStudentPerformanceUseCase } from "../../applications/useCases/Teacher/GetStudentPerformanceUseCase";

import { StudentLeaveController } from "../../presentation/http/controllers/StudentLeave/StudentLeaveController";
import { ApplyStudentLeaveUseCase } from "../../applications/useCases/StudentLeave/ApplyStudentLeaveUseCase";
import { GetStudentLeaveHistoryUseCase } from "../../applications/useCases/StudentLeave/GetStudentLeaveHistoryUseCase";
import { GetClassStudentLeavesUseCase } from "../../applications/useCases/StudentLeave/GetClassStudentLeavesUseCase";
import { ProcessStudentLeaveUseCase } from "../../applications/useCases/StudentLeave/ProcessStudentLeaveUseCase";

import { TeacherDashboardController } from "../../presentation/http/controllers/Teacher/TeacherDashboardController";
import { GetTeacherDashboardUseCase } from "../../applications/useCases/Teacher/GetTeacherDashboardUseCase";

import { AssignmentMongo } from "../repositories/Assiggment/MongoAssignment";
import { MongoClassRepository } from "../repositories/MongoClassRepo";
import { AttendanceMongoRepository } from "../repositories/Attendance/AttendanceMongoRepo";
import { MongoStudentRepo } from "../repositories/MongoStudentRepo";
import { ParentMongoRepository } from "../repositories/ParentRepository";
import { ExamMarkMongoRepository } from "../repositories/ExamRepo/ExamMarkMongoRepo";
import { ExamMongoRepo } from "../repositories/ExamRepo/ExamMongoRepo";
import { MongoTeacher } from "../repositories/MongoTeacherRepo";
import { MongoTimeTableCreate } from "../repositories/MongoTimeTableCreation";
import { MongoStudentLeaveRepository } from "../repositories/StudentLeave/MongoStudentLeaveRepository";
import { MongoParentSignUp } from "../repositories/MongoSignupParents";

// Repositories
const assignmentRepo = new AssignmentMongo();
const classRepo = new MongoClassRepository();
const attendanceRepo = new AttendanceMongoRepository();
const studentRepo = new MongoStudentRepo();
const parentRepo = new ParentMongoRepository();
const examMarkRepo = new ExamMarkMongoRepository();
const examRepo = new ExamMongoRepo();
const teacherRepo = new MongoTeacher();
const timetableRepo = new MongoTimeTableCreate();
const studentLeaveRepo = new MongoStudentLeaveRepository();
const parentAuthRepo = new MongoParentSignUp();

// Use Cases - Assignment
const assignmentCreate = new AssignmentCreate(assignmentRepo);
const getTeacherList = new GetTimeTableteacherList(assignmentRepo);
const updateAssignment = new UpdateAssignment(assignmentRepo);
const getAllTeacherAssignment = new GetAllTeacherAssignment(assignmentRepo);
const validateAssignment = new ValidateAssignment(assignmentRepo);
const getSubmissions = new GetAssignmentSubmissions(assignmentRepo);

// Use Cases - Class
const createClass = new CreateClassUseCase(classRepo);
const getAllClass = new GetAllClass(classRepo);
const updateClass = new UpdateClassUseCase(classRepo);
const assignClass = new AssignClass(classRepo);
const deleteClass = new DeleteClassUseCase(classRepo);

// Use Cases - Attendance
const attendanceCreate = new AttendanceCreateUseCase(attendanceRepo, classRepo, studentRepo, parentRepo);
const studentFindClassBase = new StudentFindClassBaseUseCase(studentRepo, classRepo);
const findStudentsByTeacher = new FindStudentsByTeacherUseCase(studentRepo, attendanceRepo);
const attendanceList = new AttendanceListUseCase(attendanceRepo);
const getAttendanceReport = new GetAttendanceReportUseCase(attendanceRepo);
const getStudentAttendanceHistory = new GetStudentAttendanceHistoryUseCase(attendanceRepo);
const updateAttendance = new UpdateAttendanceUseCase(attendanceRepo);

// Use Cases - Exam Mark
const examMarkCreate = new ExamMarkCreateUseCase(examMarkRepo, studentRepo, examRepo);
const getStudentsByExam = new GetStudentsByExamUseCase(examRepo, studentRepo, examMarkRepo);
const updateExamMark = new UpdateExamMarkUseCase(examMarkRepo, examRepo);
const resolveExamConcern = new ResolveExamConcernUseCase(examMarkRepo);

// Use Cases - Exam Management
const examCreate = new ExamCreateUseCase(examRepo, classRepo, teacherRepo);
const examUpdate = new ExamUpdateTeacherUseCase(examRepo, teacherRepo);
const getTeacherExams = new GetTeacherExamsUseCase(examRepo, examMarkRepo);
const examFindClassBase = new ExamFindClassBase(examRepo);

// Use Cases - Schedule
const teacherSchedule = new TeacherDaybydayschedule(timetableRepo);

// Use Cases - Class Stats
const getClassDetails = new GetTeacherClassDetailsUseCase(classRepo, studentRepo, teacherRepo, examMarkRepo, attendanceRepo);
const getStudentPerformance = new GetStudentPerformanceUseCase(examMarkRepo, examRepo, attendanceRepo);

// Use Cases - Student Leave
const applyLeave = new ApplyStudentLeaveUseCase(studentLeaveRepo);
const getLeaveHistory = new GetStudentLeaveHistoryUseCase(studentLeaveRepo);
const getClassLeaves = new GetClassStudentLeavesUseCase(studentLeaveRepo);
const processLeave = new ProcessStudentLeaveUseCase(studentLeaveRepo, parentAuthRepo);

// Use Cases - Dashboard
const getTeacherDashboard = new GetTeacherDashboardUseCase(
  studentRepo,
  assignmentRepo,
  timetableRepo,
  examRepo,
  examMarkRepo,
  classRepo
);

// Controllers
export const teacherAssignmentController = new AssignmentManageController(
  assignmentCreate,
  getTeacherList,
  updateAssignment,
  getAllTeacherAssignment,
  validateAssignment,
  getSubmissions
);

export const teacherClassController = new ClassManagementController(
  createClass,
  getAllClass,
  updateClass,
  assignClass,
  deleteClass
);

export const teacherAttendanceController = new AttendanceController(
  attendanceCreate,
  studentFindClassBase,
  findStudentsByTeacher,
  attendanceList,
  getAttendanceReport,
  getStudentAttendanceHistory,
  updateAttendance
);

export const teacherExamMarkController = new ExamMarkManagementController(
  examMarkCreate,
  getStudentsByExam,
  updateExamMark,
  resolveExamConcern
);

export const teacherExamManagementController = new ExamManagementController(
  examCreate,
  examUpdate,
  getTeacherExams,
  examFindClassBase
);

export const teacherScheduleController = new TeacherDailyScheduleView(teacherSchedule);

export const teacherClassStatsController = new TeacherClassStatsController(
  getClassDetails,
  getStudentPerformance
);

export const teacherStudentLeaveController = new StudentLeaveController(
  applyLeave,
  getLeaveHistory,
  getClassLeaves,
  processLeave
);

export const teacherDashboardController = new TeacherDashboardController(getTeacherDashboard);
