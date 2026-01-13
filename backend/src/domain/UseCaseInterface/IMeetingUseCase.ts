import { Meeting } from "../entities/Meeting";

export interface IMeetingUseCase {
    createMeeting(meetingData: Meeting): Promise<Meeting>;
    validateJoin(meetingLink: string, userId: string, userRole: string, userClassId?: string): Promise<{ authorized: boolean; meeting?: Meeting; message?: string }>;
    getMeetingByLink(link: string): Promise<Meeting | null>;
    getAllMeetings(): Promise<Meeting[]>;
    getScheduledMeetings(): Promise<Meeting[]>;
    updateStatus(meetingId: string, status: 'scheduled' | 'live' | 'ended'): Promise<Meeting | null>;
}
