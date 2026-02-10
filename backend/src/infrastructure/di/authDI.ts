import { Googlauthcontroller } from "../../presentation/http/controllers/ADMIN/GoogleController";
import { MongoParentSignUp } from "../repositories/MongoSignupParents";
import { SignupParentUseCase } from "../../applications/useCases/Auth/ParentSignupUseCase";
import { SignupParentController } from "../../presentation/http/controllers/Auth/SignupParentsController";
import { VerifyParentPasswordOtpUseCase } from "../../applications/useCases/Parent/VerifyParentOtpUseCase";
import { RequestParentPasswordOtpUseCase } from "../../applications/useCases/Parent/ForgotPasswordUseCase";
import { ResetParentPasswordUseCase } from "../../applications/useCases/Parent/ResetPasswordUseCasse";
import { ForgotPasswordController } from "../../presentation/http/controllers/ParentController.ts/ForgotpasswordParentController";
import { AdminLoginController } from "../../presentation/http/controllers/ADMIN/MainAdminController";
import { MongoStudentRepo } from "../repositories/MongoStudentRepo";
import { MongoTeacher } from "../repositories/MongoTeacherRepo";
import { AdminSubAdminCompaign } from "../repositories/AdminAndSubAdminLogin";
import { ParentAuthRepository } from "../repositories/ParentAuthRepository";
import { JwtTokenService } from "../services/JwtTokenService";
import { BcryptPasswordService } from "../services/BcryptPasswordService";
import { NodemailerEmailService } from "../services/NodemailerEmailService";
import { UnifiedLoginUseCase } from "../../applications/useCases/Auth/UnifiedLoginUseCase";
import { VerifyOtpUseCase } from "../../applications/useCases/Auth/VerifyOtpUseCase";
import { RefreshTokenUseCase } from "../../applications/useCases/Auth/RefreshTokenUseCase";
import { ResendOtpUseCase } from "../../applications/useCases/Auth/ResendOtpUseCase";

// Repositories
const mongoParentSignUpRepo = new MongoParentSignUp();
const studentRepo = new MongoStudentRepo();
const teacherRepo = new MongoTeacher();
const subAdminRepo = new AdminSubAdminCompaign();
const parentAuthRepo = new ParentAuthRepository();

// Services
const tokenService = new JwtTokenService();
const passwordService = new BcryptPasswordService();
const emailService = new NodemailerEmailService();

// Use Cases - Parent Signup & Password Reset
const signupParentUseCase = new SignupParentUseCase(mongoParentSignUpRepo);
const requestParentPassUseCase = new RequestParentPasswordOtpUseCase(mongoParentSignUpRepo);
const verifyOtpForgotParentUseCase = new VerifyParentPasswordOtpUseCase();
const resetParentPasswordUseCase = new ResetParentPasswordUseCase(mongoParentSignUpRepo);

// Use Cases - Unified Login
const loginUseCase = new UnifiedLoginUseCase(
    studentRepo,
    teacherRepo,
    subAdminRepo,
    parentAuthRepo,
    tokenService,
    passwordService,
    emailService
);
const verifyOtpUseCase = new VerifyOtpUseCase(tokenService);
const refreshTokenUseCase = new RefreshTokenUseCase(tokenService);
const resendOtpUseCase = new ResendOtpUseCase(tokenService, emailService);

// Controllers
export const googleAuthController = new Googlauthcontroller();
export const signupParentController = new SignupParentController(signupParentUseCase);
export const forgotPasswordController = new ForgotPasswordController(
    resetParentPasswordUseCase,
    requestParentPassUseCase,
    verifyOtpForgotParentUseCase
);
export const authController = new AdminLoginController(
    loginUseCase,
    verifyOtpUseCase,
    refreshTokenUseCase,
    resendOtpUseCase
);
