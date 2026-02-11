import { Request, Response } from "express";
import { IGetTeacherClassDetailsUseCase } from "../../../../applications/interface/UseCaseInterface/Teacher/IGetTeacherClassDetailsUseCase";
import { IGetStudentPerformanceUseCase } from "../../../../applications/interface/UseCaseInterface/Teacher/IGetStudentPerformanceUseCase";
import { AuthRequest } from "../../../../infrastructure/types/AuthRequest";
import { StatusCodes } from "../../../../shared/constants/statusCodes";

export class TeacherClassStatsController {
    constructor(
        private getClassDetailsUseCase: IGetTeacherClassDetailsUseCase,
        private getStudentPerformanceUseCase: IGetStudentPerformanceUseCase
    ) { }

    async getMyClassDetails(req: AuthRequest, res: Response) {
        try {
            const teacherId = req.user?.id;
            if (!teacherId) {
                return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: "Unauthorized: No teacher ID found" });
            }

            const search = req.query.search as string || "";
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const result = await this.getClassDetailsUseCase.execute(teacherId, search, page, limit);

            if (!result) {
                return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "No class assigned to this teacher as Class Teacher." });
            }

            return res.status(StatusCodes.OK).json({ success: true, data: result });
        } catch (error: any) {
            console.error("Error fetching class details:", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
        }
    }

    async getStudentPerformance(req: Request, res: Response) {
        try {
            const { studentId } = req.params;

            const result = await this.getStudentPerformanceUseCase.execute(studentId);

            return res.status(StatusCodes.OK).json({ success: true, data: result });
        } catch (error: any) {
            console.error("Error fetching student performance:", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
        }
    }
}
