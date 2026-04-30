import { RESPONSE_MESSAGES } from "../../../../shared/constants/responseMessages";
import { Request,Response } from "express";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { IAssignmentGetstudent } from "../../../../applications/interface/UseCaseInterface/Assignment/IGetAssignmentStudent";
import { IStudentSubmit } from "../../../../applications/interface/UseCaseInterface/Assignment/IStudentSubmit";
import { SubmitDTO } from "../../../../applications/dto/AssignmentDTO ";



export class AssignmentViewStudentsController {
    constructor(
    private readonly assignmentview:IAssignmentGetstudent,
    private readonly submitrepo:IStudentSubmit

    ){}

  async AssignmentStudentview(req: Request, res: Response): Promise<void> {
  try {
    console.log("reached get student assignmnet")
    const { studentId } = req.query as { studentId: string };
    console.log("studentId",studentId)

    if (!studentId) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: RESPONSE_MESSAGES.STUDENTID_IS_REQUIRED,
      });
      return;
    }

    const assignment = await this.assignmentview.execute(studentId);
    console.log("assignment ",assignment)

    if (!assignment || assignment.length === 0) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: RESPONSE_MESSAGES.NO_ASSIGNMENTS_FOUND_FOR_THIS_STUDENT,
      });
      return;
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: RESPONSE_MESSAGES.ASSIGNMENTS_FETCHED_SUCCESSFULLY,
      data: assignment,
    });
  } catch (error: unknown) {
    console.error("Error fetching assignments:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: (error as Error).message || "Internal server error",
    });
  }
}


async SubmitData(req: Request, res: Response): Promise<void> {
  try {
    console.log("Reached assignment submission");
    
    const { studentId, assignmentId, studentDescription } = req.body;
    console.log("Request body:", req.body);

    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res.status(400).json({ success: false, message: RESPONSE_MESSAGES.AT_LEAST_ONE_FILE_IS_REQUIRED });
      return;
    }

   
    const attachments = files.map(file => ({
      url: file.path,       
      fileName: file.originalname,
      uploadedAt: new Date(),
    }));
    console.log("data attachments",attachments)

    const data: SubmitDTO[] = attachments.map(file => ({
      assignmentId,
      studentId,
      fileUrl: file.url,
      fileName: file.fileName,
      studentDescription,
    }));

     console.log("data",data)
    const results = [];
    for (const d of data) {
      const updatedAssignment = await this.submitrepo.execute(d);
      results.push(updatedAssignment);
    }

    res.status(200).json({
      success: true,
      message: RESPONSE_MESSAGES.ASSIGNMENT_SUBMITTED_SUCCESSFULLY,
      data: results,
    });

  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}


}