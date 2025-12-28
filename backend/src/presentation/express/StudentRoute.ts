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
const assignmentcontroller = new AssignmentViewStudentsController(assignmentget,assignmentsubmit)


const announcementrepo = new AnnouncementMongo()
const findannouncementusecase = new ClassBaseFindAnnouncementUseCase(announcementrepo)
const Announcementreadcontroller = new AnnouncementReadController(
  findannouncementusecase,
  studentgetprofile
)


const mongorepo = new ExamMongoRepo()
const examlistusecase = new Examclassbaseviewusecase(mongorepo,studentmongo)
const exammark = new ExamMarkMongoRepository()
const examresultview = new GetStudentExamResultsUseCase(mongorepo,exammark,studentmongo)
const studentexamlistcontroller = new StudentviewExamController(
  examlistusecase,
  examresultview
)


Studentrouter.get("/profile", authMiddleware, async (req, res) => {
  const authReq = req as AuthRequest;
  return StudentController.GetProfile(authReq, res);
});


Studentrouter.get('/timetable-view',(req,res)=>studenttimetablecontroller.TimeTableView(req,res))

Studentrouter.get('/assignment-view',
  authMiddleware,(req,res)=>{
  const authReq = req as AuthRequest;
  return assignmentcontroller.AssignmentStudentview(authReq,res)

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
  (req,res)=>studentexamlistcontroller.classbaseexamviewpage(req as AuthRequest,res)
)

Studentrouter.post('/exam/view-results',
  authMiddleware,
  (req,res) => studentexamlistcontroller.getStudentExamResults(req as AuthRequest, res)
);

export default Studentrouter;
