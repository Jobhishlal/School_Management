export interface IClassDivisionRepository {

  getStudentsByClassAndDivision(
    className?: string,
    division?: string
  ): Promise<
    {
      classId: string;
      className: string;
      division: string;
      classTeacher?: {
        teacherId: string;
        name: string;
      } | null;
      students: {
        studentId: string;
        fullName: string;
        gender: string;
        photos: { url: string; filename: string }[];
      }[];
    }[]
  >;


  AssignClassTeacher(
    classId: string,
    teacherId: string
  ): Promise<{ success: boolean; type: "assigned" | "reassigned" }>;
  getClassTeacher(classId: string): Promise<{ teacherId: string; name: string } | null>;
  getAllTeacher(): Promise<{ teacherId: string; name: string; subjects: { name: string }[] }[]>

}
