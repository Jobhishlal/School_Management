import { Request, Response } from "express";
import { StudentAddUseCase } from "../../../../applications/useCases/Students/CreateStudents";
import { MongoStudentRepo } from "../../../../infrastructure/repositories/MongoStudentRepo";
import { Students } from "../../../../domain/entities/Students";

import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { IGetStudentSInterface } from "../../../../domain/UseCaseInterface/IStudentGetUseCase";
import { IStudentBlock } from "../../../../domain/UseCaseInterface/IStudentBlock";
import logger from "../../../../shared/constants/Logger";
import { IStudentUpdateUseCase } from "../../../../domain/UseCaseInterface/IStudentupdate";
import { IGetStudentsByClassUseCase } from "../../../../domain/UseCaseInterface/StudentCreate/IStudentFindClassBase";
import { AuthRequest } from "../../../../infrastructure/types/AuthRequest";

export class StudentCreateController {
  constructor(
    private studentRepo: MongoStudentRepo,
    private addStudent: StudentAddUseCase,
    private getStudent:IGetStudentSInterface,
    private studentblock:IStudentBlock,
    private studentupdate:IStudentUpdateUseCase,
    private studentclassrepofind:IGetStudentsByClassUseCase
  ) {}

  async create(req: Request, res: Response): Promise<void> {
  try {
    console.log("req.body:", req.body);
    console.log("req.files:", req.files);

    const { fullName, dateOfBirth, gender, parentId, addressId, classId ,blocked} = req.body;

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
  "",               
  undefined,         
  undefined,      
  blocked,       
  undefined,        
  "student"       
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
async blockStudent(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { blocked } = req.body;

      if (!id) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Student id is required" });
        return;
      }

      const updatedStudent = await this.studentblock.execute(id, blocked);

      res.status(StatusCodes.OK).json({
        message: blocked ? "Student blocked successfully" : "Student unblocked successfully",
        data: updatedStudent
      });
    } catch (error: any) {
      console.error("Error in blockStudent:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message || "Server Error" });
    }
  }
 async updateStudent(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updates = { ...req.body }; 

           
            if (req.files && Array.isArray(req.files) && req.files.length > 0) {
                
                const newPhotos = req.files.map((file: any) => ({
                    url: file.path, 
                    filename: file.filename,
                    uploadedAt: new Date(),
                }));
                
           
                updates.photos = newPhotos;
            }

        
            if (updates.dateOfBirth && typeof updates.dateOfBirth === 'string') {
                updates.dateOfBirth = new Date(updates.dateOfBirth);
            }

            const updatedStudent = await this.studentupdate.execute(id, updates);

            if (!updatedStudent) {
                res.status(StatusCodes.NOT_FOUND).json({ message: "Student Not Found" });
                return;
            }
            
            res.status(StatusCodes.OK).json({ 
                message: "Student updated successfully", 
                data: updatedStudent 
            });

        } catch (error: any) {
            logger.info(error);
            const statusCode = error.message?.includes("required") || 
                             error.message?.includes("Invalid") ? 
                             StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR;

            res.status(statusCode).json({
                message: error.message || "Failed to update student",
            });
        }
    }

    async FindStudntSClassBase(req:AuthRequest,res:Response):Promise<void>{
      try {
        const {classId}=req.params
        const teacherId = req.user?.id

        const student = await this.studentclassrepofind.execute(classId,teacherId)
        if(!student){
          res.status(StatusCodes.BAD_REQUEST)
          .json({message:"does not fetch student in classbase"})
        }
        res.status(StatusCodes.OK)
        .json({message:"data fetching successfully",success:true,student})
      } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({message:"internal server error",error})
        
      }
    }

}
