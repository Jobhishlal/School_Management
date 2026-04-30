import { RESPONSE_MESSAGES } from "../../../../shared/constants/responseMessages";
import { Request, Response } from "express";
import { StudentAddUseCase } from "../../../../applications/useCases/Students/CreateStudents";
import { MongoStudentRepo } from "../../../../infrastructure/repositories/MongoStudentRepo";
import { Students } from "../../../../domain/entities/Students";

import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { IGetStudentSInterface } from "../../../../applications/interface/UseCaseInterface/IStudentGetUseCase";
import { IStudentBlock } from '../../../../applications/interface/UseCaseInterface/IStudentBlock'
import logger from "../../../../shared/constants/Logger";
import { IStudentUpdateUseCase } from "../../../../applications/interface/UseCaseInterface/IStudentupdate";
import { IGetStudentsByClassUseCase } from "../../../../applications/interface/UseCaseInterface/StudentCreate/IStudentFindClassBase";
import { AuthRequest } from "../../../../infrastructure/types/AuthRequest";
import { validateStudentCreate, validateStudentUpdate } from '../../../validators/StudentValidation/StudentValidators';

export class StudentCreateController {
  constructor(
    private studentRepo: MongoStudentRepo,
    private addStudent: StudentAddUseCase,
    private getStudent: IGetStudentSInterface,
    private studentblock: IStudentBlock,
    private studentupdate: IStudentUpdateUseCase,
    private studentclassrepofind: IGetStudentsByClassUseCase
  ) { }

  async create(req: Request, res: Response): Promise<void> {
    try {
      console.log("req.body:", req.body);
      console.log("req.files:", req.files);

      const { fullName, dateOfBirth, gender, parentId, addressId, classId, blocked } = req.body;

      validateStudentCreate(req.body);

      const photos =
        (req.files as Express.Multer.File[])?.map(file => ({
          url: (file as ReturnType<typeof JSON.parse>).path,
          filename: file.filename,
          uploadedAt: new Date(),
        })) || [];

      const { student: created, tempPassword } = await this.addStudent.execute({
        fullName,
        dateOfBirth,
        gender,
        parentId,
        addressId,
        classId,
        photos,
        blocked: blocked || false
      });

      res.status(StatusCodes.CREATED).json({
        message: RESPONSE_MESSAGES.STUDENT_CREATED_SUCCESSFULLY,
        student: created,
        tempPassword,
      });

    } catch (error: unknown) {
      console.error("Error creating student:", error);


      const statusCode = (error as Error).message?.includes("required") ||
        (error as Error).message?.includes("Invalid") ?
        StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR;

      res.status(statusCode).json({
        message: (error as Error).message || "Failed to create student",
      });
    }
  }


  async getAllStudents(req: Request, res: Response): Promise<void> {
    try {
      const student = await this.getStudent.execute()

      res.status(StatusCodes.OK).json(student)

    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: RESPONSE_MESSAGES.ITS_SERVER_ERROR })
    }
  }
  async blockStudent(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { blocked } = req.body;

      if (!id) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.STUDENT_ID_IS_REQUIRED_1 });
        return;
      }

      const updatedStudent = await this.studentblock.execute(id, blocked);

      res.status(StatusCodes.OK).json({
        message: blocked ? "Student blocked successfully" : "Student unblocked successfully",
        data: updatedStudent
      });
    } catch (error: unknown) {
      console.error("Error in blockStudent:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: (error as Error).message || "Server Error" });
    }
  }
  async updateStudent(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = { ...req.body };


      if (req.files && Array.isArray(req.files) && req.files.length > 0) {

        const newPhotos = req.files.map((file: Express.Multer.File) => ({
          url: file.path,
          filename: file.filename,
          uploadedAt: new Date(),
        }));


        updates.photos = newPhotos;
      }


      if (updates.dateOfBirth && typeof updates.dateOfBirth === 'string') {
        updates.dateOfBirth = new Date(updates.dateOfBirth);
      }

      validateStudentUpdate(updates);

      const updatedStudent = await this.studentupdate.execute({ id, ...updates });

      if (!updatedStudent) {
        res.status(StatusCodes.NOT_FOUND).json({ message: RESPONSE_MESSAGES.STUDENT_NOT_FOUND });
        return;
      }

      res.status(StatusCodes.OK).json({
        message: RESPONSE_MESSAGES.STUDENT_UPDATED_SUCCESSFULLY,
        data: updatedStudent
      });

    } catch (error: unknown) {
      logger.info(error);
      const statusCode = (error as Error).message?.includes("required") ||
        (error as Error).message?.includes("Invalid") ?
        StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR;

      res.status(statusCode).json({
        message: (error as Error).message || "Failed to update student",
      });
    }
  }

  async FindStudntSClassBase(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { classId } = req.params
      const teacherId = req.user?.id

      const student = await this.studentclassrepofind.execute(classId, teacherId)
      if (!student) {
        res.status(StatusCodes.BAD_REQUEST)
          .json({ message: RESPONSE_MESSAGES.DOES_NOT_FETCH_STUDENT_IN_CLASSBASE })
      }
      res.status(StatusCodes.OK)
        .json({ message: RESPONSE_MESSAGES.DATA_FETCHING_SUCCESSFULLY, success: true, student })
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR_1, error })

    }
  }

}
