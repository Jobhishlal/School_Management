import { Router } from "express";
import { AdminLoginController } from "../../presentation/http/controllers/ADMIN/MainAdminController";

import { MongoStudentRepo } from "../../infrastructure/repositories/MongoStudentRepo";
import { MongoTeacher } from "../../infrastructure/repositories/MongoTeacherRepo";
import { AdminSubAdminCompaign } from "../../infrastructure/repositories/AdminAndSubAdminLogin";
import { ParentAuthRepository } from "../../infrastructure/repositories/ParentAuthRepository";

import { JwtTokenService } from "../../infrastructure/services/JwtTokenService";
import { BcryptPasswordService } from "../../infrastructure/services/BcryptPasswordService";
import { NodemailerEmailService } from "../../infrastructure/services/NodemailerEmailService";

import { UnifiedLoginUseCase } from "../../applications/useCases/Auth/UnifiedLoginUseCase";
import { VerifyOtpUseCase } from "../../applications/useCases/Auth/VerifyOtpUseCase";
import { RefreshTokenUseCase } from "../../applications/useCases/Auth/RefreshTokenUseCase";
import { ResendOtpUseCase } from "../../applications/useCases/Auth/ResendOtpUseCase";

const MainAdmin = Router();

const studentRepo = new MongoStudentRepo();
const teacherRepo = new MongoTeacher();
const subAdminRepo = new AdminSubAdminCompaign();
const parentRepo = new ParentAuthRepository();

const tokenService = new JwtTokenService();
const passwordService = new BcryptPasswordService();
const emailService = new NodemailerEmailService();

const loginUseCase = new UnifiedLoginUseCase(
    studentRepo,
    teacherRepo,
    subAdminRepo,
    parentRepo,
    tokenService,
    passwordService,
    emailService
);

const verifyOtpUseCase = new VerifyOtpUseCase(tokenService);
const refreshTokenUseCase = new RefreshTokenUseCase(tokenService);
const resendOtpUseCase = new ResendOtpUseCase(tokenService, emailService);

const controller = new AdminLoginController(
    loginUseCase,
    verifyOtpUseCase,
    refreshTokenUseCase,
    resendOtpUseCase
);
//(req, res) => {controller.login(req, res)}
MainAdmin.post("/login", controller.login.bind(controller));
MainAdmin.post("/verify-otp", (req, res) => controller.verifyOtp(req, res));
MainAdmin.post("/resend-otp", (req, res) => controller.resendOtp(req, res));

export default MainAdmin; 
