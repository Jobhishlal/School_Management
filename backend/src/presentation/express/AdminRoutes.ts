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
import logger from "../../infrastructure/utils/Logger";

const repo = new AdminRepository();
const data = new MongoSubAdminRepo();
const createSubAdminUseCase = new CreateSubAdmin(data);
const updateSubAdminUseCase = new UpdateDetails(data)
const subadminblockUseCase = new SubAdminBlock(data)
const subAdminController = new SubAdminCreateController(createSubAdminUseCase,updateSubAdminUseCase,subadminblockUseCase);

const Adminrouter = Router();

const signupUseCase = new SignupAdmin(repo);
const getAdminUseCase = new GetAdmin(repo);
const generateOtpUseCase = new GenarateOtpP(repo);
const resendOtpUseCase = new ResendOtp();

const adminController = new AdminController(
  signupUseCase,
  getAdminUseCase,
  generateOtpUseCase,
  resendOtpUseCase
);



Adminrouter.get("/signup", (req, res) => adminController.getAll(req, res));
Adminrouter.post("/signuppost", (req, res) => adminController.signupRequest(req, res));
Adminrouter.post('/verify-otp',(req,res)=>adminController.verifyOtp(req,res))
Adminrouter.post('/resend-otp',(req,res)=>adminController.resentOtp(req,res))

Adminrouter.get('/admins',(req,res)=>subAdminController.getAllSubAdmins(req,res))
Adminrouter.post('/admins',(req,res)=>subAdminController.createSubAdmin(req,res))
Adminrouter.put('/admins/:id', (req,res)=> subAdminController.updatesubAdmin(req,res))
Adminrouter.put('/admins/:id/block',(req,res)=>subAdminController.subadminblock(req,res))



export default Adminrouter;