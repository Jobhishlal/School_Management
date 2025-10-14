import { Router, Request, Response } from "express";
import { MongoStudentRepo } from "../../infrastructure/repositories/MongoStudentRepo";
import { StudentProfilePageview } from "../../applications/useCases/Students/StudentProfileListPage";
import { StudentProfileController } from "../http/controllers/Student/StudentProfileController";
import { authMiddleware } from '../../infrastructure/middleware/AuthMiddleWare';
import { AuthRequest } from "../../infrastructure/types/AuthRequest";
import { StudentTimeTableViewUseCase } from "../../applications/useCases/admin/TimeTable/StudentTimetableview";
import { MongoTimeTableCreate } from "../../infrastructure/repositories/MongoTimeTableCreation";
import { StudentTimetableController } from "../http/controllers/Student/StudentTimeTableController";

const Studentrouter = Router();

const studentmongo = new MongoStudentRepo();
const studentgetprofile = new StudentProfilePageview(studentmongo);
const StudentController = new StudentProfileController(studentgetprofile);

const timetablemongo = new MongoTimeTableCreate()
const studentusecase = new StudentTimeTableViewUseCase(timetablemongo)
const studenttimetablecontroller = new StudentTimetableController(studentusecase)

Studentrouter.get("/profile", authMiddleware, async (req, res) => {
  const authReq = req as AuthRequest;
  return StudentController.GetProfile(authReq, res);
});


Studentrouter.get('/timetable-view',(req,res)=>studenttimetablecontroller.TimeTableView(req,res))

export default Studentrouter;
