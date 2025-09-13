import { Router } from "express";
import { LoginSuperAdmin } from "../../applications/useCases/LoginSuperAdmin";
import {SuperAdminAuthService} from '../../infrastructure/providers/SuperAdminAuthService';
import {SuperAdminController} from '../http/controllers/ADMIN/MainAdminController'
import { ResendOtp } from "../../applications/useCases/ResenOtp";
const MainAdmin = Router();



const authService = new SuperAdminAuthService();
const loginUseCase = new LoginSuperAdmin(authService);
const resendOtpUseCase= new ResendOtp()
const constroller = new SuperAdminController(loginUseCase,authService,resendOtpUseCase);

MainAdmin.post('/login',(req,res)=>  constroller.login(req,res))
MainAdmin.post('/verify-otp',(req,res)=> constroller.verifyOtp(req,res))
MainAdmin.post('/resend-otp',(req,res)=>constroller.resendOtp(req,res))


export default MainAdmin