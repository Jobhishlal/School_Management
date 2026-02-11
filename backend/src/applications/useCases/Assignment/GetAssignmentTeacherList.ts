
import { IAssignmentRepository, TeacherTimetableInfo } from "../../interface/RepositoryInterface/Assignment/IAssignmentRepository ";
import { IGetAssignmentTeacher } from "../../interface/UseCaseInterface/Assignment/IgetTimeTableTeacher";



export class GetTimeTableteacherList implements IGetAssignmentTeacher {
    constructor(private readonly assignrepo: IAssignmentRepository) { }
    async execute(teacherId: string): Promise<{ timetable: TeacherTimetableInfo[], leaveBalance: { sickLeave: number, casualLeave: number }, teacherProfile: { name: string, image?: string } }> {
        const data = await this.assignrepo.getTeacherTimeTableinfo(teacherId)
        return data
    }
}