export interface IClassDivision {
  execute(): Promise<
    Record<
      string,
      {
        classId: string;
        className: string;
        division: string;
        classTeacher?: {
          teacherId: string;
          name: string;
        } | null;
        students: {
          fullName: string;
          studentId: string;
          gender: string;
          photos: {
            url: string;
            filename: string;
          }[];
        }[];
      }
    >
  >;
}
