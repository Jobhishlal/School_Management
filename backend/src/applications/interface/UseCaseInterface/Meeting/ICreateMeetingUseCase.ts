import { Meeting } from "../../../../domain/entities/Meeting";

export interface ICreateMeetingUseCase {
    execute(meetingData: Meeting): Promise<Meeting>;
}
