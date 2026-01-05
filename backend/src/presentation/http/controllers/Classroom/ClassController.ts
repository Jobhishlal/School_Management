import { Request, Response } from "express";
import { CreateClassUseCase } from "../../../../applications/useCases/Classdata/CreateClass";
import { GetAllClass } from "../../../../applications/useCases/Classdata/GeallClass";
import { Class } from "../../../../domain/entities/Class";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { IClassUpdateUseCase } from "../../../../domain/UseCaseInterface/IClassUpdateUseCase";
import { IAssignClassUseCase } from '../../../../domain/UseCaseInterface/AssignClassUseCase'

import { IDeleteClassUseCase } from "../../../../domain/UseCaseInterface/ClassBase/IDeleteClassorDivisionUseCase";

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

    } catch (err: any) {
      console.error(err.message);


      if (err.message.includes("already exists")) {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: err.message,
        });
      } else {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: err.message || "Failed to create class",
        });
      }
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.getAllClass.execute();
      res.status(StatusCodes.OK).json({ data });
    } catch (error: any) {
      console.error(" Error getting classes:", error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: "Server error", error: error.message });
    }
  }
  async updateclass(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const update = req.body

      const updatedClass = await this.classupdate.execute(id, update)

      if (!updatedClass) {
        res.status(StatusCodes.NOT_FOUND).json({ message: "Class not found" });
        return;
      }

      res.status(StatusCodes.OK).json({
        message: "Class updated successfully",
        class: updatedClass
      });
    } catch (error: any) {
      console.error("Error updating class:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message || "Failed to update class"
      });
    }
  }
  async getnextdivision(req: Request, res: Response): Promise<void> {
    try {
      const { className } = req.params;
      if (!className) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "class id is not availble" })

      }
      const assignclasses = await this.iassignclass.execute(className)
      if (!assignclasses) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: `No available division find from ${className}` })
      }
      res.status(StatusCodes.OK).json({ message: `Next availble division from  ${className}` })
    } catch (error: any) {

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error cannot find " })
    }
  }

  async deleteClass(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.deleteClassUseCase.execute(id);
      res.status(StatusCodes.OK).json({ success: true, message: "Class deleted successfully" });
    } catch (error: any) {
     
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: error.message });
    }
  }
}

