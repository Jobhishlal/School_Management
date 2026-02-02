import { Router, Request, Response } from "express";
import { MongoStudentRepo } from "../../infrastructure/repositories/MongoStudentRepo";
import { StudentProfilePageview } from "../../applications/useCases/Students/StudentProfileListPage";
import { StudentProfileController } from "../http/controllers/Student/StudentProfileController";
import { authMiddleware } from '../../infrastructure/middleware/AuthMiddleWare';
import { AuthRequest } from "../../infrastructure/types/AuthRequest";
import { StudentTimeTableViewUseCase } from "../../applications/useCases/admin/TimeTable/StudentTimetableview";
import { MongoTimeTableCreate } from "../../infrastructure/repositories/MongoTimeTableCreation";
import { StudentTimetableController } from "../http/controllers/Student/StudentTimeTableController";
import { AssignmentMongo } from "../../infrastructure/repositories/Assiggment/MongoAssignment";
import { StudentGetAssignment } from "../../applications/useCases/Students/AssignmentView";
import { AssignmentViewStudentsController } from "../http/controllers/Student/StudentAssignment";
import { AssignmentSubmit } from "../../applications/useCases/Assignment/StudentAssignmentSubmit";
import { assignmentUpload } from "../../infrastructure/middleware/AssignmentSubmit";


import { AnnouncementMongo } from "../../infrastructure/repositories/Announcement/MongoAnnoucement";
import { ClassBaseFindAnnouncementUseCase } from "../../applications/useCases/Announcement/AnnouncementFindClassBase";
import { AnnouncementReadController } from "../http/controllers/Student/AnnouncementController";




///// Exam list

import { ExamMongoRepo } from "../../infrastructure/repositories/ExamRepo/ExamMongoRepo";
import { Examclassbaseviewusecase } from "../../applications/useCases/Exam/Examclassbaseviewpage";
import { StudentviewExamController } from "../http/controllers/Student/StudentExamController";

import { GetStudentExamResultsUseCase } from "../../applications/useCases/Exam/GetStudentExamResultsUseCase";
import { ExamMarkMongoRepository } from "../../infrastructure/repositories/ExamRepo/ExamMarkMongoRepo";









const Studentrouter = Router();

const studentmongo = new MongoStudentRepo();
const studentgetprofile = new StudentProfilePageview(studentmongo);
const StudentController = new StudentProfileController(studentgetprofile);

const timetablemongo = new MongoTimeTableCreate()
const studentusecase = new StudentTimeTableViewUseCase(timetablemongo)
const studenttimetablecontroller = new StudentTimetableController(studentusecase)


const assignmentrepo = new AssignmentMongo()
const assignmentget = new StudentGetAssignment(assignmentrepo)
const assignmentsubmit = new AssignmentSubmit(assignmentrepo)
const assignmentcontroller = new AssignmentViewStudentsController(assignmentget, assignmentsubmit)


const announcementrepo = new AnnouncementMongo()
const findannouncementusecase = new ClassBaseFindAnnouncementUseCase(announcementrepo)
const Announcementreadcontroller = new AnnouncementReadController(
  findannouncementusecase,
  studentgetprofile
)


const mongorepo = new ExamMongoRepo()
const examlistusecase = new Examclassbaseviewusecase(mongorepo, studentmongo)
import { RaiseExamConcernUseCase } from "../../applications/useCases/Exam/RaiseExamConcernUseCase";

import { MongoClassRepository } from "../../infrastructure/repositories/MongoClassRepo";

const exammark = new ExamMarkMongoRepository()
const classRepo = new MongoClassRepository();
const examresultview = new GetStudentExamResultsUseCase(mongorepo, exammark, studentmongo, classRepo)
const raiseConcernUseCase = new RaiseExamConcernUseCase(exammark);

const studentexamlistcontroller = new StudentviewExamController(
  examlistusecase,
  examresultview,
  raiseConcernUseCase
)


Studentrouter.get("/profile", authMiddleware, async (req, res) => {
  const authReq = req as AuthRequest;
  return StudentController.GetProfile(authReq, res);
});


Studentrouter.get('/timetable-view', (req, res) => studenttimetablecontroller.TimeTableView(req, res))

Studentrouter.get('/assignment-view',
  authMiddleware, (req, res) => {
    const authReq = req as AuthRequest;
    return assignmentcontroller.AssignmentStudentview(authReq, res)

  })
Studentrouter.post(
  "/assignment-submit",
  authMiddleware,
  assignmentUpload.array("documents", 5),
  async (req, res) => {
    try {
      await assignmentcontroller.SubmitData(req, res);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);


Studentrouter.get('/announcement-find',
  authMiddleware, (req, res) => {

    Announcementreadcontroller.Findannouncement(req as AuthRequest, res)
  });

Studentrouter.get('/exam/view-exam-list',
  authMiddleware,
  (req, res) => studentexamlistcontroller.classbaseexamviewpage(req as AuthRequest, res)
)

Studentrouter.post('/exam/view-results',
  authMiddleware,
  (req, res) => studentexamlistcontroller.getStudentExamResults(req as AuthRequest, res)
);

Studentrouter.post('/exam/raise-concern',
  authMiddleware,
  (req, res) => studentexamlistcontroller.raiseConcern(req as AuthRequest, res)
);

import { AttendanceMongoRepository } from "../../infrastructure/repositories/Attendance/AttendanceMongoRepo";
import { StudentAttendanceDashboardUseCase } from "../../applications/useCases/Students/StudentAttendanceDashboardUseCase";
import { StudentDateBaseAttendanceSearchUseCase } from "../../applications/useCases/Students/StudentDateBaseAttendanceSearchUseCase";
import { StudentAttendanceController } from "../http/controllers/Student/StudentAttendanceController";
import { StudentDashboardController } from "../http/controllers/Student/StudentDashboardController";
import { GetStudentDashboardUseCase } from "../../applications/useCases/StudentDashboard/GetStudentDashboardUseCase";

const attRep = new AttendanceMongoRepository();
const stAttDash = new StudentAttendanceDashboardUseCase(attRep);
const stAttDate = new StudentDateBaseAttendanceSearchUseCase(attRep);
const stAttController = new StudentAttendanceController(stAttDash, stAttDate);

Studentrouter.get('/attendance/today',
  authMiddleware,
  (req, res) => stAttController.getAttendanceDashboard(req as AuthRequest, res)
);

Studentrouter.get('/attendance/filter',
  authMiddleware,
  (req, res) => stAttController.findAttendanceByDateRange(req as AuthRequest, res)
);



const getStudentDashboardUseCase = new GetStudentDashboardUseCase(
  timetablemongo,
  attRep,
  assignmentrepo,
  mongorepo,
  announcementrepo,
  studentmongo
);

const studentDashboardController = new StudentDashboardController(getStudentDashboardUseCase);

Studentrouter.get('/dashboard',
  authMiddleware,
  (req, res) => studentDashboardController.getDashboard(req as AuthRequest, res)
);



export default Studentrouter;
