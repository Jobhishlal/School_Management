import { Request, Response } from "express";
import { CreateClassUseCase } from "../../../../applications/useCases/Classdata/CreateClass";
import { GetAllClass } from "../../../../applications/useCases/Classdata/GeallClass";
import { Class } from "../../../../domain/entities/Class";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { IClassUpdateUseCase } from "../../../../domain/UseCaseInterface/IClassUpdateUseCase";

export class ClassManagementController {
  constructor(
    private readonly classAddUseCase: CreateClassUseCase,
    private readonly getAllClass: GetAllClass,
    private readonly classupdate:IClassUpdateUseCase
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { className, division, department, rollNumber, subjects } = req.body;

      console.log(" req.body in class create:", req.body);

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
        message: "Class created successfully",
        class: created,
      });
    }   catch (err: any) {
      console.error(err.message);
      res.status(StatusCodes.BAD_REQUEST).json({
        message: err.message || "Failed to create parent"
      });
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
  async updateclass(req:Request,res:Response):Promise<void>{
    try {
      const {id}=req.params
      const update = req.body

    const updatedClass= await this.classupdate.execute(id,update)

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
  }

