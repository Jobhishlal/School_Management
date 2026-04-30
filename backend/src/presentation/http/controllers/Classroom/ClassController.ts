import { RESPONSE_MESSAGES } from "../../../../shared/constants/responseMessages";
import { Request, Response } from "express";
import { CreateClassUseCase } from "../../../../applications/useCases/Classdata/CreateClass";
import { GetAllClass } from "../../../../applications/useCases/Classdata/GeallClass";
import { Class } from "../../../../domain/entities/Class";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { IClassUpdateUseCase } from "../../../../applications/interface/UseCaseInterface/IClassUpdateUseCase";
import { IAssignClassUseCase } from "../../../../applications/interface/UseCaseInterface/AssignClassUseCase";

import { IDeleteClassUseCase } from "../../../../applications/interface/UseCaseInterface/ClassBase/IDeleteClassorDivisionUseCase";
import { validateClassCreate, validateClassUpdate } from '../../../validators/ClassValidation/ClassValidators';

export class ClassManagementController {
  constructor(
    private readonly classAddUseCase: CreateClassUseCase,
    private readonly getAllClass: GetAllClass,
    private readonly classupdate: IClassUpdateUseCase,
    private readonly iassignclass: IAssignClassUseCase,
    private readonly deleteClassUseCase: IDeleteClassUseCase
  ) { }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { className, division, department, rollNumber, subjects } = req.body;

      validateClassCreate(req.body);

      console.log("req.body in class create:", req.body);

      // const assignedClass = await this.iassignclass.execute(className);

      const newClass = new Class(
        "",
        className,
        division,
        rollNumber,
        department as "LP" | "UP" | "HS",
        subjects
      );

      const created = await this.classAddUseCase.execute(newClass);

      res.status(StatusCodes.OK).json({
        success: true,
        message: `Class ${created.className}${created.division} created successfully`,
        class: created,
      });

    } catch (err: unknown) {
      console.error((err as Error).message);


      if ((err as Error).message.includes("already exists")) {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: (err as Error).message,
        });
      } else {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: (err as Error).message || "Failed to create class",
        });
      }
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.getAllClass.execute();
      res.status(StatusCodes.OK).json({ data });
    } catch (error: unknown) {
      console.error(" Error getting classes:", error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.SERVER_ERROR_1, error: (error as Error).message });
    }
  }
  async updateclass(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const update = req.body

      validateClassUpdate(update);

      const updatedClass = await this.classupdate.execute(id, update)

      if (!updatedClass) {
        res.status(StatusCodes.NOT_FOUND).json({ message: RESPONSE_MESSAGES.CLASS_NOT_FOUND });
        return;
      }

      res.status(StatusCodes.OK).json({
        message: RESPONSE_MESSAGES.CLASS_UPDATED_SUCCESSFULLY,
        class: updatedClass
      });
    } catch (error: unknown) {
      console.error("Error updating class:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: (error as Error).message || "Failed to update class"
      });
    }
  }
  async getnextdivision(req: Request, res: Response): Promise<void> {
    try {
      const { className } = req.params;
      if (!className) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.CLASS_ID_IS_NOT_AVAILBLE })

      }
      const assignclasses = await this.iassignclass.execute(className)
      if (!assignclasses) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: `No available division find from ${className}` })
      }
      res.status(StatusCodes.OK).json({ message: `Next availble division from  ${className}` })
    } catch (error: unknown) {

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR_CANNOT_FIND })
    }
  }

  async deleteClass(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.deleteClassUseCase.execute(id);
      res.status(StatusCodes.OK).json({ success: true, message: RESPONSE_MESSAGES.CLASS_DELETED_SUCCESSFULLY });
    } catch (error: unknown) {

      res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: (error as Error).message });
    }
  }
}

