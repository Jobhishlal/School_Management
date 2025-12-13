import { AssignmentEntity } from "../../entities/Assignment";
import { AssignmentDTO } from "../../../applications/dto/AssignmentDTO ";
import { SubmitDTO } from "../../../applications/dto/AssignmentDTO ";
export interface TeacherTimetableInfo {
  classId: string;
  divisions: string[];
  subjects: string[];
}


export interface IAssignmentRepository {
    createAssignment(entity: AssignmentEntity): Promise<AssignmentEntity>;
    findByIdEntity(id: string): Promise<AssignmentEntity | null>;
    findTeacherSubjects(teacherId: string): Promise<string[]>; 
    findTimetable(classId: string, teacherId: string, subject: string): Promise<boolean>; 
    getTeacherTimeTableinfo(teacherId: string): Promise<TeacherTimetableInfo[]>;
    updateAssignmentDTO(id: string, update: Partial<AssignmentDTO>): Promise<AssignmentEntity | null>;
    getAssignmentsByTeacher(teacherId: string): Promise<AssignmentEntity[]>
    getAssignmetEachStudent(studentId:string):Promise<AssignmentEntity[]> 
    assignmentsubmit( assignmentId: string, studentId: string, fileUrl: string, fileName: string, studentDescription?: string ): Promise<SubmitDTO[]>;
}
