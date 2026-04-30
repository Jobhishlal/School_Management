import { TeacherCreateUseCase } from "../../../../applications/useCases/Teacher/CreateTeacher";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import logger from "../../../../shared/constants/Logger";
import { ITeacherCreatecontroller } from "../../interface/ITeachercontroller";
import { Request, Response } from "express";
import { IUpdateTeacherUseCase } from "../../../../applications/interface/UseCaseInterface/Teacher/IUpdateTeacherUseCase";
import { IBlockTeacherUseCase } from "../../../../applications/interface/UseCaseInterface/Teacher/IBlockTeacherUseCase";




export class TeacherCreateController implements ITeacherCreatecontroller {
  constructor(
    private createteacherUseCase: TeacherCreateUseCase,
    private updateTeacherUseCase: IUpdateTeacherUseCase,
    private blockTeacherUseCase: IBlockTeacherUseCase) { }

  async createteacher(req: Request, res: Response): Promise<void> {
    try {
      const {
        name,
        email,
        phone,
        role,
        blocked,
        gender,
        Password,
        department,
      } = req.body;


      let subjectsArray: { name: string; code: string }[] = [];
      if (req.body.subjects) {
        if (typeof req.body.subjects === "string") {
          try {
            subjectsArray = JSON.parse(req.body.subjects);
          } catch {
            subjectsArray = [];
          }
        } else if (Array.isArray(req.body.subjects)) {
          subjectsArray = req.body.subjects;
        }
      }


      const files = req.files as Express.Multer.File[];
      const documents = (files ?? []).map((file) => ({
        url: (file as ReturnType<typeof JSON.parse>).path,
        filename: file.originalname,
        uploadedAt: new Date(),
      }));


      const result = await this.createteacherUseCase.execute({
        name,
        email,
        phone,
        role,
        blocked,
        gender,
        Password,
        documents,
        subjects: subjectsArray,
        department,
      });

      res.status(StatusCodes.OK).json({
        message: "Successfully created teacher. Password sent to email.",
        teachers: result,
      });
    } catch (error: unknown) {
      logger.info(error);

      if (
        (error as Error).message === "email already exists" ||
        (error as Error).message === "enter valid phone number"
      ) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: (error as Error).message });
      } else {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: (error as Error).message || "Internal Server Error" });
      }
    }
  }

  async getAllTeacher(req: Request, res: Response): Promise<void> {
    try {
      const teacher = await this.createteacherUseCase.getall()
      res.status(StatusCodes.OK).json({ success: true, data: teacher })
    } catch (error: unknown) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message })
    }
  }
  async updateTeacher(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, phone, gender, subjects, department } = req.body;
      const { id } = req.params;

      let parsedsubject: { name: string; code: string }[] = []
      if (subjects) {
        if (typeof subjects === "string") {
          try {
            parsedsubject = JSON.parse(subjects)
            if (!Array.isArray(parsedsubject)) parsedsubject = [];
          } catch (error) {
            parsedsubject = [];
          }
        } else if (Array.isArray(subjects)) {
          parsedsubject = subjects
        }
      }

      const files = req.files as Express.Multer.File[];
      const documents = (files ?? []).map(file => ({
        url: (file as ReturnType<typeof JSON.parse>).path,
        filename: file.originalname,
        uploadedAt: new Date(),
      }));

      const updateData: ReturnType<typeof JSON.parse> = { name, email, phone, gender, department };
      if (parsedsubject.length > 0) updateData.subjects = parsedsubject;
      if (documents.length > 0) updateData.documents = documents;

      const updatedTeacher = await this.updateTeacherUseCase.execute(id, updateData);

      res.status(StatusCodes.OK).json({
        message: "Successfully updated teacher",
        teacher: updatedTeacher,
      });




    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
    }

  }

  async blockTeacher(req: Request, res: Response): Promise<void> {
    try {
      const { blocked } = req.body;
      const { id } = req.params;
      const result = await this.blockTeacherUseCase.execute(id, blocked)
      res.status(StatusCodes.OK).json({
        message: blocked ? "Teacher Blocked Successfully" : "Teacher UnBlocked Successfully",
        teacher: result
      })
    } catch (error: unknown) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" })
    }
  }
}