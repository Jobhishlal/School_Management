import { Router } from 'express';
import { meetingController } from '../../infrastructure/di/meetingDI';
import { authMiddleware } from '../../infrastructure/middleware/AuthMiddleWare';

const MeetingRouter = Router();



MeetingRouter.use(authMiddleware);

MeetingRouter.post('/create', meetingController.createMeeting);
MeetingRouter.get('/scheduled', meetingController.getScheduledMeetings);
MeetingRouter.post('/validate-join', meetingController.validateJoin);

export default MeetingRouter;
