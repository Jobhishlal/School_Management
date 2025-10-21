import { AssignmentEntity } from "../../entities/Assignment";

export interface IGetTeacherAssignment {
  execute(teacherId: string): Promise<AssignmentEntity[]>;
}
