import { Router } from "express";
import { Googlauthcontroller } from "../http/controllers/ADMIN/GoogleController";
import passport from "../../infrastructure/security/googleStrategy";
import { GoogleAuthMsg } from "../../domain/enums/GoogleAuth";

const GoogleAuthdata = new Googlauthcontroller()

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


export default AuthRouter;

