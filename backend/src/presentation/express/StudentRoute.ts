import { Router, Request, Response } from "express";
import { MongoStudentRepo } from "../../infrastructure/repositories/MongoStudentRepo";
import { StudentProfilePageview } from "../../applications/useCases/Students/StudentProfileListPage";
import { StudentProfileController } from "../http/controllers/Student/StudentProfileController";
import { authMiddleware } from '../../infrastructure/middleware/AuthMiddleWare';
import { AuthRequest } from "../../infrastructure/types/AuthRequest";

const Studentrouter = Router();

const studentmongo = new MongoStudentRepo();
const studentgetprofile = new StudentProfilePageview(studentmongo);
const StudentController = new StudentProfileController(studentgetprofile);

Studentrouter.get("/profile", authMiddleware, async (req, res) => {
  const authReq = req as AuthRequest;
  return StudentController.GetProfile(authReq, res);
});


export default Studentrouter;
