import { Router } from "express";
import { Googlauthcontroller } from "../http/controllers/ADMIN/GoogleController";
import passport from "../../infrastructure/security/googleStrategy";
import { GoogleAuthMsg } from "../../domain/enums/GoogleAuth";
import { MongoParentSignUp } from "../../infrastructure/repositories/MongoSignupParents";
import { SignupParentUseCase } from "../../applications/useCases/Auth/ParentSignupUseCase";
import { SignupParentController } from "../http/controllers/Auth/SignupParentsController";
import { VerifyParentPasswordOtpUseCase } from '../../applications/useCases/Parent/VerifyParentOtpUseCase'
import { RequestParentPasswordOtpUseCase } from "../../applications/useCases/Parent/ForgotPasswordUseCase";
import { ResetParentPasswordUseCase } from "../../applications/useCases/Parent/ResetPasswordUseCasse";
import { ForgotPasswordController } from '../http/controllers/ParentController.ts/ForgotpasswordParentController'
import { AdminLoginController } from "../http/controllers/ADMIN/MainAdminController";
// import { UnifiedAdminAuthService } from "../../infrastructure/providers/SuperAdminAuthService"; // Deprecated

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


const GoogleAuthdata = new Googlauthcontroller()

const repo = new MongoParentSignUp()
const signUpusecase = new SignupParentUseCase(repo)
const Signupparentcontroller = new SignupParentController(signUpusecase)


const requestParentPass = new RequestParentPasswordOtpUseCase(repo);
const verifyOtpForgotParent = new VerifyParentPasswordOtpUseCase();
const resetPassword = new ResetParentPasswordUseCase(repo);

const forgotPasswordController = new ForgotPasswordController(
  resetPassword,
  requestParentPass,
  verifyOtpForgotParent
);

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

const authController = new AdminLoginController(
  loginUseCase,
  verifyOtpUseCase,
  refreshTokenUseCase,
  resendOtpUseCase
);


const AuthRouter = Router();
AuthRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }))

AuthRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  (req, res) => {
    const { user, accessToken, refreshToken, error } = req.user as any;

    const CLIENT_URL = process.env.CLIENT_URL;

    if (error) {
      return res.send(`
        <script>
          window.opener.postMessage(
            ${JSON.stringify({ error })},
            "${CLIENT_URL}"
          );
          window.close();
        </script>
      `);
    }

    if (!accessToken || !refreshToken || !user) {
      return res.status(500).json({ message: "Google token generation failed" });
    }

    return res.send(`
      <script>
        window.opener.postMessage(
          ${JSON.stringify({ user, accessToken, refreshToken })},
          "${CLIENT_URL}"
        );
        window.close();
      </script>
    `);
  }
);




AuthRouter.post('/signup', (req, res) => Signupparentcontroller.signUp(req, res))

AuthRouter.post('/forgot-password', (req, res) => forgotPasswordController.ReqestPasswordchange(req, res))
AuthRouter.post('/verify-otp', (req, res) => forgotPasswordController.verifyOtp(req, res))

AuthRouter.put('/reset-password', (req, res) => forgotPasswordController.ResetPassword(req, res))

AuthRouter.post('/refresh', (req, res) => authController.refreshToken(req, res));


export default AuthRouter;

