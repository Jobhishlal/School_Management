import { Router } from "express";
import { authMiddleware } from "../../infrastructure/middleware/AuthMiddleWare";
import { AssignmentMongo } from "../../infrastructure/repositories/Assiggment/MongoAssignment";
import { AssignmentCreate } from "../../applications/useCases/Assignment/AssignmentCreateUseCase";
import { AssignmentManageController } from "../http/controllers/Teacher/AssignmentCreateController";
import { Assignmentupload } from "../../infrastructure/middleware/AssignmentDocument"; 
import { GetTimeTableteacherList } from "../../applications/useCases/Assignment/GetAssignmentTeacherList";
import { UpdateAssignment } from "../../applications/useCases/Assignment/UpdateAssignmentUseCase";
import { GetAllTeacherAssignment } from "../../applications/useCases/Assignment/GetTeacherAssignment";

const Teacherrouter = Router();

const assignmentRepo = new AssignmentMongo();
const createUseCase = new AssignmentCreate(assignmentRepo);
const geteacherlist = new GetTimeTableteacherList(assignmentRepo)
const updateassignment = new UpdateAssignment(assignmentRepo)
const getallteacherdata = new GetAllTeacherAssignment(assignmentRepo)
const assignmentController = new AssignmentManageController(createUseCase,geteacherlist,updateassignment,getallteacherdata);


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

  Teacherrouter.get('/TeachAssignmentList',authMiddleware,(req,res)=> assignmentController.GetAllAssignemntExistedTeacher(req,res))



export default Teacherrouter;
