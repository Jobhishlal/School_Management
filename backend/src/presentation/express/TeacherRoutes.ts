import { Router } from "express";
import { authMiddleware } from "../../infrastructure/middleware/AuthMiddleWare";
import { Assignmentupload } from "../../infrastructure/middleware/AssignmentDocument";
import { AuthRequest } from "../../infrastructure/types/AuthRequest";
import {
  teacherAssignmentController,
  teacherClassController,
  teacherAttendanceController,
  teacherExamManagementController,
  teacherExamMarkController,
  teacherScheduleController,
  teacherClassStatsController,
  teacherStudentLeaveController,
  teacherDashboardController
} from "../../infrastructure/di/teacherDI";

const Teacherrouter = Router();

Teacherrouter.put('/exammark/update',
  authMiddleware,
  (req, res) => teacherExamMarkController.updateExamMark(req as AuthRequest, res)
)

Teacherrouter.post('/exammark/resolve-concern',
  authMiddleware,
  (req, res) => teacherExamMarkController.resolveConcern(req as AuthRequest, res)
)

Teacherrouter.post(
  '/assignment',
  authMiddleware,
  Assignmentupload.array("documents", 5),
  (req, res) => teacherAssignmentController.CreateTimeTable(req, res)
);

Teacherrouter.get(
  '/teacher-info',
  authMiddleware,
  (req, res) => teacherAssignmentController.GetTeachertimetabledata(req, res)
);

Teacherrouter.put(
  "/assignment/:id",
  authMiddleware,
  Assignmentupload.array("documents", 5),
  (req, res) => teacherAssignmentController.Updateassignment(req, res)
);

Teacherrouter.get('/assignments', authMiddleware, (req, res) => teacherAssignmentController.GetAllAssignemntExistedTeacher(req, res))

Teacherrouter.post('/assignment/validate', authMiddleware, (req, res) => teacherAssignmentController.validateAssignment(req, res));
Teacherrouter.get('/assignment/:id/submissions', authMiddleware, (req, res) => teacherAssignmentController.getAssignmentSubmissions(req, res));


Teacherrouter.post('/attendance/create',
  authMiddleware,
  (req, res) => {
    teacherAttendanceController.Create(req as AuthRequest, res)
  })

// Route to get all classes for assignment creation
Teacherrouter.get("/get-all-classes", (req, res) => {
  teacherClassController.getAll(req, res);
});


Teacherrouter.get(
  "/class/:classId/students",
  authMiddleware,
  (req, res) =>
    teacherAttendanceController.FindStudntSClassBase(req as AuthRequest, res)
);

Teacherrouter.get(
  "/attendance/students",
  authMiddleware,
  (req, res) => teacherAttendanceController.findStudentsByTeacher(req as AuthRequest, res)
);

Teacherrouter.get(`/attendance/summary/:classId`,
  authMiddleware,
  (req, res) => teacherAttendanceController.AttendanceList(req as AuthRequest, res)
)

Teacherrouter.get('/attendance/report/:classId',
  authMiddleware,
  (req, res) => teacherAttendanceController.getReport(req as AuthRequest, res)
)


Teacherrouter.get('/attendance/student/:studentId/history',
  authMiddleware,
  (req, res) => teacherAttendanceController.getStudentHistory(req as AuthRequest, res)
)

Teacherrouter.put('/attendance/update',
  authMiddleware,
  (req, res) => teacherAttendanceController.updateAttendance(req as AuthRequest, res)
)


Teacherrouter.post('/exam/create',
  authMiddleware,
  (req, res) => teacherExamManagementController.CreateExam(req as AuthRequest, res)
)

Teacherrouter.put('/exam/update/:id',
  authMiddleware,
  (req, res) => teacherExamManagementController.UpdateExam(req as AuthRequest, res)
)


Teacherrouter.get("/exams",
  authMiddleware, (req, res) =>
  teacherExamManagementController.getTeacherExams(req as AuthRequest, res)
);

Teacherrouter.post('/exammark/create',
  authMiddleware,
  (req, res) => teacherExamMarkController.CreateExamMark(req as AuthRequest, res)
)



Teacherrouter.get(
  "/exam/:examId/students",
  authMiddleware,
  (req, res) => teacherExamMarkController.getStudentsByExam(req as AuthRequest, res)
);

Teacherrouter.get(
  "/class/:classId/exams",
  authMiddleware,
  (req, res) =>
    teacherExamManagementController.FindExamClassBase(req as AuthRequest, res)
);


Teacherrouter.get(
  "/class/:examId/results",
  authMiddleware,
  (req, res) =>
    teacherExamMarkController.getStudentsByExam(req as AuthRequest, res)
);


Teacherrouter.put('/exammark/update',
  authMiddleware,
  (req, res) => teacherExamMarkController.updateExamMark(req as AuthRequest, res)
)

Teacherrouter.get('/schedule',
  authMiddleware,
  (req, res) => teacherScheduleController.TeacherViewSchedule(req as AuthRequest, res)
);

Teacherrouter.get('/my-class',
  authMiddleware,
  (req, res) => teacherClassStatsController.getMyClassDetails(req as AuthRequest, res)
);

Teacherrouter.get('/student/:studentId/performance',
  authMiddleware,
  (req, res) => teacherClassStatsController.getStudentPerformance(req, res)
);

Teacherrouter.get('/leave/class/:classId',
  authMiddleware,
  (req, res) => teacherStudentLeaveController.getClassLeaves(req, res)
);

Teacherrouter.patch('/leave/:id/status',
  authMiddleware,
  (req, res) => teacherStudentLeaveController.updateLeaveStatus(req as AuthRequest, res)
);

Teacherrouter.get('/dashboard',
  authMiddleware,
  (req, res) => teacherDashboardController.getDashboardStats(req as AuthRequest, res)
);

export default Teacherrouter;
