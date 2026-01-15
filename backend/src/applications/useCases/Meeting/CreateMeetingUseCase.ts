import { Meeting } from "../../../domain/entities/Meeting";
import { IMeetingRepository } from "../../../domain/repositories/IMeetingRepository";
import { ICreateMeetingUseCase } from "../../../domain/UseCaseInterface/Meeting/ICreateMeetingUseCase";

export class CreateMeetingUseCase implements ICreateMeetingUseCase {
    constructor(private readonly meetingRepository: IMeetingRepository) { }

    async execute(meetingData: Meeting): Promise<Meeting> {
        if (!meetingData.link) {
            meetingData.link = Math.random().toString(36).substring(2, 12);
        }

        const startTime = new Date(meetingData.startTime);
        const now = new Date();

        if (startTime < now) {
            throw new Error('Meeting cannot be scheduled in the past');
        }

        return await this.meetingRepository.createMeeting(meetingData);
    }
}
