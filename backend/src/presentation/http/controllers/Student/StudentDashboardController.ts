import { Response } from "express";
import { IStudentDashboardUseCase } from "../../../../applications/interface/UseCaseInterface/StudentDashboard/IStudentDashboardUseCase";
import { AuthRequest } from "../../../../infrastructure/types/AuthRequest";
import { StatusCodes } from "../../../../shared/constants/statusCodes";

export class StudentDashboardController {
    constructor(private useCase: IStudentDashboardUseCase) { }

    async getDashboard(req: AuthRequest, res: Response) {
        try {
            const studentId = req.user?.id;
            if (!studentId) {
                return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized: User ID not found" });
            }

            const dashboardData = await this.useCase.execute(studentId);
            return res.status(StatusCodes.OK).json(dashboardData);
        } catch (error) {
            console.error("Error in getDashboard:", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
        }
    }
}
