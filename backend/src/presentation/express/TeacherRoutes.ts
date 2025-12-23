import { Router } from "express";
import { authMiddleware } from "../../infrastructure/middleware/AuthMiddleWare";
import { AssignmentMongo } from "../../infrastructure/repositories/Assiggment/MongoAssignment";
import { AssignmentCreate } from "../../applications/useCases/Assignment/AssignmentCreateUseCase";
import { AssignmentManageController } from "../http/controllers/Teacher/AssignmentCreateController";
import { Assignmentupload } from "../../infrastructure/middleware/AssignmentDocument"; 
import { GetTimeTableteacherList } from "../../applications/useCases/Assignment/GetAssignmentTeacherList";
import { UpdateAssignment } from "../../applications/useCases/Assignment/UpdateAssignmentUseCase";
import { GetAllTeacherAssignment } from "../../applications/useCases/Assignment/GetTeacherAssignment";


import { AttendanceMongoRepository } from "../../infrastructure/repositories/Attendance/AttendanceMongoRepo";
import { AttendanceCreateUseCase } from "../../applications/useCases/Attendance/AttendanceCreateUseCase";
import { AttendanceController } from "../http/controllers/AttendanceController/AttendanceController";
import { AuthRequest } from "../../infrastructure/types/AuthRequest";
import { MongoClassRepository } from "../../infrastructure/repositories/MongoClassRepo";
import { MongoStudentRepo } from "../../infrastructure/repositories/MongoStudentRepo";
import { StudentFindClassBaseUseCase } from "../../applications/useCases/Students/StudentFindClassIDbaseUseCase";
import { StudentCreateController } from "../http/controllers/Student/StudentController";
import { FindStudentsByTeacherUseCase } from "../../applications/useCases/Attendance/FindTeacherIdBaseAttendance";
import { AttendanceListUseCase} from "../../applications/useCases/Attendance/AttendanceList";
 
import { MongoTeacher } from "../../infrastructure/repositories/MongoTeacherRepo";






////////////////// exam management controller


import { ExamManagementController } from "../http/controllers/ExamManagement/ExamManagementController";
import { ExamMongoRepo } from "../../infrastructure/repositories/ExamRepo/ExamMongoRepo";
import { ExamCreateUseCase } from "../../applications/useCases/Exam/ExamCreateUseCase";
import { ExamUpdateTeacherUseCase } from "../../applications/useCases/Exam/ExamUpdateUseCase";
import { GetTeacherExamsUseCase } from "../../applications/useCases/Exam/GetTeacherExamsUseCase";










const Teacherrouter = Router();

const assignmentRepo = new AssignmentMongo();
const createUseCase = new AssignmentCreate(assignmentRepo);
const geteacherlist = new GetTimeTableteacherList(assignmentRepo)
const updateassignment = new UpdateAssignment(assignmentRepo)
const getallteacherdata = new GetAllTeacherAssignment(assignmentRepo)
const assignmentController = new AssignmentManageController(createUseCase,geteacherlist,updateassignment,getallteacherdata);



const attendancerepo = new AttendanceMongoRepository()
const classrepo = new MongoClassRepository()
const studentrepo = new MongoStudentRepo()
const studentfindclassbase = new StudentFindClassBaseUseCase(studentrepo,classrepo)

const atendancecreate = new AttendanceCreateUseCase(attendancerepo,classrepo,studentrepo)
const attendancecheckteacher = new FindStudentsByTeacherUseCase(studentrepo,attendancerepo)
const attendancelist = new AttendanceListUseCase(attendancerepo)
const attendanceController = new AttendanceController(
  atendancecreate,studentfindclassbase,
  attendancecheckteacher,
  attendancelist
)




const examrepo = new ExamMongoRepo()
const teacherrepo = new MongoTeacher()
const examcreate = new ExamCreateUseCase(examrepo,classrepo,teacherrepo)
const updateexam = new ExamUpdateTeacherUseCase(examrepo,teacherrepo)
const findall = new GetTeacherExamsUseCase(examrepo)
const exammanagementcontroller = new ExamManagementController(
  examcreate,
  updateexam,
  findall
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

  Teacherrouter.get('/TeachAssignmentList',authMiddleware,(req,res)=> assignmentController.GetAllAssignemntExistedTeacher(req,res))



  Teacherrouter.post('/attendance/create',
    authMiddleware,
    (req,res)=>{
  attendanceController.Create(req as AuthRequest,res)
})



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

Teacherrouter.get( `/attendance/summary/:classId`,
   authMiddleware,
   (req,res)=>attendanceController.AttendanceList(req as AuthRequest,res)
)



Teacherrouter.post('/exam/create',
  authMiddleware,
  (req,res)=>exammanagementcontroller.CreateExam(req as AuthRequest,res)
)

Teacherrouter.put('/exam/update/:id',
  authMiddleware,
  (req,res)=>exammanagementcontroller.UpdateExam(req as AuthRequest,res)
)
Teacherrouter.get("/exams", authMiddleware, (req, res) =>
  exammanagementcontroller.getTeacherExams(req as AuthRequest, res)
);

export default Teacherrouter;
