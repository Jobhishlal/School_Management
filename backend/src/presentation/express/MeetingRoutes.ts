import { Router } from 'express';
import { MeetingController } from './controllers/MeetingController';
import { authMiddleware } from '../../infrastructure/middleware/AuthMiddleWare';
import { MeetingRepository } from '../../infrastructure/repositories/MeetingRepository';
import { MongoStudentRepo } from '../../infrastructure/repositories/MongoStudentRepo';
import { MeetingUseCase } from '../../applications/useCases/MeetingUseCase';

const MeetingRouter = Router();

const meetingRepository = new MeetingRepository();
const studentRepository = new MongoStudentRepo();
const meetingUseCase = new MeetingUseCase(meetingRepository, studentRepository);
const meetingController = new MeetingController(meetingUseCase);

MeetingRouter.use(authMiddleware);

MeetingRouter.post('/create', meetingController.createMeeting);
MeetingRouter.get('/scheduled', meetingController.getScheduledMeetings);
MeetingRouter.post('/validate-join', meetingController.validateJoin);

export default MeetingRouter;
