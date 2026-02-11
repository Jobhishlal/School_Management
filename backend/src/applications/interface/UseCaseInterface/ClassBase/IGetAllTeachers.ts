export interface IGetClassTeacher {
  execute(classId: string): Promise<{ teacherId: string; name: string; subjects: { name: string }[] }[]>;
}
