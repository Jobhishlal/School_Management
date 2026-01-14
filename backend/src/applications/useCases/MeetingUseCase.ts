import { IMeetingUseCase } from "../../domain/UseCaseInterface/IMeetingUseCase";
import { Meeting } from "../../domain/entities/Meeting";
import { MeetingRepository } from "../../infrastructure/repositories/MeetingRepository";
import { StudentDetails } from "../../domain/repositories/Admin/IStudnetRepository";

export class MeetingUseCase implements IMeetingUseCase {
    private meetingRepository: MeetingRepository;
    private studentRepository: StudentDetails;

    constructor(meetingRepository: MeetingRepository, studentRepository: StudentDetails) {
        this.meetingRepository = meetingRepository;
        this.studentRepository = studentRepository;
    }

    async createMeeting(meetingData: Meeting): Promise<Meeting> {
        if (!meetingData.link) {
            meetingData.link = Math.random().toString(36).substring(2, 12);
        }

        const startTime = new Date(meetingData.startTime);
        const now = new Date();

        if (startTime < now) {
            throw new Error('Meeting cannot be scheduled in the past');
        }

        return await this.meetingRepository.createMeeting(meetingData);
    }

    async validateJoin(meetingLink: string, userId: string, userRole: string, userClassId?: string, userStudentId?: string): Promise<{ authorized: boolean; meeting?: Meeting; message?: string }> {
        const role = userRole.toLowerCase().trim();
        let classIdToCheck = userClassId;

        console.log(`Validating join for Link: ${meetingLink}, User: ${userId}, Role: ${role}, ClassId: ${userClassId}, StudentId: ${userStudentId}`);

        // Logic moved from Controller: Fetch classId for parent if missing
        if (role === 'parent' && !classIdToCheck && userStudentId) {
            console.log(`Fetching classId for parent's student: ${userStudentId}`);
            try {
                const student = await this.studentRepository.findById(userStudentId);
                if (student && student.classId && typeof student.classId === 'object') {
                    // CAUTION: partial Student entity or populated field? 
                    // The interface says Students entity. 
                    // In the repo mapToDomain, classId is mapped to an object { id, className... } if populated.
                    // But strictly speaking, we need the ID string.
                    // Let's assume the repo handles this or checks the object.
                    // Checking repo: mapped to { id: ... } if populated.
                    classIdToCheck = (student.classId as any).id;
                    console.log(`Found classId for student: ${classIdToCheck}`);
                }
            } catch (err) {
                console.error("Error fetching student for parent validation", err);
            }
        }

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

        if (meeting.type === 'parent' || meeting.type === 'PTA' || meeting.type === 'pta') {
            if (role === 'parent' || role === 'teacher') {
                console.log('User is parent/teacher - Authorized for Parent/PTA meeting');
                return { authorized: true, meeting };
            }
            console.log('Parent/PTA meeting check failed');
            return { authorized: false, message: 'Only parents and teachers can join this meeting' };
        }

        if (meeting.type === 'class') {
            if (role === 'parent') {
                // Assuming userClassId is passed for parents. 
                // Assuming userClassId is passed for parents. 
                if (classIdToCheck && meeting.classId && classIdToCheck.toString() === meeting.classId.toString()) {
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
