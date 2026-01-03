import { Request, Response } from "express";
import { ICreateFeeStructureUseCase } from "../../../../../domain/UseCaseInterface/FeeStructure/IFeeCreateInterFace";
import { StatusCodes } from "../../../../../shared/constants/statusCodes";
import { IStudentFullFeePaymentStatusUseCase } from "../../../../../domain/UseCaseInterface/FeeStructure/IStudentFeePaidDetails";
import { IStudentPaymentHistorySeeAdmin } from "../../../../../domain/UseCaseInterface/FeeStructure/StudentBasePaymentHistorSee";
export class FeeStructureManageController {
  constructor(
    private createFeeUseCase: ICreateFeeStructureUseCase,
    private feepaymentcompletedetails:IStudentFullFeePaymentStatusUseCase,
    private search : IStudentPaymentHistorySeeAdmin

  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, classId, academicYear, feeItems, notes,startDate,expiryDate } = req.body;

     


      const result = await this.createFeeUseCase.execute({
        name,
        classId,
        academicYear,
        feeItems,
        notes,
        startDate,
        expiryDate
      });

   
      res.status(StatusCodes.CREATED).json({
        message: "Fee Structure created successfully",
        data: result,
      });

    }catch (error: any) {
  console.error("error happened", error);

  res.status(StatusCodes.BAD_REQUEST).json({
    success: false,
    message: error.message || "Failed to create fee structure",
  });
}
  }

  async fullfeecompletedetails(req:Request,res:Response):Promise<void>{
    try {
      const {classId}=req.params
      console.log("classId",classId)
      const data = await this.feepaymentcompletedetails.execute(classId)
      console.log("data",data)
      if(!data){
        res.status(StatusCodes.BAD_REQUEST).json({message:"does not get classId",success:false})
      }
      res.status(StatusCodes.OK)
      .json({message:"data fetch successfully",success:true,data})

    } catch (error) {
      console.log(error)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({message:"internal server error",error})
    }
  }

async SearchPeymentHistoryStudent(req: Request, res: Response): Promise<void> {
  try {
    const studentName = req.query.studentName as string;
    console.log("student name:", studentName);


    if (!studentName || studentName.trim() === "") {
       res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "STUDENT_NAME_REQUIRED" });
    }

    const data = await this.search.execute(studentName);

    if (!data || data.length === 0) {
       res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "No student found with this name" });
    }

     res.status(StatusCodes.OK).json({
      message: "Successfully searched student",
      data,
    });

  } catch (error) {
    console.error(error);
     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
}


}
