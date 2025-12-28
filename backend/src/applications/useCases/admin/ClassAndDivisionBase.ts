import { IClassDivision } from "../../../domain/UseCaseInterface/ClassBase/ClassAndDivision";
import { IClassDivisionRepository } from "../../../domain/repositories/Classrepo/IClassDivisionview";


export class ClassAndDivision implements IClassDivision {
  constructor(private readonly classRepo: IClassDivisionRepository) { }
  async execute(): Promise<Record<string, { classId: string; className: string; division: string; classTeacher?: { teacherId: string; name: string; } | null; students: { fullName: string; studentId: string; gender: string; photos: { url: string; filename: string; }[]; }[]; }>> {
    console.log(">>>>>>>> DEBUG: ClassAndDivision.execute EXECUTING <<<<<<<<");
    const datacheck = await this.classRepo.getStudentsByClassAndDivision();

    const result: Record<string, any> = {};

    datacheck.forEach((cls) => {
      const key = `${cls.className}-${cls.division}`;
      result[key] = {
        classId: cls.classId,
        className: cls.className,
        division: cls.division,
        students: cls.students.map((s) => ({
          fullName: s.fullName,
          studentId: s.studentId,
          gender: s.gender,
        })),

        classTeacher: cls.classTeacher
          ? {
            teacherId: cls.classTeacher.teacherId,
            name: cls.classTeacher.name,
          }
          : null,
      };
    });

    return result;
  }
}



