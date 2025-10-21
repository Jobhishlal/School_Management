
import { IAssignmentRepository, TeacherTimetableInfo } from "../../../domain/repositories/Assignment/IAssignmentRepository ";
import { IGetAssignmentTeacher } from "../../../domain/UseCaseInterface/Assignment/IgetTimeTableTeacher";



export class GetTimeTableteacherList implements IGetAssignmentTeacher{
    constructor(private readonly assignrepo:IAssignmentRepository){}
   async execute(teacherId: string): Promise<TeacherTimetableInfo[]> {
       const data = await this.assignrepo.getTeacherTimeTableinfo(teacherId)
       return data
   }
}