import { RESPONSE_MESSAGES } from "../../../../shared/constants/responseMessages";
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
          message: RESPONSE_MESSAGES.ASSIGNMENT_CREATION_FAILED
        });
        return;
      }

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: RESPONSE_MESSAGES.ASSIGNMENT_CREATED_SUCCESSFULLY,
        data
      });
    } catch (err: unknown) {
      console.error((err as Error).message);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message || "Failed to create parent"
      });
    }
  }

  async GetTeachertimetabledata(req: Request, res: Response): Promise<void> {
    try {
      const teacherId = (req as AuthRequest)?.user?.id!;
      console.log("teacherId", teacherId)
      const info = await this.getteacher.execute(teacherId)
      if (!teacherId) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.TEACHERID_IS_MISSING })
      }
      res.status(StatusCodes.OK).json({
        success: true,
        message: RESPONSE_MESSAGES.TEACHERLIST_FETCH_CURRECTLY,
        data: info
      })

    } catch (error: unknown) {
      console.log(error)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message || "Something went wrong"
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
        res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: RESPONSE_MESSAGES.UPDATE_DATA_MISSING });
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
        res.status(StatusCodes.NOT_FOUND).json({ success: false, message: RESPONSE_MESSAGES.ASSIGNMENT_NOT_FOUND });
        return;
      }
      res.status(StatusCodes.OK).json({ success: true, message: RESPONSE_MESSAGES.UPDATED_SUCCESSFULLY, data });
    } catch (error: unknown) {
      console.log("Error", error)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message || "Something went wrong"
      });
    }
  }

  async GetAllAssignemntExistedTeacher(req: Request, res: Response): Promise<void> {
    try {
      const teacherId = (req as AuthRequest)?.user?.id!;
      if (!teacherId) {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: RESPONSE_MESSAGES.TEACHER_ID_NOT_FOUND_IN_REQUEST,

        });
        return
      }
      const data = await this.getallteacherassignment.execute(teacherId);
      if (!data || data.length === 0) {
        res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: RESPONSE_MESSAGES.NO_ASSIGNMENTS_FOUND_FOR_THIS_TEACHER,
        });
      }

      res.status(StatusCodes.OK).json({
        success: true,
        message: RESPONSE_MESSAGES.ASSIGNMENTS_FETCHED_SUCCESSFULLY,
        data,
      });
    } catch (error: unknown) {
      console.error("Error fetching teacher assignments:", error);

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message || "Something went wrong",
      });
    }
  }


  async validateAssignment(req: Request, res: Response): Promise<void> {
    try {
      const data: ValidationDTO = req.body;
      const result = await this.validateAssignmentUseCase.execute(data);

      if (!result) {
        res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: RESPONSE_MESSAGES.VALIDATION_FAILED });
        return;
      }
      res.status(StatusCodes.OK).json({ success: true, message: RESPONSE_MESSAGES.ASSIGNMENT_VALIDATED, data: result });
    } catch (error: unknown) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: (error as Error).message });
    }
  }

  async getAssignmentSubmissions(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.getSubmissionsUseCase.execute(id);
      res.status(StatusCodes.OK).json({ success: true, message: RESPONSE_MESSAGES.SUBMISSIONS_FETCHED, data: result });
    } catch (error: unknown) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: (error as Error).message });
    }
  }

}