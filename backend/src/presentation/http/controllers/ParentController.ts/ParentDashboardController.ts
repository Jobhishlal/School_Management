import { RESPONSE_MESSAGES } from "../../../../shared/constants/responseMessages";
import { Request, Response } from "express";
import { IGetParentDashboardStatsUseCase } from "../../../../applications/interface/UseCaseInterface/Parent/IGetParentDashboardStatsUseCase";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { AuthRequest } from "../../../../infrastructure/types/AuthRequest";


export class ParentDashboardController {
    constructor(private getParentDashboardStatsUseCase: IGetParentDashboardStatsUseCase) { }

    async getDashboardStats(req: Request, res: Response): Promise<void> {
        try {
            const authReq = req as AuthRequest;
            const parentId = authReq.user?.id;

            if (!parentId) {
                res.status(StatusCodes.UNAUTHORIZED).json({ message: RESPONSE_MESSAGES.UNAUTHORIZED });
                return;
            }

            const stats = await this.getParentDashboardStatsUseCase.execute(parentId);
           
            res.status(StatusCodes.OK).json(stats);
        } catch (error: unknown) {
            console.error("Error fetching dashboard stats:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: (error as Error).message || "Failed to fetch dashboard statistics"
            });
        }
    }
}
