import { RESPONSE_MESSAGES } from "../../../../shared/constants/responseMessages";
import { Request, Response } from "express";
import { IParentStudentList } from "../../../../applications/interface/UseCaseInterface/FeeStructure/IParentStudentList";
import { StatusCodes } from "../../../../shared/constants/statusCodes";

export class ParentFinanceList {
  constructor(private repodata: IParentStudentList) { }

  async ParentList(req: Request, res: Response): Promise<void> {
    try {
      const { email, studentId } = req.body;

      if (!email || !studentId) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: RESPONSE_MESSAGES.MISSING_EMAIL_OR_STUDENTID,
        });
        return;
      }

      const parentdata = await this.repodata.execute({ email, studentId });

      if (!parentdata) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: RESPONSE_MESSAGES.PARENT_NOT_FOUND_FOR_GIVEN_EMAIL_STUDENTID,
        });
        return;
      }

      res.status(StatusCodes.OK).json({
        message: RESPONSE_MESSAGES.STUDENT_AND_EMAIL_MATCHED,
        data: Array.isArray(parentdata) ? parentdata : [parentdata],
      });

    } catch (error) {
      console.error("ParentList error:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR,
        success: false,
      });
    }
  }
}
