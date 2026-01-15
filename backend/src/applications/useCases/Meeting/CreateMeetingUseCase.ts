import { Meeting } from "../../../domain/entities/Meeting";
import { IMeetingRepository } from "../../../domain/repositories/IMeetingRepository";
import { ICreateMeetingUseCase } from "../../../domain/UseCaseInterface/Meeting/ICreateMeetingUseCase";

export class CreateMeetingUseCase implements ICreateMeetingUseCase {
    constructor(private readonly meetingRepository: IMeetingRepository) { }

    async execute(meetingData: Meeting): Promise<Meeting> {
        if (!meetingData.link) {
            meetingData.link = Math.random().toString(36).substring(2, 12);
        }

        const titleRegex = /^[a-zA-Z\s]+$/;
        if (!titleRegex.test(meetingData.title) || !meetingData.title.trim()) {
            throw new Error('Title must contain only alphabets and spaces');
        }

        if (meetingData.description) {
            if (!titleRegex.test(meetingData.description) || !meetingData.description.trim()) {
                throw new Error('Description must contain only alphabets and spaces');
            }
        }

        const startTime = new Date(meetingData.startTime);
        const now = new Date();

        if (startTime < now) {
            throw new Error('Meeting cannot be scheduled in the past');
        }

        return await this.meetingRepository.createMeeting(meetingData);
    }
}
