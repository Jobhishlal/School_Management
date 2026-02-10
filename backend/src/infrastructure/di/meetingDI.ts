import { MeetingController } from "../../presentation/http/controllers/media/MeetingController";
import { MeetingRepository } from "../repositories/MeetingRepository";
import { MongoStudentRepo } from "../repositories/MongoStudentRepo";
import { SocketNotification } from "../socket/SocketNotification";
import { CreateMeetingUseCase } from "../../applications/useCases/Meeting/CreateMeetingUseCase";
import { GetScheduledMeetingsUseCase } from "../../applications/useCases/Meeting/GetScheduledMeetingsUseCase";
import { ValidateMeetingJoinUseCase } from "../../applications/useCases/Meeting/ValidateMeetingJoinUseCase";

// Repositories
const meetingRepository = new MeetingRepository();
const studentRepository = new MongoStudentRepo();

// Services
const socketNotification = new SocketNotification();

// Use Cases
const createMeetingUseCase = new CreateMeetingUseCase(meetingRepository, socketNotification);
const getScheduledMeetingsUseCase = new GetScheduledMeetingsUseCase(meetingRepository);
const validateMeetingJoinUseCase = new ValidateMeetingJoinUseCase(meetingRepository, studentRepository);

// Controller
export const meetingController = new MeetingController(
    createMeetingUseCase,
    getScheduledMeetingsUseCase,
    validateMeetingJoinUseCase
);
