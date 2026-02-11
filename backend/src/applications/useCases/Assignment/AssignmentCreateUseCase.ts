
import { AssignmentEntity } from "../../../domain/entities/Assignment";
import { AssignmentDTO, IAssignmentDTO } from "../../dto/AssignmentDTO ";

import { IAssignmentRepository } from "../../interface/RepositoryInterface/Assignment/IAssignmentRepository ";
import { ICreateAssignment } from "../../interface/UseCaseInterface/Assignment/ICreateUseCase";
import { ValidationAssignment } from "../../validators/Assignment/AssignmentValidation";


export class AssignmentCreate  implements ICreateAssignment{
    constructor(private assignmentrepo:IAssignmentRepository){}
    async execute(dto: AssignmentDTO): Promise<AssignmentEntity> {
      ValidationAssignment(dto)

      const subjects = await this.assignmentrepo.findTeacherSubjects(dto.teacherId);
    if (!subjects.includes(dto.subject)) {
      throw new Error("Teacher cannot create assignment for this subject");
    }

    const existsInTimetable = await this.assignmentrepo.findTimetable(dto.classId, dto.teacherId, dto.subject);
    if (!existsInTimetable) {
      throw new Error("Class timetable does not contain this subject for teacher");
    }

    const entity = new AssignmentEntity(
      "",
      dto.Assignment_Title,
      dto.description,
      dto.subject,
      dto.classId,
      dto.Assignment_date,
      dto.Assignment_Due_Date,
       dto.attachments ? dto.attachments.map(a => ({
        url: a.url,
       filename: a.fileName,
       uploadedAt: a.uploadedAt
       })) : [], 
      dto.maxMarks,
      dto.teacherId
    );

    const saved = await this.assignmentrepo.createAssignment(entity);
    return saved;
  
        
    }
}