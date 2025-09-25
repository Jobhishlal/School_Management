import { Request, Response } from "express";
import { StudentAddUseCase } from "../../../../applications/useCases/Students/CreateStudents";
import { MongoStudentRepo } from "../../../../infrastructure/repositories/MongoStudentRepo";
import { Students } from "../../../../domain/entities/Students";

import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { IGetStudentSInterface } from "../../../../domain/UseCaseInterface/IStudentGetUseCase";
import logger from "../../../../shared/constants/Logger";

export class StudentCreateController {
  constructor(
    private studentRepo: MongoStudentRepo,
    private addStudent: StudentAddUseCase,
    private getStudent:IGetStudentSInterface
  ) {}

  async create(req: Request, res: Response): Promise<void> {
  try {
    console.log("req.body:", req.body);
    console.log("req.files:", req.files);

    const { fullName, dateOfBirth, gender, parentId, addressId, classId } = req.body;

    const photos =
      (req.files as Express.Multer.File[])?.map(file => ({
        url: (file as any).path,
        filename: file.filename,
        uploadedAt: new Date(),
      })) || [];

    const student = new Students(
      "",
      fullName,
      new Date(dateOfBirth),
      gender,
      "",         
      parentId,
      addressId,
      classId,
      photos,
      ""  ,        
    );

   
    const { student: created, tempPassword } = await this.addStudent.execute(student);

    res.status(StatusCodes.CREATED).json({
      message: "Student created successfully",
      student: created,
      tempPassword,
    });

  } catch (error: any) {
    console.error("Error creating student:", error);


    const statusCode = error.message?.includes("required") || 
                       error.message?.includes("Invalid") ? 
                       StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR;

    res.status(statusCode).json({
      message: error.message || "Failed to create student",
    });
  }
}


  async getAllStudents(req:Request,res:Response):Promise<void>{
    try {
      const student = await this.getStudent.execute()
  
      res.status(StatusCodes.OK).json(student)
      
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"Its Server Error"})
    } 
  }
}
