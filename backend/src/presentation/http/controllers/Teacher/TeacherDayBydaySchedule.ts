import { IGetTeacherDailySchedule } from "../../../../domain/UseCaseInterface/TimeTable/IGetTeacherDailySchedule";
import { Request, Response } from "express";
import { AuthRequest } from "../../../../infrastructure/types/AuthRequest";
import { StatusCodes } from "../../../../shared/constants/statusCodes";

export class TeacherDailyScheduleView {
    constructor(private readonly _viewSchedule: IGetTeacherDailySchedule) { }

    async TeacherViewSchedule(req: AuthRequest, res: Response): Promise<void> {
        try {

            const teacherId = req.user?.id;
            const day = req.query.day as string | undefined;

            if (!teacherId) {
                console.error("Teacher ID not found in req.user:", req.user);
                // Temporarily allow execution or return 400 to prevent redirect loop
                res.status(StatusCodes.BAD_REQUEST).json({ message: 'Teacher ID missing in token' });
                return;
            }

            const result = await this._viewSchedule.execute(teacherId, day);
            if (!result) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: 'No schedule found' });
                return;
            }

            res.status(StatusCodes.OK).json({ success: true, data: result });
            console.log("all datas fetched", result)

        } catch (error: any) {
            console.error('Error in TeacherViewSchedule:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal Server Error',
                error: error.message
            });
        }
    }
}