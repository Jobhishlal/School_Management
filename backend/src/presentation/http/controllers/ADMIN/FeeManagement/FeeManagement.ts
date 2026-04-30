import { RESPONSE_MESSAGES } from "../../../../../shared/constants/responseMessages";
import { Request, Response } from "express";
import { ICreateFeeStructureUseCase } from "../../../../../applications/interface/UseCaseInterface/IFeeCreateInterFace";
import { StatusCodes } from "../../../../../shared/constants/statusCodes";
import { IStudentFullFeePaymentStatusUseCase } from "../../../../../applications/interface/UseCaseInterface/FeeStructure/IStudentFeePaidDetails";
import { IStudentPaymentHistorySeeAdmin } from "../../../../../applications/interface/UseCaseInterface/FeeStructure/StudentBasePaymentHistorSee";
import { IGetAllFeeStructures } from "../../../../../applications/interface/UseCaseInterface/FeeStructure/IGetAllFeeStructures";
import { validateFeeStructureCreate } from "../../../../validators/FinanceValidation/FinanceValidators";

export class FeeStructureManageController {
  constructor(
    private _createFeeUseCase: ICreateFeeStructureUseCase,
    private _feepaymentcompletedetails: IStudentFullFeePaymentStatusUseCase,
    private _search: IStudentPaymentHistorySeeAdmin,
    private _getAllFeeStructuresUseCase: IGetAllFeeStructures
  ) { }



  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._getAllFeeStructuresUseCase.execute();
      res.status(StatusCodes.OK).json({
        success: true,
        data: result,
      });
    } catch (error: unknown) {
      console.error("Error fetching fee structures:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: RESPONSE_MESSAGES.FAILED_TO_FETCH_FEE_STRUCTURES,
        error: (error as Error).message,
      });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, classId, academicYear, feeItems, notes, startDate, expiryDate } = req.body;

      validateFeeStructureCreate(req.body);

      const result = await this._createFeeUseCase.execute({
        name,
        classId,
        academicYear,
        feeItems,
        notes,
        startDate,
        expiryDate
      });


      res.status(StatusCodes.CREATED).json({
        message: RESPONSE_MESSAGES.FEE_STRUCTURE_CREATED_SUCCESSFULLY,
        data: result,
      });

    } catch (error: unknown) {
      console.error("error happened", error);

      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: (error as Error).message || "Failed to create fee structure",
      });
    }
  }

  async fullfeecompletedetails(req: Request, res: Response): Promise<void> {
    try {
      const { classId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      console.log("classId", classId, "page", page, "limit", limit);

      const result = await this._feepaymentcompletedetails.execute(classId, page, limit);

      if (!result) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.DOES_NOT_GET_CLASSID, success: false })
        return;
      }
      res.status(StatusCodes.OK)
        .json({ message: RESPONSE_MESSAGES.DATA_FETCH_SUCCESSFULLY, success: true, ...result }) 

    } catch (error) {
      console.log(error)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR_1, error })
    }
  }

  async SearchPeymentHistoryStudent(req: Request, res: Response): Promise<void> {
    try {
      const studentName = req.query.studentName as string;
      console.log("student name:", studentName);


      if (!studentName || studentName.trim() === "") {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: RESPONSE_MESSAGES.STUDENT_NAME_REQUIRED });
      }

      const data = await this._search.execute(studentName);

      if (!data || data.length === 0) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: RESPONSE_MESSAGES.NO_STUDENT_FOUND_WITH_THIS_NAME });
      }

      res.status(StatusCodes.OK).json({
        message: RESPONSE_MESSAGES.SUCCESSFULLY_SEARCHED_STUDENT,
        data,
      });

    } catch (error) {
      console.error(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }


}
