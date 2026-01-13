import { Router } from 'express';
import { MeetingController } from './controllers/MeetingController';
import { authMiddleware } from '../../infrastructure/middleware/AuthMiddleWare';

const MeetingRouter = Router();
const meetingController = new MeetingController();

// Apply auth middleware to all meeting routes
MeetingRouter.use(authMiddleware);

MeetingRouter.post('/create', meetingController.createMeeting);
MeetingRouter.get('/scheduled', meetingController.getScheduledMeetings);
MeetingRouter.post('/validate-join', meetingController.validateJoin);

export default MeetingRouter;
