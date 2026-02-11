import { AssignmentEntity } from "../../../../domain/entities/Assignment";

export interface IGetTeacherAssignment {
  execute(teacherId: string): Promise<AssignmentEntity[]>;
}
