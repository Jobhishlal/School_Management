import { Request, Response } from "express";
import { ICreateLeaveusecase } from "../../../../domain/UseCaseInterface/LeaveManagement/ICreateLeaveUseCase";
import { AuthRequest } from "../../../../infrastructure/types/AuthRequest";
import { CreateLeaveDTO } from "../../../../applications/dto/LeaveManagement/CreateLeaveManagementDTO";
import { StatusCodes } from "../../../../shared/constants/statusCodes";

import { GetTeacherLeavesUseCase } from "../../../../applications/useCases/LeavemanagementUseCase.ts/GetTeacherLeavesUseCase";
import { GetAllLeavesUseCase } from "../../../../applications/useCases/LeavemanagementUseCase.ts/GetAllLeavesUseCase";
import { UpdateLeaveStatusUseCase } from "../../../../applications/useCases/LeavemanagementUseCase.ts/UpdateLeaveStatusUseCase";

export class LeaveManagementController {
  constructor(
    private readonly _leavecreate: ICreateLeaveusecase,
    private readonly _getTeacherLeaves: GetTeacherLeavesUseCase,
    private readonly _getAllLeaves: GetAllLeavesUseCase,
    private readonly _updateLeaveStatus: UpdateLeaveStatusUseCase
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
      if (error.message?.includes("already existed") || error.message?.includes("Insufficient")) {
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

      const updatedLeave = await this._updateLeaveStatus.execute(leaveId, status, adminId, adminRemark);
      console.log("updateleave", updatedLeave)

      if (!updatedLeave) {
        res.status(StatusCodes.NOT_FOUND).json({ message: "Leave request not found" });
        return;
      }

      res.status(StatusCodes.OK).json({ message: "Leave status updated successfully", leave: updatedLeave });
    } catch (error: any) {
      console.log("error",error)
      if (error.message?.includes("Insufficient")) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
      }
    }
  }
}