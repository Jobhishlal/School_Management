import { Meeting } from "../entities/Meeting";

export interface IMeetingUseCase {
    createMeeting(meetingData: Meeting): Promise<Meeting>;
    validateJoin(meetingLink: string, userId: string, userRole: string, userClassId?: string, userStudentId?: string): Promise<{ authorized: boolean; meeting?: Meeting; message?: string }>;
    getMeetingByLink(link: string): Promise<Meeting | null>;
    getAllMeetings(): Promise<Meeting[]>;
    getScheduledMeetings(role?: string, classId?: string): Promise<Meeting[]>;
    updateStatus(meetingId: string, status: 'scheduled' | 'live' | 'ended'): Promise<Meeting | null>;
}
