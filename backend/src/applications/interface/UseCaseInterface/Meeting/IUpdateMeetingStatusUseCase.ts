import { Meeting } from "../../../../domain/entities/Meeting";

export interface IUpdateMeetingStatusUseCase {
    execute(meetingId: string, status: 'scheduled' | 'live' | 'ended'): Promise<Meeting | null>;
}
