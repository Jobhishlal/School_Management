import { Router } from 'express';
import { MeetingController } from '../http/controllers/media/MeetingController';
import { authMiddleware } from '../../infrastructure/middleware/AuthMiddleWare';
import { MeetingRepository } from '../../infrastructure/repositories/MeetingRepository';
import { MongoStudentRepo } from '../../infrastructure/repositories/MongoStudentRepo';
import { CreateMeetingUseCase } from '../../applications/useCases/Meeting/CreateMeetingUseCase';
import { GetScheduledMeetingsUseCase } from '../../applications/useCases/Meeting/GetScheduledMeetingsUseCase';
import { ValidateMeetingJoinUseCase } from '../../applications/useCases/Meeting/ValidateMeetingJoinUseCase';

const MeetingRouter = Router();

import { SocketNotification } from '../../infrastructure/socket/SocketNotification';
const meetingRepository = new MeetingRepository();
const studentRepository = new MongoStudentRepo();
const socketNotification = new SocketNotification();
const createMeetingUseCase = new CreateMeetingUseCase(meetingRepository, socketNotification);
const getScheduledMeetingsUseCase = new GetScheduledMeetingsUseCase(meetingRepository);
const validateMeetingJoinUseCase = new ValidateMeetingJoinUseCase(meetingRepository, studentRepository);

const meetingController = new MeetingController(
    createMeetingUseCase,
    getScheduledMeetingsUseCase,
    validateMeetingJoinUseCase
);



MeetingRouter.use(authMiddleware);

MeetingRouter.post('/create', meetingController.createMeeting);
MeetingRouter.get('/scheduled', meetingController.getScheduledMeetings);
MeetingRouter.post('/validate-join', meetingController.validateJoin);

export default MeetingRouter;
