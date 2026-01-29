import { Request, Response } from "express";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { AdminError } from "../../../../domain/enums/Adminsinguperror";
import { GoogleAuthMsg } from "../../../../domain/enums/GoogleAuth";
import { IGoogleController } from "../../interface/IGoogleController";

export class Googlauthcontroller implements IGoogleController {
  async callback(req: Request, res: Response): Promise<void> {
    try {
      const { user, accessToken, refreshToken, error } = req.user as {
        user: any;
        accessToken: string;
        refreshToken: string;
        error: string;
      };

      if (error) {
        res.send(`
          <script>
            window.opener.postMessage(
              ${JSON.stringify({ error })},
              "${process.env.CLIENT_URL || "http://localhost:5173"}"
            );
            window.close();
          </script>
        `);
        return;
      }

      if (!user || !accessToken || !refreshToken) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: GoogleAuthMsg.Token_NOT_GENARATE,
        });
        return;
      }

      res.send(`
        <script>
          window.opener.postMessage(
            ${JSON.stringify({ user, accessToken, refreshToken })},
            "${process.env.CLIENT_URL || "http://localhost:5173"}"
          );
          window.close();
        </script>
      `);
      return;
    } catch (err: any) {
      if (err.message === AdminError.Useralreadyexisted) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: AdminError.Useralreadyexisted,
        });
        return;
      }

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: GoogleAuthMsg.GOOGLE_FAILED,
      });
      return;
    }
  }
}


