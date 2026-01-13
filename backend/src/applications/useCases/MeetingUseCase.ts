import { IMeetingUseCase } from "../../domain/UseCaseInterface/IMeetingUseCase";
import { Meeting } from "../../domain/entities/Meeting";
import { MeetingRepository } from "../../infrastructure/repositories/MeetingRepository";

export class MeetingUseCase implements IMeetingUseCase {
    private meetingRepository: MeetingRepository;

    constructor(meetingRepository: MeetingRepository) {
        this.meetingRepository = meetingRepository;
    }

    async createMeeting(meetingData: Meeting): Promise<Meeting> {
        return await this.meetingRepository.createMeeting(meetingData);
    }

    async validateJoin(meetingLink: string, userId: string, userRole: string, userClassId?: string): Promise<{ authorized: boolean; meeting?: Meeting; message?: string }> {
        const role = userRole.toLowerCase().trim();
        console.log(`Validating join for Link: ${meetingLink}, User: ${userId}, Role (raw): ${userRole}, Role (normalized): ${role}, ClassId: ${userClassId}`);

        const meeting = await this.meetingRepository.getMeetingByLink(meetingLink);

        if (!meeting) {
            console.log('Meeting not found');
            return { authorized: false, message: 'Meeting not found' };
        }

        console.log(`Meeting found: Type: ${meeting.type}, Status: ${meeting.status}, CreatedBy: ${meeting.createdBy}`);

        if (meeting.status === 'ended') {
            console.log('Meeting ended');
            return { authorized: false, message: 'Meeting has ended' };
        }

        // Allow super_admin and sub_admin as valid admins
        if (role === 'admin' || role === 'super_admin' || role === 'sub_admin') {
            console.log('User is admin/super_admin/sub_admin - Authorized');
            return { authorized: true, meeting };
        }

        if (meeting.type === 'staff') {
            if (role === 'teacher') {
                console.log('User is teacher - Authorized for staff meeting');
                return { authorized: true, meeting };
            }
            console.log('Staff meeting check failed');
            return { authorized: false, message: 'Only staff can join this meeting' };
        }

        if (meeting.type === 'parent') {
            if (role === 'parent') {
                console.log('User is parent - Authorized for parent meeting');
                return { authorized: true, meeting };
            }
            console.log('Parent meeting check failed');
            return { authorized: false, message: 'Only parents can join this meeting' };
        }

        if (meeting.type === 'class') {
            if (role === 'parent') {
                // Assuming userClassId is passed for parents. 
                if (userClassId && meeting.classId && userClassId.toString() === meeting.classId.toString()) {
                    console.log('Parent class match - Authorized');
                    return { authorized: true, meeting };
                }
                console.log('Parent class mismatch');
                return { authorized: false, message: 'This meeting is for a specific class' };
            }
            // Allow teachers to join class meetings as well
            if (role === 'teacher') {
                console.log('Teacher joining class meeting - Authorized');
                return { authorized: true, meeting };
            }
            console.log('Class meeting check failed');
            return { authorized: false, message: 'Only parents/teachers of the class can join' };
        }

        console.log('Fallthrough - Unauthorized');
        return { authorized: false, message: 'Unauthorized' };
    }

    async getMeetingByLink(link: string): Promise<Meeting | null> {
        return await this.meetingRepository.getMeetingByLink(link);
    }

    async getAllMeetings(): Promise<Meeting[]> {
        return await this.meetingRepository.getAllMeetings();
    }

    async getScheduledMeetings(role?: string, classId?: string): Promise<Meeting[]> {
        return await this.meetingRepository.getScheduledMeetings({ role, classId });
    }

    async updateStatus(meetingId: string, status: 'scheduled' | 'live' | 'ended'): Promise<Meeting | null> {
        return await this.meetingRepository.updateMeetingStatus(meetingId, status);
    }
}
