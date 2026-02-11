export interface IAssignStudentToClassDivision {
  execute(studentId: string | string[], classId: string): Promise<boolean>;
}
