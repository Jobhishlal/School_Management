import { Router } from "express";
import {
  studentProfileController,
  studentTimetableController,
  studentAssignmentController,
  studentAnnouncementController,
  studentExamController,
  studentAttendanceController,
  studentDashboardController
} from "../../infrastructure/di/studentDI";
import { authMiddleware } from '../../infrastructure/middleware/AuthMiddleWare';
import { AuthRequest } from "../../infrastructure/types/AuthRequest";
import { assignmentUpload } from "../../infrastructure/middleware/AssignmentSubmit";

const Studentrouter = Router();

Studentrouter.get("/profile", authMiddleware, async (req, res) => {
  const authReq = req as AuthRequest;
  return studentProfileController.GetProfile(authReq, res);
});


Studentrouter.get('/timetable-view', (req, res) => studentTimetableController.TimeTableView(req, res))

Studentrouter.get('/assignment-view',
  authMiddleware, (req, res) => {
    const authReq = req as AuthRequest;
    return studentAssignmentController.AssignmentStudentview(authReq, res)

  })
Studentrouter.post(
  "/assignment-submit",
  authMiddleware,
  assignmentUpload.array("documents", 5),
  async (req, res) => {
    try {
      await studentAssignmentController.SubmitData(req, res);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);


Studentrouter.get('/announcement-find',
  authMiddleware, (req, res) => {

    studentAnnouncementController.Findannouncement(req as AuthRequest, res)
  });

Studentrouter.get('/exam/view-exam-list',
  authMiddleware,
  (req, res) => studentExamController.classbaseexamviewpage(req as AuthRequest, res)
)

Studentrouter.post('/exam/view-results',
  authMiddleware,
  (req, res) => studentExamController.getStudentExamResults(req as AuthRequest, res)
);

Studentrouter.post('/exam/raise-concern',
  authMiddleware,
  (req, res) => studentExamController.raiseConcern(req as AuthRequest, res)
);

Studentrouter.get('/attendance/today',
  authMiddleware,
  (req, res) => studentAttendanceController.getAttendanceDashboard(req as AuthRequest, res)
);

Studentrouter.get('/attendance/filter',
  authMiddleware,
  (req, res) => studentAttendanceController.findAttendanceByDateRange(req as AuthRequest, res)
);

Studentrouter.get('/dashboard',
  authMiddleware,
  (req, res) => studentDashboardController.getDashboard(req as AuthRequest, res)
);

export default Studentrouter;
