import { Meeting } from "../../../domain/entities/Meeting";
import { IMeetingRepository } from "../../../domain/repositories/IMeetingRepository";
import { ICreateMeetingUseCase } from "../../../domain/UseCaseInterface/Meeting/ICreateMeetingUseCase";
import { NotificationPort } from "../../ports/NotificationPort";

export class CreateMeetingUseCase implements ICreateMeetingUseCase {
    constructor(
        private readonly meetingRepository: IMeetingRepository,
        private readonly notificationPort: NotificationPort
    ) { }

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

        const createdMeeting = await this.meetingRepository.createMeeting(meetingData);

        // Emit Notification
        await this.notificationPort.send({
            title: `New Meeting: ${meetingData.title}`,
            content: meetingData.description || "A new meeting has been scheduled.",
            type: "MEETING",
            scope: (meetingData.classId && meetingData.type === 'class') ? "CLASS" : "GLOBAL",
            classes: meetingData.classId ? [meetingData.classId.toString()] : [],
            link: meetingData.link
        });

        return createdMeeting;
    }
}
