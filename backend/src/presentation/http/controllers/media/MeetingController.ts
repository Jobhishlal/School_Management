import { Request, Response, NextFunction } from 'express';
import { ICreateMeetingUseCase } from '../../../../domain/UseCaseInterface/Meeting/ICreateMeetingUseCase';
import { IGetScheduledMeetingsUseCase } from '../../../../domain/UseCaseInterface/Meeting/IGetScheduledMeetingsUseCase';
import { IValidateMeetingJoinUseCase } from '../../../../domain/UseCaseInterface/Meeting/IValidateMeetingJoinUseCase';
import { StatusCodes } from '../../../../shared/constants/statusCodes';

export class MeetingController {
    private createMeetingUseCase: ICreateMeetingUseCase;
    private getScheduledMeetingsUseCase: IGetScheduledMeetingsUseCase;
    private validateMeetingJoinUseCase: IValidateMeetingJoinUseCase;

    constructor(
        createMeetingUseCase: ICreateMeetingUseCase,
        getScheduledMeetingsUseCase: IGetScheduledMeetingsUseCase,
        validateMeetingJoinUseCase: IValidateMeetingJoinUseCase
    ) {
        this.createMeetingUseCase = createMeetingUseCase;
        this.getScheduledMeetingsUseCase = getScheduledMeetingsUseCase;
        this.validateMeetingJoinUseCase = validateMeetingJoinUseCase;
    }

    createMeeting = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const meetingData = req.body;
            console.log("meetingData", meetingData)

            const user = (req as any).user;
            if (user) {
                meetingData.createdBy = user.id;
            }

            const newMeeting = await this.createMeetingUseCase.execute(meetingData);

            console.log("meeting data", newMeeting)
            res.status(StatusCodes.CREATED).json({ success: true, data: newMeeting });
        } catch (error: any) {
            if (error.message === 'Meeting cannot be scheduled in the past' ||
                error.message === 'Title must contain only alphabets and spaces' ||
                error.message === 'Description must contain only alphabets and spaces') {
                res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: error.message });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ message: 'internal server error', success: false });
            }
        }
    }

    getScheduledMeetings = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = (req as any).user;
            let role = 'admin';
            let classId = undefined;

            if (user) {
                role = (user.role || 'admin').toLowerCase();
                classId = user.studentClassId || user.classId;
            }

            const meetings = await this.getScheduledMeetingsUseCase.execute(role, classId);
            res.status(StatusCodes.OK).json({ success: true, data: meetings });
        } catch (error) {
            console.log("error", error)

            res.status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: "internal server error", success: false })
        }
    }

    validateJoin = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { link } = req.body;
            const user = (req as any).user;

            if (!user) {
                res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: 'Unauthorized' });
                return;
            }

            let userRole = user.role || 'parent';
            let userClassId = user.studentClassId || user.classId;


            const result = await this.validateMeetingJoinUseCase.execute(
                link,
                user.id,
                userRole,
                userClassId,
                user.studentId
            );

            if (result.authorized) {
                res.status(StatusCodes.OK).json({ success: true, data: result.meeting });
            } else {
                console.log("result", result)
                res.status(StatusCodes.FORBIDDEN).json({ success: false, message: result.message });
            }
        } catch (error) {
            next(error);
        }
    }
}
