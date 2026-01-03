import { IAttendanceCreateUseCase } from "../../../../domain/UseCaseInterface/Attandance/ITakeAttendanceUseCase";
import { Response } from "express";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { TakeAttendance } from "../../../../applications/dto/Attendance/TakeAttendanceDTO";
import { AuthRequest } from "../../../../infrastructure/types/AuthRequest";
import { IGetStudentsByClassUseCase } from "../../../../domain/UseCaseInterface/StudentCreate/IStudentFindClassBase";
import { IFindStudentsByTeacherUseCase } from "../../../../domain/UseCaseInterface/IFindStudentsByTeacherUseCase";
import { IAttendanceList } from "../../../../domain/UseCaseInterface/Attandance/IAttendanceTeacherList";
export class AttendanceController {
  constructor(
    private repo: IAttendanceCreateUseCase,
    private studentclassrepofind:IGetStudentsByClassUseCase, 
    private findStudentsUseCase:IFindStudentsByTeacherUseCase,
    private attendancelist : IAttendanceList

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


async AttendanceList(req: AuthRequest, res: Response): Promise<void> {
    try {
      console.log("reached here")
      const { classId } = req.params;
      console.log(classId)

      if (!classId) {
        res.status(400).json({ success: false, message: "Class ID is required" });
        return;
      }

      const attendance = await this.attendancelist.execute(classId);
      console.log(attendance)

      res.status(StatusCodes.OK).json({
        success: true,
        attendance,
        date: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch attendance",
      });
    }
  }

}
