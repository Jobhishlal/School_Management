import { Request,Response } from "express";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { IAssignmentGetstudent } from "../../../../domain/UseCaseInterface/Assignment/IGetAssignmentStudent";
import { IStudentSubmit } from "../../../../domain/UseCaseInterface/Assignment/IStudentSubmit";
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


async SubmitData(req: Request, res: Response): Promise<void> {
  try {
    console.log("Reached assignment submission");
    
    const { studentId, assignmentId, studentDescription } = req.body;
    console.log("Request body:", req.body);

    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res.status(400).json({ success: false, message: "At least one file is required" });
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
      message: "Assignment submitted successfully",
      data: results,
    });

  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
}


}