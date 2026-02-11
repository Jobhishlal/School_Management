import { MeetingModel, IMeetingDocument } from "../database/mongoDB/models/MeetingModel";
import { Meeting } from "../../domain/entities/Meeting";

import { IMeetingRepository } from "../../applications/interface/RepositoryInterface/IMeetingRepository";

export class MeetingRepository implements IMeetingRepository {

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

            const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
            const query: any = {
                status: { $ne: 'ended' },
                startTime: { $gte: twoHoursAgo }
            };

            if (filters) {
                const role = filters.role;

                if (role === 'teacher') {

                    query.$or = [
                        { type: 'staff' },
                        { type: 'class' }
                    ];

                    query.type = 'staff';

                } else if (role === 'parent') {

                    if (filters.classId) {
                        query.$or = [
                            { type: 'parent' },
                            { type: 'class', classId: filters.classId }
                        ];
                    } else {
                        query.type = 'parent';
                    }
                } else if (role === 'student' || role === 'students') {

                    if (filters.classId) {
                        query.type = 'class';
                        query.classId = filters.classId;
                    } else {
                        return [];
                    }
                } else if (['admin', 'super_admin', 'sub_admin'].includes(role)) {

                } else {

                    return [];
                }
            } else {

                return [];
            }

            return await MeetingModel.find(query).sort({ startTime: 1 });
        } catch (error) {
            throw error;
        }
    }
}
