import { GetTeacherDashboardUseCase } from "../../../../applications/useCases/Teacher/GetTeacherDashboardUseCase";
import { Response } from "express";
import { AuthRequest } from "../../../../infrastructure/types/AuthRequest";
import { IGetTeacherDashboardUseCase } from "../../../../domain/UseCaseInterface/Teacher/IGetTeacherDashboardUseCase";

export class TeacherDashboardController {
    constructor(private useCase: IGetTeacherDashboardUseCase) { }

    async getDashboardStats(req: AuthRequest, res: Response): Promise<void> {
        try {
            const teacherId = req.user?.id;

            if (!teacherId) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }

            const stats = await this.useCase.execute(teacherId);
            res.status(200).json(stats);
        } catch (error: any) {
            console.error("Dashboard error:", error);
            res.status(500).json({ message: error.message || "Internal Server Error" });
        }
    }
}
