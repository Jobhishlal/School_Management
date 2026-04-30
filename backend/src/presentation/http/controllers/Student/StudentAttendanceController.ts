
import { Request, Response } from "express";
import { AuthRequest } from "../../../../infrastructure/types/AuthRequest";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { StudentAttendanceDashboardUseCase } from "../../../../applications/useCases/Students/StudentAttendanceDashboardUseCase";
import { StudentDateBaseAttendanceSearchUseCase } from "../../../../applications/useCases/Students/StudentDateBaseAttendanceSearchUseCase";
import { AttendanceErrorEnums } from "../../../../shared/constants/AttendanceErrorEnums";
import { validateAttendanceFilter } from '../../../validators/AttendanceValidation/AttendanceValidators';

export class StudentAttendanceController {
    constructor(
        private dashboardUseCase: StudentAttendanceDashboardUseCase,
        private databaseSearchUseCase: StudentDateBaseAttendanceSearchUseCase
    ) { }

    async getAttendanceDashboard(req: AuthRequest, res: Response): Promise<void> {
        try {
            const studentId = req.user?.id; 

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
        } catch (error: unknown) {
            console.error(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: (error as Error).message || "Internal server error",
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

            validateAttendanceFilter(startDate, endDate);

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
        } catch (error: unknown) {
            if (Object.values(AttendanceErrorEnums).includes((error as Error).message as AttendanceErrorEnums)) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: (error as Error).message,
                });
                return;
            }
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: (error as Error).message ?? "Internal server error",
            });
        }
    }
}
