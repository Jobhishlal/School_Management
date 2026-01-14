import { Request, Response, NextFunction } from 'express';
import { IMeetingUseCase } from '../../../domain/UseCaseInterface/IMeetingUseCase';
import { StatusCodes } from '../../../shared/constants/statusCodes';

export class MeetingController {
    private meetingUseCase: IMeetingUseCase;

    constructor(meetingUseCase: IMeetingUseCase) {
        this.meetingUseCase = meetingUseCase;
    }

    createMeeting = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const meetingData = req.body;
            console.log("meetingData", meetingData)

            const user = (req as any).user;
            if (user) {
                meetingData.createdBy = user.id;
            }

            const newMeeting = await this.meetingUseCase.createMeeting(meetingData);

            console.log("meeting data", newMeeting)
            res.status(StatusCodes.CREATED).json({ success: true, data: newMeeting });
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: 'internal server error', success: false })
        }
    }

    getScheduledMeetings = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = (req as any).user;
            let role = 'admin';
            let classId = undefined;

            if (user) {
                role = user.role;
                classId = user.studentClassId || user.classId;
            }

            const meetings = await this.meetingUseCase.getScheduledMeetings(role, classId);
            res.status(200).json({ success: true, data: meetings });
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

      
            const result = await this.meetingUseCase.validateJoin(
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
