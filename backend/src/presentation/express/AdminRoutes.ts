import { Router } from "express";
import { AdminController } from "../http/controllers/ADMIN/AdminController";
import { SignupAdmin } from "../../applications/useCases/SignupAdmin";
import { GetAdmin } from "../../applications/useCases/GetAdmin";
import { AdminRepository } from "../../infrastructure/repositories/AdminRepository";
import { GenarateOtpP } from "../../applications/useCases/GenarateOpt";
import { ResendOtp } from "../../applications/useCases/ResenOtp";
import { CreateSubAdmin } from '../../applications/useCases/CreatetSubAdmin';
import { UpdateDetails } from "../../applications/useCases/UpdateSubAdmin";
import { MongoSubAdminRepo } from '../../infrastructure/repositories/MongoSubAdminRepo';
import { SubAdminCreateController } from '../http/controllers/ADMIN/SupAdmincreateController';
import { SubAdminBlock } from "../../applications/useCases/SubAdminBlock";
import { TeacherCreateController } from "../http/controllers/Teacher/TeachermanageController";
import { TeacherCreateUseCase } from "../../applications/useCases/Teacher/CreateTeacher";
import { MongoTeacher } from "../../infrastructure/repositories/MongoTeacherRepo";
import { UpdateTeacher } from "../../applications/useCases/Teacher/UpdateTeachers";
import { BlockTeacher } from "../../applications/useCases/Teacher/BlockTeacher";
import logger from "../../shared/constants/Logger";
import { upload } from "../../infrastructure/middleware/fileUploadService";

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

const teachercreatecontroller = new TeacherCreateController(createTeacherUseCase,updateTeacherUseCase,blockTeacherUseCase)




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


export default Adminrouter;