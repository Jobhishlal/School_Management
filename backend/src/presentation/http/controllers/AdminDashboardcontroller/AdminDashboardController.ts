import { Request, Response, NextFunction } from "express";
import { IGetAdminDashboardUseCase } from "../../../../applications/interface/UseCaseInterface/IGetAdminDashboardUseCase";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
export class AdminDashboardController {
    constructor(private _getAdminDashboardUseCase: IGetAdminDashboardUseCase) { }

    async getDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const dashboardData = await this._getAdminDashboardUseCase.execute();
            res.status(StatusCodes.OK).json({
                success: true,
                message: "Admin Dashboard data fetched successfully",
                data: dashboardData
            });
        } catch (error: unknown) {
            next(error);
        }
    }
}
