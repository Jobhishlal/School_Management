import { Meeting } from "../../entities/Meeting";

export interface ICreateMeetingUseCase {
    execute(meetingData: Meeting): Promise<Meeting>;
}
