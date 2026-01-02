
import { Request, Response } from "express";
import { AuthRequest } from "../../../../infrastructure/types/AuthRequest";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { StudentAttendanceDashboardUseCase } from "../../../../applications/useCases/Students/StudentAttendanceDashboardUseCase";
import { StudentDateBaseAttendanceSearchUseCase } from "../../../../applications/useCases/Students/StudentDateBaseAttendanceSearchUseCase";
import { AttendanceErrorEnums } from "../../../../shared/constants/AttendanceErrorEnums";

export class StudentAttendanceController {
    constructor(
        private dashboardUseCase: StudentAttendanceDashboardUseCase,
        private databaseSearchUseCase: StudentDateBaseAttendanceSearchUseCase
    ) { }

    async getAttendanceDashboard(req: AuthRequest, res: Response): Promise<void> {
        try {
            const studentId = req.user?.id; // Assuming student ID is used for auth token

            if (!studentId) {
                res.status(StatusCodes.UNAUTHORIZED).json({
                    success: false,
                    message: "Student not authenticated",
                });
                return;
            }

            const attendance = await this.dashboardUseCase.execute(studentId);

            res.status(StatusCodes.OK).json({
                success: true,
                data: attendance,
            });
        } catch (error: any) {
            console.error(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || "Internal server error",
            });
        }
    }

    async findAttendanceByDateRange(req: AuthRequest, res: Response): Promise<void> {
        try {
            const studentId = req.user?.id;
            const { startDate, endDate } = req.query;

            if (!studentId) {
                res.status(StatusCodes.UNAUTHORIZED).json({
                    success: false,
                    message: "Student not authenticated",
                });
                return;
            }

            if (!startDate || !endDate) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: "startDate and endDate are required",
                });
                return;
            }

            const result = await this.databaseSearchUseCase.execute(
                studentId,
                new Date(startDate as string),
                new Date(endDate as string)
            );

            res.status(StatusCodes.OK).json({
                success: true,
                message: "Attendance details fetched successfully",
                result,
            });
        } catch (error: any) {
            if (Object.values(AttendanceErrorEnums).includes(error.message)) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: error.message,
                });
                return;
            }
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error?.message ?? "Internal server error",
            });
        }
    }
}
