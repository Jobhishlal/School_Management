import { MeetingModel, IMeetingDocument } from "../database/mongoDB/models/MeetingModel";
import { Meeting } from "../../domain/entities/Meeting";

export class MeetingRepository {

    async createMeeting(meetingData: Meeting): Promise<IMeetingDocument> {
        try {
            const meeting = new MeetingModel(meetingData);
            return await meeting.save();
        } catch (error) {
            throw error;
        }
    }

    async getMeetingByLink(link: string): Promise<IMeetingDocument | null> {
        try {
            return await MeetingModel.findOne({ link }).populate('classId');
        } catch (error) {
            throw error;
        }
    }

    async getMeetingById(id: string): Promise<IMeetingDocument | null> {
        try {
            return await MeetingModel.findById(id);
        } catch (error) {
            throw error;
        }
    }

    async updateMeetingStatus(id: string, status: 'scheduled' | 'live' | 'ended'): Promise<IMeetingDocument | null> {
        try {
            return await MeetingModel.findByIdAndUpdate(id, { status }, { new: true });
        } catch (error) {
            throw error;
        }
    }

    async getAllMeetings(): Promise<IMeetingDocument[]> {
        try {
            return await MeetingModel.find().sort({ createdAt: -1 });
        } catch (error) {
            throw error;
        }
    }

    async getScheduledMeetings(filters?: any): Promise<IMeetingDocument[]> {
        try {
            // Filter meetings that haven't ended AND started within the last 2 hours (or in future)
            // This prevents hiding active meetings immediately after start time, but hides old ones.
            const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
            const query: any = {
                status: { $ne: 'ended' },
                startTime: { $gte: twoHoursAgo }
            };

            if (filters) {
                if (filters.role === 'teacher') {
                    // Teachers see 'staff' meetings
                    query.type = 'staff';
                } else if (filters.role === 'parent') {
                    // Parents see 'parent' meetings OR 'class' meetings for their class
                    if (filters.classId) {
                        query.$or = [
                            { type: 'parent' },
                            { type: 'class', classId: filters.classId }
                        ];
                    } else {
                        query.type = 'parent';
                    }
                } else if (filters.role === 'student') {
                    // Students see 'class' meetings for their class
                    if (filters.classId) {
                        query.type = 'class';
                        query.classId = filters.classId;
                    } else {
                        return []; // No class ID, no meetings
                    }
                }
                // Admin sees all (no extra filter needed)
            }

            return await MeetingModel.find(query).sort({ startTime: 1 });
        } catch (error) {
            throw error;
        }
    }
}
