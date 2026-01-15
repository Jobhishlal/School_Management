import { IMeetingDocument } from "../../infrastructure/database/mongoDB/models/MeetingModel";
import { Meeting } from "../entities/Meeting";

export interface IMeetingRepository {
    createMeeting(meetingData: Meeting): Promise<IMeetingDocument>;
    getMeetingByLink(link: string): Promise<IMeetingDocument | null>;
    getMeetingById(id: string): Promise<IMeetingDocument | null>;
    updateMeetingStatus(id: string, status: 'scheduled' | 'live' | 'ended'): Promise<IMeetingDocument | null>;
    getAllMeetings(): Promise<IMeetingDocument[]>;
    getScheduledMeetings(filters?: any): Promise<IMeetingDocument[]>;
}
