import { Request,Response } from "express";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { IAssignmentGetstudent } from "../../../../domain/UseCaseInterface/Assignment/IGetAssignmentStudent";



export class AssignmentViewStudentsController {
    constructor(
    private readonly assignmentview:IAssignmentGetstudent

    ){}

  async AssignmentStudentview(req: Request, res: Response): Promise<void> {
  try {
    console.log("reached get student assignmnet")
    const { studentId } = req.query as { studentId: string };
    console.log("studentId",studentId)

    if (!studentId) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "studentId is required",
      });
      return;
    }

    const assignment = await this.assignmentview.execute(studentId);
    console.log("assignment ",assignment)

    if (!assignment || assignment.length === 0) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "No assignments found for this student",
      });
      return;
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Assignments fetched successfully",
      data: assignment,
    });
  } catch (error: any) {
    console.error("Error fetching assignments:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
}

}