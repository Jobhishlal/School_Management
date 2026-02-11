import { Request, Response } from "express";
import { IApplyStudentLeaveUseCase } from "../../../../applications/interface/UseCaseInterface/StudentLeave/IApplyStudentLeaveUseCase";
import { IGetStudentLeaveHistoryUseCase } from "../../../../applications/interface/UseCaseInterface/StudentLeave/IGetStudentLeaveHistoryUseCase";
import { IGetClassStudentLeavesUseCase } from "../../../../applications/interface/UseCaseInterface/StudentLeave/IGetClassStudentLeavesUseCase";
import { IProcessStudentLeaveUseCase } from "../../../../applications/interface/UseCaseInterface/StudentLeave/IProcessStudentLeaveUseCase";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { AuthRequest } from "../../../../infrastructure/types/AuthRequest";
import { validateLeaveCreate } from '../../../validators/LeaveValidation/LeaveValidators';

export class StudentLeaveController {
    constructor(
        private readonly applyLeaveUseCase: IApplyStudentLeaveUseCase,
        private readonly getHistoryUseCase: IGetStudentLeaveHistoryUseCase,
        private readonly getClassLeavesUseCase: IGetClassStudentLeavesUseCase,
        private readonly processLeaveUseCase: IProcessStudentLeaveUseCase
    ) { }

    async applyLeave(req: AuthRequest, res: Response) {
        try {
            const { reason, startDate, endDate, leaveType } = req.body;

            validateLeaveCreate(req.body);

            const parentId = req.user?.id || req.body.parentId;

            const data = {
                ...req.body,
                parentId: parentId
            };
            console.log("datas i am reached apply leave", data)
            const result = await this.applyLeaveUseCase.execute(data);
            console.log("result", result)
            return res.status(StatusCodes.CREATED).json({ success: true, data: result });
        } catch (error: any) {
            console.error("Error applying for student leave:", error);
            if (error.name === 'ValidationError') {
                // Mongoose validation error
                const messages = Object.values(error.errors).map((val: any) => val.message);
                return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: messages.join(', ') });
            }
            return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }

    async getStudentLeaves(req: Request, res: Response) {
        try {
            const { studentId } = req.params;
            console.log("student iD leave page", studentId)
            const result = await this.getHistoryUseCase.execute(studentId);
            console.log("student result", result)
            return res.status(StatusCodes.OK).json({ success: true, data: result });
        } catch (error: any) {
            console.error("Error fetching student leave history:", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
        }
    }

    async getClassLeaves(req: Request, res: Response) {
        try {
            const { classId } = req.params;
            console.log("Fetching leaves for Class ID:", classId);
            const result = await this.getClassLeavesUseCase.execute(classId);
            console.log("Found leaves count:", result.length);
            return res.status(StatusCodes.OK).json({ success: true, data: result });
        } catch (error: any) {
            console.error("Error fetching class leaves:", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
        }
    }

    async updateLeaveStatus(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            console.log("id", id)
            const { status, message } = req.body;
            console.log("status message", status, message)
            const teacherId = req.user?.id;

            if (!teacherId) {
                return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: "Unauthorized action" });
            }

            const result = await this.processLeaveUseCase.execute(id, status, teacherId, message);
            console.log("result", result)

            if (!result) {
                return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Leave not found" });
            }

            return res.status(StatusCodes.OK).json({ success: true, data: result });
        } catch (error: any) {
            console.error("Error updating leave status:", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
        }
    }
}
