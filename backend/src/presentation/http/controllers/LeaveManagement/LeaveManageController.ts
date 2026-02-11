import { Request, Response } from "express";
import { ICreateLeaveusecase } from "../../../../applications/interface/UseCaseInterface/LeaveManagement/ICreateLeaveUseCase";
import { AuthRequest } from "../../../../infrastructure/types/AuthRequest";
import { CreateLeaveDTO } from "../../../../applications/dto/LeaveManagement/CreateLeaveManagementDTO";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { IGetTeacherUseCase } from "../../../../applications/interface/UseCaseInterface/LeaveManagement/IGetTeacherUseCase";
import { IGetAllLeavesUseCase } from "../../../../applications/interface/UseCaseInterface/LeaveManagement/IGetAllLeavesUseCase";
import { IUpdateLeaveStatusUseCase } from "../../../../applications/interface/UseCaseInterface/LeaveManagement/IUpdateLeaveStatusUseCase";
import { LeaveError } from "../../../../domain/enums/LeaveError";
import { ICreateSubAdminLeaveUseCase } from "../../../../applications/useCases/LeavemanagementUseCase.ts/SubAdminLeaveCreateUseCase";
import { IGetSubAdminLeavesUseCase } from "../../../../applications/useCases/LeavemanagementUseCase.ts/GetSubAdminLeavesUseCase";
import { ValidateLeaveCreate } from "../../../../applications/validators/LeaveValidation/LeaveCreateValidation";



export class LeaveManagementController {
  constructor(
    private readonly _leavecreate: ICreateLeaveusecase,
    private readonly _getTeacherLeaves: IGetTeacherUseCase,
    private readonly _getAllLeaves: IGetAllLeavesUseCase,
    private readonly _updateLeaveStatus: IUpdateLeaveStatusUseCase,
    private readonly _subAdminLeaveCreate: ICreateSubAdminLeaveUseCase,
    private readonly _getSubAdminLeaves: IGetSubAdminLeavesUseCase
  ) { }

  async LeaveCreate(req: AuthRequest, res: Response): Promise<void> {
    try {
      const teacherId = req.user?.id;
      if (!teacherId) {
        res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "Unauthorized access" });
        return;
      }
      const data: CreateLeaveDTO = req.body;

      const leave = await this._leavecreate.execute(
        teacherId,
        data
      );

      res.status(StatusCodes.CREATED).json({
        message: "Leave created successfully",
        leave,
      });

    } catch (error: any) {
      console.log("error", error)
      if (
        error.message?.includes("already existed") ||
        error.message?.includes("Insufficient") ||
        Object.values(LeaveError).includes(error.message)
      ) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: error.message,
        });
        return;
      }
      console.error("Leave creation error:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
        error: error.message
      });
    }
  }

  async subAdminLeaveCreate(req: AuthRequest, res: Response): Promise<void> {
    try {
      const subAdminId = req.user?.id;

      if (!subAdminId) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized access" });
        return;
      }

      const data: CreateLeaveDTO = req.body;

      try {
        ValidateLeaveCreate(data);
      } catch (error: any) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
        return;
      }


      const leave = await this._subAdminLeaveCreate.execute(subAdminId, data);

      res.status(StatusCodes.CREATED).json({
        message: "Leave request submitted successfully",
        leave
      });

    } catch (error: any) {
      console.log(error)
      if (Object.values(LeaveError).includes(error.message)) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
        return;
      }
      console.log(error, "error")
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  }

  async getTeacherLeaves(req: AuthRequest, res: Response): Promise<void> {
    try {
      const teacherId = req.user?.id;
      if (!teacherId) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized access" });
        return;
      }
      const leaves = await this._getTeacherLeaves.execute(teacherId);
      res.status(StatusCodes.OK).json({ leaves });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  }

  async getSubAdminLeaves(req: AuthRequest, res: Response): Promise<void> {
    try {
      const subAdminId = req.user?.id;
      if (!subAdminId) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized access" });
        return;
      }
      const leaves = await this._getSubAdminLeaves.execute(subAdminId);
      res.status(StatusCodes.OK).json({ leaves });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  }

  async getAllLeaves(req: Request, res: Response): Promise<void> {
    try {
      const leaves = await this._getAllLeaves.execute();
      res.status(StatusCodes.OK).json({ leaves });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  }

  async updateLeaveStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const adminId = req.user?.id;
      console.log("reacher", adminId)
      const { leaveId, status, adminRemark } = req.body;

      if (!adminId) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized access" });
        return;
      }

      if (adminRemark && !/^[a-zA-Z\s.,]+$/.test(adminRemark)) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Remark must contain only alphabets, dots, and commas" });
        return;
      }

      const updatedLeave = await this._updateLeaveStatus.execute(leaveId, status, adminId, adminRemark);
      console.log("updateleave", updatedLeave)

      if (!updatedLeave) {
        res.status(StatusCodes.NOT_FOUND).json({ message: "Leave request not found" });
        return;
      }

      res.status(StatusCodes.OK).json({ message: "Leave status updated successfully", leave: updatedLeave });
    } catch (error: any) {
      console.log("error", error)
      if (error.message?.includes("Insufficient")) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
      }
    }
  }
}