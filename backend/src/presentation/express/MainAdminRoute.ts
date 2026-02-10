import { Router } from "express";
import { authController } from "../../infrastructure/di/authDI";

const MainAdmin = Router();
//(req, res) => {controller.login(req, res)}
MainAdmin.post("/login", authController.login.bind(authController));
MainAdmin.post("/verify-otp", (req, res) => authController.verifyOtp(req, res));
MainAdmin.post("/resend-otp", (req, res) => authController.resendOtp(req, res));

export default MainAdmin; 
