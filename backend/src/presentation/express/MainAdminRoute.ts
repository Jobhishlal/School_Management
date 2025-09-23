import { Router } from "express";
import { UnifiedAdminAuthService } from "../../infrastructure/providers/SuperAdminAuthService";
import { AdminLoginController } from "../../presentation/http/controllers/ADMIN/MainAdminController"; 

const MainAdmin = Router();

const authService = new UnifiedAdminAuthService();
const controller = new AdminLoginController(authService);
//(req, res) => {controller.login(req, res)}
MainAdmin.post("/login", controller.login.bind(controller));
MainAdmin.post("/verify-otp", (req, res) => controller.verifyOtp(req, res));
MainAdmin.post("/resend-otp", (req, res) => controller.resendOtp(req, res));

export default MainAdmin;
