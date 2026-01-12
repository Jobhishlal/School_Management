import { Request, Response } from "express";
import { IParentStudentList } from "../../../../domain/UseCaseInterface/FeeStructure/IParentStudentList";
import { StatusCodes } from "../../../../shared/constants/statusCodes";

export class ParentFinanceList {
  constructor(private repodata: IParentStudentList) { }

  async ParentList(req: Request, res: Response): Promise<void> {
    try {
      const { email, studentId } = req.body;

      if (!email || !studentId) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: "Missing email or studentId",
        });
        return;
      }

      const parentdata = await this.repodata.execute({ email, studentId });

      if (!parentdata) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: "Parent not found for given email/studentId",
        });
        return;
      }

      res.status(StatusCodes.OK).json({
        message: "Student and email matched",
        data: Array.isArray(parentdata) ? parentdata : [parentdata],
      });

    } catch (error) {
      console.error("ParentList error:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
        success: false,
      });
    }
  }
}
