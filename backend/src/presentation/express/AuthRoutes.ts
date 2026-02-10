import { Router } from "express";
import passport from "../../infrastructure/security/googleStrategy";
import {
  authController,
  forgotPasswordController,
  signupParentController
} from "../../infrastructure/di/authDI";

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




AuthRouter.post('/signup', (req, res) => signupParentController.signUp(req, res))

AuthRouter.post('/forgot-password', (req, res) => forgotPasswordController.ReqestPasswordchange(req, res))
AuthRouter.post('/verify-otp', (req, res) => forgotPasswordController.verifyOtp(req, res))

AuthRouter.put('/reset-password', (req, res) => forgotPasswordController.ResetPassword(req, res))

AuthRouter.post('/refresh', (req, res) => authController.refreshToken(req, res));


export default AuthRouter;

