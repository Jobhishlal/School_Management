import { RESPONSE_MESSAGES } from "../../../../shared/constants/responseMessages";
import { IGetTeacherDailySchedule } from "../../../../applications/interface/UseCaseInterface/TimeTable/IGetTeacherDailySchedule";
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
                res.status(StatusCodes.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.TEACHER_ID_MISSING_IN_TOKEN });
                return;
            }

            const result = await this._viewSchedule.execute(teacherId, day);
            if (!result) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.NO_SCHEDULE_FOUND });
                return;
            }

            res.status(StatusCodes.OK).json({ success: true, data: result });
            console.log("all datas fetched", result)

        } catch (error: unknown) {
            console.error('Error in TeacherViewSchedule:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR_2,
                error: (error as Error).message
            });
        }
    }
}