import { Router } from "express";
import { Googlauthcontroller } from "../http/controllers/ADMIN/GoogleController";
import passport from "../../infrastructure/security/googleStrategy";
import { GoogleAuthMsg } from "../../domain/enums/GoogleAuth";
import { MongoParentSignUp } from "../../infrastructure/repositories/MongoSignupParents";
import { SignupParentUseCase } from "../../applications/useCases/Auth/ParentSignupUseCase";
import { SignupParentController } from "../http/controllers/Auth/SignupParentsController";
import {VerifyParentPasswordOtpUseCase} from '../../applications/useCases/Parent/VerifyParentOtpUseCase'
import { RequestParentPasswordOtpUseCase } from "../../applications/useCases/Parent/ForgotPasswordUseCase";
import { ResetParentPasswordUseCase } from "../../applications/useCases/Parent/ResetPasswordUseCasse";
import {ForgotPasswordController} from '../http/controllers/ParentController.ts/ForgotpasswordParentController'


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


const AuthRouter= Router();
AuthRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }))

AuthRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  (req, res) => {
    const { user, accessToken, refreshToken, error } = req.user as any;

    if (error) {
      return res.send(`
        <script>
          window.opener.postMessage(
            ${JSON.stringify({ error })},
            "http://localhost:5173"
          );
          window.close();
        </script>
      `);
    }

    if (!accessToken || !refreshToken || !user) {
      return res.status(500).json({ message: GoogleAuthMsg.Token_NOT_GENARATE });
    }

    return res.send(`
      <script>
        window.opener.postMessage(
          ${JSON.stringify({ user, accessToken, refreshToken })},
          "http://localhost:5173"
        );
        window.close();
      </script>
    `);
  }
);



AuthRouter.post('/signup',(req,res)=>Signupparentcontroller.signUp(req,res))

AuthRouter.post('/forgot-password',(req,res)=>forgotPasswordController.ReqestPasswordchange(req,res))
AuthRouter.post('/verify-otp',(req,res)=>forgotPasswordController.verifyOtp(req,res))

AuthRouter.put('/reset-password',(req,res)=>forgotPasswordController.ResetPassword(req,res))


export default AuthRouter;

