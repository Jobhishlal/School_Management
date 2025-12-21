import { IAttendanceCreateUseCase } from "../../../../domain/UseCaseInterface/Attandance/ITakeAttendanceUseCase";
import { Response } from "express";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { TakeAttendance } from "../../../../applications/dto/Attendance/TakeAttendanceDTO";
import { AuthRequest } from "../../../../infrastructure/types/AuthRequest";
import { IGetStudentsByClassUseCase } from "../../../../domain/UseCaseInterface/StudentCreate/IStudentFindClassBase";
import { IFindStudentsByTeacherUseCase } from "../../../../domain/UseCaseInterface/IFindStudentsByTeacherUseCase";
export class AttendanceController {
  constructor(
    private repo: IAttendanceCreateUseCase,
    private studentclassrepofind:IGetStudentsByClassUseCase, 
    private findStudentsUseCase:IFindStudentsByTeacherUseCase

) {}

  async Create(req: AuthRequest, res: Response): Promise<void> {
    try {
    
      const data: TakeAttendance = {
        ...req.body,
        teacherId: req.user?.id,
      };
      console.log('data',data.teacherId)

      const create = await this.repo.execute(data);
      console.log("create",create)

      if (!create) {
        console.log("create",create)
         res.status(StatusCodes.BAD_REQUEST).json({
          message: "Attendance creation failed",
          success: false,
        });
      }
   

      res.status(StatusCodes.CREATED).json({
        message: "Attendance created successfully",
        success: true,
        create,
      });
    } catch (error: any) {
      console.error("error",error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message || "Internal server error",
        success: false,
      });
    }
  }

    async FindStudntSClassBase(req:AuthRequest,res:Response):Promise<void>{
      try {
        const {classId}=req.params
        const teacherId = req.user?.id

        const student = await this.studentclassrepofind.execute(classId,teacherId)
        console.log(student)
        if(!student){
            console.log("stdent",student)
          res.status(StatusCodes.BAD_REQUEST)
          .json({message:"does not fetch student in classbase"})
        }
        res.status(StatusCodes.OK)
        .json({message:"data fetching successfully",success:true,student})
      } catch (error) {
        console.log(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({message:"internal server error",error})
        
      }
    }
    
    async findStudentsByTeacher(req: AuthRequest, res: Response): Promise<void> {
        try{
        const teacherId = req.user?.id; 

      if (!teacherId) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          message: "Unauthorized access",
          success: false,
        });
        return;
      }

      const students = await this.findStudentsUseCase.execute(teacherId);

      res.status(StatusCodes.OK).json({
        message: "Students fetched successfully",
        success: true,
        students, 
      });
    } catch (error: any) {
      console.error("error happend here",error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message || "Internal server error",
        success: false,
      });
    }
  }
    

}
