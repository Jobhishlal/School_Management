import { IMeetingRepository } from "../../interface/RepositoryInterface/IMeetingRepository";
import { StudentDetails } from "../../interface/RepositoryInterface/Admin/IStudnetRepository";
import { IValidateMeetingJoinUseCase } from "../../interface/UseCaseInterface/Meeting/IValidateMeetingJoinUseCase";
import { Meeting } from "../../../domain/entities/Meeting";

export class ValidateMeetingJoinUseCase implements IValidateMeetingJoinUseCase {
    constructor(
        private readonly meetingRepository: IMeetingRepository,
        private readonly studentRepository: StudentDetails
    ) { }

    async execute(meetingLink: string, userId: string, userRole: string, userClassId?: string, userStudentId?: string): Promise<{ authorized: boolean; meeting?: Meeting; message?: string }> {
        const role = userRole.toLowerCase().trim();
        let classIdToCheck = userClassId;

        console.log(`Validating join for Link: ${meetingLink}, User: ${userId}, Role: ${role}, ClassId: ${userClassId}, StudentId: ${userStudentId}`);

        if (role === 'parent' && !classIdToCheck && userStudentId) {
            console.log(`Fetching classId for parent's student: ${userStudentId}`);
            try {
                const student = await this.studentRepository.findById(userStudentId);
                if (student && student.classId && typeof student.classId === 'object') {
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

                if (classIdToCheck && meeting.classId && classIdToCheck.toString() === meeting.classId.toString()) {
                    console.log('Parent class match - Authorized');
                    return { authorized: true, meeting };
                }
                console.log('Parent class mismatch');
                return { authorized: false, message: 'This meeting is for a specific class' };
            }

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
}
