import { Request, Response } from "express";
import { ICreateAssignment } from "../../../../applications/interface/UseCaseInterface/Assignment/ICreateUseCase";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { CreateAssignmentDTO } from "../../../../applications/dto/AssignmentDTO ";
import { AuthRequest } from "../../../../infrastructure/types/AuthRequest";
import { IGetAssignmentTeacher } from "../../../../applications/interface/UseCaseInterface/Assignment/IgetTimeTableTeacher";
import { IAssignmentupdate } from "../../../../applications/interface/UseCaseInterface/Assignment/IUpdateUseCase";
import { IGetTeacherAssignment } from "../../../../applications/interface/UseCaseInterface/Assignment/IGetAssigmentTeacher";

import { IValidateAssignment } from "../../../../applications/interface/UseCaseInterface/Assignment/IValidateAssignment";
import { IGetAssignmentSubmissions } from "../../../../applications/interface/UseCaseInterface/Assignment/IGetAssignmentSubmissions";
import { ValidationDTO } from "../../../../applications/dto/AssignmentDTO ";
import { validateAssignmentCreate, validateAssignmentUpdate } from '../../../validators/AssignmentValidation/AssignmentValidators';

export class AssignmentManageController {
  constructor(
    private readonly createrepo: ICreateAssignment,
    private readonly getteacher: IGetAssignmentTeacher,
    private readonly updateassignment: IAssignmentupdate,
    private readonly getallteacherassignment: IGetTeacherAssignment,
    private readonly validateAssignmentUseCase: IValidateAssignment,
    private readonly getSubmissionsUseCase: IGetAssignmentSubmissions
  ) { }

  async CreateTimeTable(req: Request, res: Response): Promise<void> {
    try {
      console.log("create get")
      const dto: CreateAssignmentDTO = req.body;
      dto.teacherId = (req as AuthRequest)?.user?.id!;
      console.log("dto ", dto)

      if (req.files && Array.isArray(req.files)) {
        dto.attachments = (req.files as Express.Multer.File[]).map(file => ({
          url: file.path,
          fileName: file.originalname,
          uploadedAt: new Date()
        }));
      }

      validateAssignmentCreate(dto);

      const data = await this.createrepo.execute(dto);

      if (!data) {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Assignment creation failed"
        });
        return;
      }

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: "Assignment created successfully",
        data
      });
    } catch (err: any) {
      console.error(err.message);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: err.message || "Failed to create parent"
      });
    }
  }

  async GetTeachertimetabledata(req: Request, res: Response): Promise<void> {
    try {
      const teacherId = (req as AuthRequest)?.user?.id!;
      console.log("teacherId", teacherId)
      const info = await this.getteacher.execute(teacherId)
      if (!teacherId) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "TeacherId is Missing" })
      }
      res.status(StatusCodes.OK).json({
        success: true,
        message: "teacherlist fetch currectly",
        data: info
      })

    } catch (error: any) {
      console.log(error)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Something went wrong"
      });
    }

  }

  async Updateassignment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      console.log("id get it ", id)
      const update: CreateAssignmentDTO = req.body;

      console.log("rached", update)

      if (!update) {
        res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Update data missing" });
        return;
      }

      if (req.files && Array.isArray(req.files)) {
        update.attachments = (req.files as Express.Multer.File[]).map(file => ({
          url: file.path,
          fileName: file.originalname,
          uploadedAt: new Date(),
        }));
      }

      validateAssignmentUpdate(update);

      const data = await this.updateassignment.execute(id, update);

      if (!data) {
        res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Assignment not found" });
        return;
      }
      res.status(StatusCodes.OK).json({ success: true, message: "Updated successfully", data });
    } catch (error: any) {
      console.log("Error", error)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Something went wrong"
      });
    }
  }

  async GetAllAssignemntExistedTeacher(req: Request, res: Response): Promise<void> {
    try {
      const teacherId = (req as AuthRequest)?.user?.id!;
      if (!teacherId) {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Teacher ID not found in request",

        });
        return
      }
      const data = await this.getallteacherassignment.execute(teacherId);
      if (!data || data.length === 0) {
        res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "No assignments found for this teacher",
        });
      }

      res.status(StatusCodes.OK).json({
        success: true,
        message: "Assignments fetched successfully",
        data,
      });
    } catch (error: any) {
      console.error("Error fetching teacher assignments:", error);

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Something went wrong",
      });
    }
  }


  async validateAssignment(req: Request, res: Response): Promise<void> {
    try {
      const data: ValidationDTO = req.body;
      const result = await this.validateAssignmentUseCase.execute(data);

      if (!result) {
        res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Validation failed" });
        return;
      }
      res.status(StatusCodes.OK).json({ success: true, message: "Assignment validated", data: result });
    } catch (error: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
  }

  async getAssignmentSubmissions(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.getSubmissionsUseCase.execute(id);
      res.status(StatusCodes.OK).json({ success: true, message: "Submissions fetched", data: result });
    } catch (error: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
  }

}