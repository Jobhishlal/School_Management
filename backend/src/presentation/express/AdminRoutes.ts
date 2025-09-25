import { Router } from "express";
import { AdminController } from "../http/controllers/ADMIN/AdminController";
import { SignupAdmin } from "../../applications/useCases/Auth/SignupAdmin";
import { GetAdmin } from "../../applications/useCases/admin/GetAdmin";
import { AdminRepository } from "../../infrastructure/repositories/AdminRepository";
import { GenarateOtpP } from "../../applications/useCases/Auth/GenarateOpt";
import { ResendOtp } from "../../applications/useCases/Auth/ResenOtp";
import { CreateSubAdmin } from '../../applications/useCases/admin/CreatetSubAdmin';
import { UpdateDetails } from "../../applications/useCases/admin/UpdateSubAdmin";
import { MongoSubAdminRepo } from '../../infrastructure/repositories/MongoSubAdminRepo';
import { SubAdminCreateController } from '../http/controllers/ADMIN/SupAdmincreateController';
import { SubAdminBlock } from "../../applications/useCases/admin/SubAdminBlock";
import { TeacherCreateController } from "../http/controllers/Teacher/TeachermanageController";
import { TeacherCreateUseCase } from "../../applications/useCases/Teacher/CreateTeacher";
import { MongoTeacher } from "../../infrastructure/repositories/MongoTeacherRepo";
import { UpdateTeacher } from "../../applications/useCases/Teacher/UpdateTeachers";
import { BlockTeacher } from "../../applications/useCases/Teacher/BlockTeacher";
import logger from "../../shared/constants/Logger";
import { upload } from "../../infrastructure/middleware/fileUploadService";
import { studentUpload } from "../../infrastructure/middleware/StudentUpload";
import {StudentCreateController} from '../http/controllers/Student/StudentController'
import { MongoStudentRepo } from "../../infrastructure/repositories/MongoStudentRepo";
import { StudentAddUseCase } from "../../applications/useCases/Students/CreateStudents";
import { ParentManagementCOntroller } from "../http/controllers/ParentController.ts/ParentController";
import { ParentMongoRepository } from "../../infrastructure/repositories/ParentRepository";
import { ParentAddUseCase } from "../../applications/useCases/Parent/ParentUseCase";
import { ParentgetAll } from "../../applications/useCases/Parent/GetAllParents";
import { AddressManagementController } from "../http/controllers/Address/AddressManagementController";
import { AddressMongoRepository } from "../../infrastructure/repositories/AddressRepoMongo";
import { AddressGetAll } from "../../applications/useCases/Address/GetAllAddress";
import { CreatAddressUseCase } from "../../applications/useCases/Address/CreateAddress";


import { ClassManagementController } from "../http/controllers/Classroom/ClassController";
import { MongoClassRepository } from "../../infrastructure/repositories/MongoClassRepo";
import { CreateClassUseCase } from "../../applications/useCases/Classdata/CreateClass";
import { GetAllClass } from "../../applications/useCases/Classdata/GeallClass";
import { StudentList } from "../../applications/useCases/Students/GetAllStudents";


const repo = new AdminRepository();
const data = new MongoSubAdminRepo();
const value = new MongoTeacher();
const createSubAdminUseCase = new CreateSubAdmin(data);
const updateSubAdminUseCase = new UpdateDetails(data)
const subadminblockUseCase = new SubAdminBlock(data)
const subAdminController = new SubAdminCreateController(createSubAdminUseCase,updateSubAdminUseCase,subadminblockUseCase);

const Adminrouter = Router();

const signupUseCase = new SignupAdmin(repo);
const getAdminUseCase = new GetAdmin(repo);
const generateOtpUseCase = new GenarateOtpP(repo);
const resendOtpUseCase = new ResendOtp();

const adminController = new AdminController(  signupUseCase,  getAdminUseCase,  generateOtpUseCase,  resendOtpUseCase);

const createTeacherUseCase = new TeacherCreateUseCase(value);
const updateTeacherUseCase = new UpdateTeacher(value)
const blockTeacherUseCase = new BlockTeacher(value)
const parentrepo = new ParentMongoRepository()
const teachercreatecontroller = new TeacherCreateController(createTeacherUseCase,updateTeacherUseCase,blockTeacherUseCase)
const studentrepo = new MongoStudentRepo()
const createstudentUseCase = new StudentAddUseCase(studentrepo,parentrepo)
const getliststundetUseCase = new StudentList(studentrepo)

const studentcreatecontroller = new StudentCreateController(studentrepo,createstudentUseCase,getliststundetUseCase)


const createparentrepo = new ParentAddUseCase(parentrepo)
const getallparentrepo = new ParentgetAll(parentrepo)

const ParentControllerroute = new ParentManagementCOntroller(createparentrepo,getallparentrepo)

const addressrepo = new AddressMongoRepository()
const createaddressusecase = new CreatAddressUseCase(addressrepo)
const getalladdressusecase = new AddressGetAll(addressrepo)
const AddressController = new AddressManagementController(getalladdressusecase,createaddressusecase)


const classReop = new MongoClassRepository()
const createClass = new CreateClassUseCase(classReop)
const getlistclass = new GetAllClass(classReop)
const ClassController = new ClassManagementController(createClass,getlistclass)





Adminrouter.get("/signup", (req, res) => adminController.getAll(req, res));
Adminrouter.post("/signuppost", (req, res) => adminController.signupRequest(req, res));
Adminrouter.post('/verify-otp',(req,res)=>adminController.verifyOtp(req,res))
Adminrouter.post('/resend-otp',(req,res)=>adminController.resentOtp(req,res))

Adminrouter.get('/admins',(req,res)=>subAdminController.getAllSubAdmins(req,res))
Adminrouter.post('/adminscreate',(req,res)=>subAdminController.createSubAdmin(req,res))
Adminrouter.put('/admins/:id', (req,res)=> subAdminController.updatesubAdmin(req,res))
Adminrouter.put('/admins/:id/block',(req,res)=>subAdminController.subadminblock(req,res))
Adminrouter.get('/teacher',(req,res)=>teachercreatecontroller.getAllTeacher(req,res))
Adminrouter.post('/teacher', upload.array("documents", 5),(req,res)=>teachercreatecontroller.createteacher(req,res))
Adminrouter.put('/teacher/:id',upload.array("documents", 5),(req,res)=>teachercreatecontroller.updateTeacher(req,res))
Adminrouter.put('/teacher/:id/block',(req,res)=>teachercreatecontroller.blockTeacher(req,res))



Adminrouter.get("/parents",(req,res)=>ParentControllerroute.getAll(req,res))
Adminrouter.post("/parents",(req,res)=>ParentControllerroute.create(req,res))
Adminrouter.get("/address",(req,res)=>AddressController.getAll(req,res))
Adminrouter.post("/address",(req,res)=>AddressController.create(req,res))
Adminrouter.get("/class",(req,res)=>ClassController.getAll(req,res))
Adminrouter.post("/class",(req,res)=>ClassController.create(req,res))

Adminrouter.get('/studnets',(req,res)=>studentcreatecontroller.getAllStudents(req,res))
Adminrouter.post("/students",studentUpload.array("photos", 5),(req,res)=>studentcreatecontroller.create(req,res))








export default Adminrouter;