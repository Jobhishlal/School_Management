import { Request, Response } from "express";
import { GetParentDashboardStatsUseCase } from "../../../../applications/useCases/Parent/GetParentDashboardStatsUseCase";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { AuthRequest } from "../../../../infrastructure/types/AuthRequest";
import logger from "../../../../shared/constants/Logger";

export class ParentDashboardController {
    constructor(private getParentDashboardStatsUseCase: GetParentDashboardStatsUseCase) { }

    async getDashboardStats(req: Request, res: Response): Promise<void> {
        try {
            const authReq = req as AuthRequest;
            const parentId = authReq.user?.id;

            if (!parentId) {
                res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
                return;
            }

            const stats = await this.getParentDashboardStatsUseCase.execute(parentId);
            logger.info(stats)
            console.log(stats.examStats)
            res.status(StatusCodes.OK).json(stats);
        } catch (error: any) {
            console.error("Error fetching dashboard stats:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message || "Failed to fetch dashboard statistics"
            });
        }
    }
}
