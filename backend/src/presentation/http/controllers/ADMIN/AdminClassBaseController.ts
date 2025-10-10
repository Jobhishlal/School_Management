import { Request, Response } from "express";
import { IClassDivision } from "../../../../domain/UseCaseInterface/ClassBase/ClassAndDivision"; 
import { IAssignTeacherOnClass } from "../../../../domain/UseCaseInterface/ClassBase/IClassAssignTeacher"; 
import { IGetClassTeacher } from "../../../../domain/UseCaseInterface/ClassBase/IGetAllTeachers";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { IGETALLCLASSTEACHER } from "../../../../domain/UseCaseInterface/ClassBase/IGetAllTeacherstClass";
import logger from "../../../../shared/constants/Logger";

export class AdminClassController {
  
  constructor(
    private readonly classUseCase: IClassDivision,
    private readonly assignTeacherUseCase: IAssignTeacherOnClass,
    private readonly getTeacherUseCase: IGetClassTeacher,
    private readonly listoutteacherlist :IGETALLCLASSTEACHER
  ) {}
  

  async getClassBasestudent(req: Request, res: Response) {
   
    try {
      
      const data = await this.classUseCase.execute();

      console.log("data",data)
      
      res.status(StatusCodes.OK).json({ success: true, data });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, error: err });
    }
  }

async AssignTeacherOnClass(req: Request, res: Response) {
  try {
    const { classId, teacherId } = req.body;

    if (!classId || !teacherId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "ClassId and TeacherId required" });
    }
    console.log("classId",classId,teacherId)

    const success = await this.assignTeacherUseCase.execute(classId, teacherId);
    console.log("success",success)

    if (success)
      res.json({ success: true, message: "Teacher assigned successfully" });
    else
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "Cannot assign teacher" });
  } catch (err: any) {
    logger.info(err)
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: err.message || "Teacher assignment failed",
    });
  }
}


  async ListClassTeacher(req: Request, res: Response) {
   
    try {
      const { classId } = req.params;
      if (!classId)
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "ClassId required" });

      const teacher = await this.getTeacherUseCase.execute(classId);
      res.json({ success: true, data: teacher ? [teacher] : [] });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, error: err });
    }
  }
async GetAllTeachers(req: Request, res: Response): Promise<void> {
  try {
   
    const data = await this.listoutteacherlist.execute();
 
    if (!data) {
       res.status(400).json({ success: false, message: "No teachers found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

}
