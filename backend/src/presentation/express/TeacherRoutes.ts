import { Router } from "express";
import { authMiddleware } from "../../infrastructure/middleware/AuthMiddleWare";
import { AssignmentMongo } from "../../infrastructure/repositories/Assiggment/MongoAssignment";
import { AssignmentCreate } from "../../applications/useCases/Assignment/AssignmentCreateUseCase";
import { AssignmentManageController } from "../http/controllers/Teacher/AssignmentCreateController";
import { Assignmentupload } from "../../infrastructure/middleware/AssignmentDocument";
import { GetTimeTableteacherList } from "../../applications/useCases/Assignment/GetAssignmentTeacherList";
import { UpdateAssignment } from "../../applications/useCases/Assignment/UpdateAssignmentUseCase";
import { GetAllTeacherAssignment } from "../../applications/useCases/Assignment/GetTeacherAssignment";
import { ValidateAssignment } from "../../applications/useCases/Assignment/ValidateAssignment";
import { GetAssignmentSubmissions } from "../../applications/useCases/Assignment/GetAssignmentSubmissions";



import { AttendanceMongoRepository } from "../../infrastructure/repositories/Attendance/AttendanceMongoRepo";
import { MongoTimeTableCreate } from "../../infrastructure/repositories/MongoTimeTableCreation";
import { TeacherDaybydayschedule } from "../../applications/useCases/Teacher/TeacherDayBydaySchedule";
import { TeacherDailyScheduleView } from "../http/controllers/Teacher/TeacherDayBydaySchedule";
import { AttendanceCreateUseCase } from "../../applications/useCases/Attendance/AttendanceCreateUseCase";
import { AttendanceController } from "../http/controllers/AttendanceController/AttendanceController";
import { AuthRequest } from "../../infrastructure/types/AuthRequest";
import { MongoClassRepository } from "../../infrastructure/repositories/MongoClassRepo";
import { MongoStudentRepo } from "../../infrastructure/repositories/MongoStudentRepo";
import { StudentFindClassBaseUseCase } from "../../applications/useCases/Students/StudentFindClassIDbaseUseCase";
import { StudentCreateController } from "../http/controllers/Student/StudentController";
import { FindStudentsByTeacherUseCase } from "../../applications/useCases/Attendance/FindTeacherIdBaseAttendance";
import { AttendanceListUseCase } from "../../applications/useCases/Attendance/AttendanceList";
import { GetAttendanceReportUseCase } from "../../applications/useCases/Attendance/GetAttendanceReportUseCase";
import { GetStudentAttendanceHistoryUseCase } from "../../applications/useCases/Attendance/GetStudentAttendanceHistoryUseCase";
import { UpdateAttendanceUseCase } from "../../applications/useCases/Attendance/UpdateAttendanceUseCase";

import { MongoTeacher } from "../../infrastructure/repositories/MongoTeacherRepo";
import { ParentMongoRepository } from "../../infrastructure/repositories/ParentRepository";






////////////////// exam management controller


import { ClassManagementController } from "../http/controllers/Classroom/ClassController";
import { CreateClassUseCase } from "../../applications/useCases/Classdata/CreateClass";
import { GetAllClass } from "../../applications/useCases/Classdata/GeallClass";
import { UpdateClassUseCase } from "../../applications/useCases/Classdata/ClassUpdate";
import { AssignClass } from "../../applications/useCases/Classdata/ClassAssignUseCase";
import { DeleteClassUseCase } from "../../applications/useCases/Classdata/deleteClassUseCase";
import { ExamManagementController } from "../http/controllers/ExamManagement/ExamManagementController";
import { ExamMongoRepo } from "../../infrastructure/repositories/ExamRepo/ExamMongoRepo";
import { ExamCreateUseCase } from "../../applications/useCases/Exam/ExamCreateUseCase";
import { ExamUpdateTeacherUseCase } from "../../applications/useCases/Exam/ExamUpdateUseCase";
import { GetTeacherExamsUseCase } from "../../applications/useCases/Exam/GetTeacherExamsUseCase";



import { ExamMarkCreateUseCase } from "../../applications/useCases/Exam/ExamMarkCreateUseCase";
import { ExamMarkMongoRepository } from "../../infrastructure/repositories/ExamRepo/ExamMarkMongoRepo";
import { ExamMarkManagementController } from "../http/controllers/ExamManagement/ExamMarkManagementController";
import { GetStudentsByExamUseCase } from "../../applications/useCases/Exam/exammarkviewgetusecase";
import { ExamFindClassBase } from "../../applications/useCases/Exam/ExamFindClassBaseUseCase";
import { UpdateExamMarkUseCase } from "../../applications/useCases/Exam/UpdateExamMarkUseCase";



const Teacherrouter = Router();

const assignmentRepo = new AssignmentMongo();
const createUseCase = new AssignmentCreate(assignmentRepo);
const geteacherlist = new GetTimeTableteacherList(assignmentRepo)
const updateassignment = new UpdateAssignment(assignmentRepo)
const getallteacherdata = new GetAllTeacherAssignment(assignmentRepo)
const validateAssignmentUseCase = new ValidateAssignment(assignmentRepo);
const getSubmissionsUseCase = new GetAssignmentSubmissions(assignmentRepo);

const assignmentController = new AssignmentManageController(
  createUseCase,
  geteacherlist,
  updateassignment,
  getallteacherdata,
  validateAssignmentUseCase,
  getSubmissionsUseCase
);



const attendancerepo = new AttendanceMongoRepository()
const classrepo = new MongoClassRepository()
const studentrepo = new MongoStudentRepo()
const studentfindclassbase = new StudentFindClassBaseUseCase(studentrepo, classrepo)

const createClass = new CreateClassUseCase(classrepo);
const getlistclass = new GetAllClass(classrepo);
const classupdateusecase = new UpdateClassUseCase(classrepo);
const assignclass = new AssignClass(classrepo);
const deleteclassordivision = new DeleteClassUseCase(classrepo);

const classController = new ClassManagementController(
  createClass,
  getlistclass,
  classupdateusecase,
  assignclass,
  deleteclassordivision
);

const parentrepo = new ParentMongoRepository()
const atendancecreate = new AttendanceCreateUseCase(attendancerepo, classrepo, studentrepo, parentrepo)
const attendancecheckteacher = new FindStudentsByTeacherUseCase(studentrepo, attendancerepo)
const attendancelist = new AttendanceListUseCase(attendancerepo)
const getAttendanceReport = new GetAttendanceReportUseCase(attendancerepo)
const getStudentHistory = new GetStudentAttendanceHistoryUseCase(attendancerepo)
const updateAttendanceUseCase = new UpdateAttendanceUseCase(attendancerepo);

const attendanceController = new AttendanceController(
  atendancecreate, studentfindclassbase,
  attendancecheckteacher,
  attendancelist,
  getAttendanceReport,
  getStudentHistory,
  updateAttendanceUseCase
)




const examrepo = new ExamMongoRepo()
const teacherrepo = new MongoTeacher()
const exammarkrepo = new ExamMarkMongoRepository()
const examcreate = new ExamCreateUseCase(examrepo, classrepo, teacherrepo)
const updateexam = new ExamUpdateTeacherUseCase(examrepo, teacherrepo)
const findall = new GetTeacherExamsUseCase(examrepo, exammarkrepo)


import { ResolveExamConcernUseCase } from "../../applications/useCases/Exam/ResolveExamConcernUseCase";


const exammarkcreate = new ExamMarkCreateUseCase(exammarkrepo, studentrepo, examrepo)
const studentgetrepo = new GetStudentsByExamUseCase(examrepo, studentrepo, exammarkrepo)
const updateExamMarkUseCase = new UpdateExamMarkUseCase(exammarkrepo, examrepo)
const resolveConcernUseCase = new ResolveExamConcernUseCase(exammarkrepo);

const exammarkcontroller = new ExamMarkManagementController(exammarkcreate, studentgetrepo, updateExamMarkUseCase, resolveConcernUseCase)
// ...

Teacherrouter.put('/exammark/update',
  authMiddleware,
  (req, res) => exammarkcontroller.updateExamMark(req as AuthRequest, res)
)

Teacherrouter.post('/exammark/resolve-concern',
  authMiddleware,
  (req, res) => exammarkcontroller.resolveConcern(req as AuthRequest, res)
)
const examfindclassbase = new ExamFindClassBase(examrepo)

const timetableRepo = new MongoTimeTableCreate();
const teacherScheduleUseCase = new TeacherDaybydayschedule(timetableRepo);
const teacherScheduleController = new TeacherDailyScheduleView(teacherScheduleUseCase);


const exammanagementcontroller = new ExamManagementController(
  examcreate,
  updateexam,
  findall,
  examfindclassbase,

)




Teacherrouter.post(
  '/assignment',
  authMiddleware,
  Assignmentupload.array("documents", 5),
  (req, res) => assignmentController.CreateTimeTable(req, res)
);



Teacherrouter.get(
  '/teacher-info',
  authMiddleware,
  (req, res) => assignmentController.GetTeachertimetabledata(req, res)
);

Teacherrouter.put(
  "/assignment/:id",
  authMiddleware,
  Assignmentupload.array("documents", 5),
  (req, res) => assignmentController.Updateassignment(req, res)
);

Teacherrouter.get('/assignments', authMiddleware, (req, res) => assignmentController.GetAllAssignemntExistedTeacher(req, res))

Teacherrouter.post('/assignment/validate', authMiddleware, (req, res) => assignmentController.validateAssignment(req, res));
Teacherrouter.get('/assignment/:id/submissions', authMiddleware, (req, res) => assignmentController.getAssignmentSubmissions(req, res));



Teacherrouter.post('/attendance/create',
  authMiddleware,
  (req, res) => {
    attendanceController.Create(req as AuthRequest, res)
  })

// Route to get all classes for assignment creation
Teacherrouter.get("/get-all-classes", (req, res) => {
  classController.getAll(req, res);
});



Teacherrouter.get(
  "/class/:classId/students",
  authMiddleware,
  (req, res) =>
    attendanceController.FindStudntSClassBase(req as AuthRequest, res)
);

Teacherrouter.get(
  "/attendance/students",
  authMiddleware,
  (req, res) => attendanceController.findStudentsByTeacher(req as AuthRequest, res)
);

Teacherrouter.get(`/attendance/summary/:classId`,
  authMiddleware,
  (req, res) => attendanceController.AttendanceList(req as AuthRequest, res)
)

Teacherrouter.get('/attendance/report/:classId',
  authMiddleware,
  (req, res) => attendanceController.getReport(req as AuthRequest, res)
)


Teacherrouter.get('/attendance/student/:studentId/history',
  authMiddleware,
  (req, res) => attendanceController.getStudentHistory(req as AuthRequest, res)
)

Teacherrouter.put('/attendance/update',
  authMiddleware,
  (req, res) => attendanceController.updateAttendance(req as AuthRequest, res)
)




Teacherrouter.post('/exam/create',
  authMiddleware,
  (req, res) => exammanagementcontroller.CreateExam(req as AuthRequest, res)
)

Teacherrouter.put('/exam/update/:id',
  authMiddleware,
  (req, res) => exammanagementcontroller.UpdateExam(req as AuthRequest, res)
)


Teacherrouter.get("/exams",
  authMiddleware, (req, res) =>
  exammanagementcontroller.getTeacherExams(req as AuthRequest, res)
);

Teacherrouter.post('/exammark/create',
  authMiddleware,
  (req, res) => exammarkcontroller.CreateExamMark(req as AuthRequest, res)
)



Teacherrouter.get(
  "/exam/:examId/students",
  authMiddleware,
  (req, res) => exammarkcontroller.getStudentsByExam(req as AuthRequest, res)
);

Teacherrouter.get(
  "/class/:classId/exams",
  authMiddleware,
  (req, res) =>
    exammanagementcontroller.FindExamClassBase(req as AuthRequest, res)
);


Teacherrouter.get(
  "/class/:examId/results",
  authMiddleware,
  (req, res) =>
    exammarkcontroller.getStudentsByExam(req as AuthRequest, res)
);



Teacherrouter.put('/exammark/update',
  authMiddleware,
  (req, res) => exammarkcontroller.updateExamMark(req as AuthRequest, res)
)

Teacherrouter.get('/schedule',
  authMiddleware,
  (req, res) => teacherScheduleController.TeacherViewSchedule(req as AuthRequest, res)
);

import { TeacherClassStatsController } from "../http/controllers/Teacher/TeacherClassStatsController";
import { GetTeacherClassDetailsUseCase } from "../../applications/useCases/Teacher/GetTeacherClassDetailsUseCase";
import { GetStudentPerformanceUseCase } from "../../applications/useCases/Teacher/GetStudentPerformanceUseCase";

const getClassDetailsUseCase = new GetTeacherClassDetailsUseCase(classrepo, studentrepo, teacherrepo, exammarkrepo, attendancerepo);
const getStudentPerformanceUseCase = new GetStudentPerformanceUseCase(exammarkrepo, examrepo, attendancerepo);
const teacherClassStatsController = new TeacherClassStatsController(getClassDetailsUseCase, getStudentPerformanceUseCase);

Teacherrouter.get('/my-class',
  authMiddleware,
  (req, res) => teacherClassStatsController.getMyClassDetails(req as AuthRequest, res)
);

Teacherrouter.get('/student/:studentId/performance',
  authMiddleware,
  (req, res) => teacherClassStatsController.getStudentPerformance(req, res)
);

// Student Leave Dependencies
import { MongoStudentLeaveRepository } from "../../infrastructure/repositories/StudentLeave/MongoStudentLeaveRepository";
import { ApplyStudentLeaveUseCase } from "../../applications/useCases/StudentLeave/ApplyStudentLeaveUseCase";
import { GetStudentLeaveHistoryUseCase } from "../../applications/useCases/StudentLeave/GetStudentLeaveHistoryUseCase";
import { GetClassStudentLeavesUseCase } from "../../applications/useCases/StudentLeave/GetClassStudentLeavesUseCase";
import { ProcessStudentLeaveUseCase } from "../../applications/useCases/StudentLeave/ProcessStudentLeaveUseCase";
import { StudentLeaveController } from "../http/controllers/StudentLeave/StudentLeaveController";
import { MongoParentSignUp } from "../../infrastructure/repositories/MongoSignupParents";

const studentLeaveRepo = new MongoStudentLeaveRepository();
const parentAuthRepo = new MongoParentSignUp();
const applyLeaveUC = new ApplyStudentLeaveUseCase(studentLeaveRepo);
const getHistoryUC = new GetStudentLeaveHistoryUseCase(studentLeaveRepo);
const getClassLeavesUC = new GetClassStudentLeavesUseCase(studentLeaveRepo);
const processLeaveUC = new ProcessStudentLeaveUseCase(studentLeaveRepo, parentAuthRepo);
const studentLeaveController = new StudentLeaveController(applyLeaveUC, getHistoryUC, getClassLeavesUC, processLeaveUC);

Teacherrouter.get('/leave/class/:classId',
  authMiddleware,
  (req, res) => studentLeaveController.getClassLeaves(req, res)
);

Teacherrouter.patch('/leave/:id/status',
  authMiddleware,
  (req, res) => studentLeaveController.updateLeaveStatus(req as AuthRequest, res)
);

import { TeacherDashboardController } from "../http/controllers/Teacher/TeacherDashboardController";
import { GetTeacherDashboardUseCase } from "../../applications/useCases/Teacher/GetTeacherDashboardUseCase";

const teacherDashboardUseCase = new GetTeacherDashboardUseCase(
  studentrepo,
  assignmentRepo,
  timetableRepo,
  examrepo,
  exammarkrepo,
  classrepo
);
const teacherDashboardController = new TeacherDashboardController(teacherDashboardUseCase);

Teacherrouter.get('/dashboard',
  authMiddleware,
  (req, res) => teacherDashboardController.getDashboardStats(req as AuthRequest, res)
);

export default Teacherrouter;
