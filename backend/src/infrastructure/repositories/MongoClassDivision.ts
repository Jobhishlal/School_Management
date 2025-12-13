import { StudentModel } from "../database/models/StudentModel";
import { IClassDivisionRepository } from "../../domain/repositories/Classrepo/IClassDivisionview";
import { ClassModel } from "../database/models/ClassModel";
import { TeacherModel } from "../database/models/Teachers";
export class ClassDivisionRepository implements IClassDivisionRepository {
async getStudentsByClassAndDivision(className?: string, division?: string) {
  const students = await StudentModel.find()
    .populate({
      path: "classId",
      match: {
        ...(className ? { className } : {}),
        ...(division ? { division } : {}),
      },
      select: "className division classTeacher",
      populate: {
        path: "classTeacher",
        model: "Teacher", 
        select: "name",   
      },
    })
    .select("fullName studentId gender photos classId")
    .lean();

  const filteredStudents = students.filter((s) => s.classId !== null);

  const grouped: Record<string, any> = {};

  for (const student of filteredStudents) {
    const classInfo: any = student.classId;
    if (!classInfo) continue;

    const key = `${classInfo.className}-${classInfo.division}`;

    if (!grouped[key]) {
      grouped[key] = {
        classId: classInfo._id,
        className: classInfo.className,
        division: classInfo.division,
        students: [],
        classTeacher: classInfo.classTeacher
          ? {
              teacherId: classInfo.classTeacher._id,
              name:
                classInfo.classTeacher.name ||
                classInfo.classTeacher.fullName,
            }
          : null,
      };
    }

    grouped[key].students.push({
      studentId: student.studentId,
      fullName: student.fullName,
      gender: student.gender,
      photos: student.photos,
    });
  }

  return Object.values(grouped);
}


  async AssignClassTeacher(classId: string, teacherId: string): Promise<boolean> {

  const existingClass = await ClassModel.findById(classId);
  if (!existingClass) {
    throw new Error("Class not found");
  }


  if (existingClass.classTeacher) {
    throw new Error("This class already has a teacher assigned");
  }




  const updated = await ClassModel.findByIdAndUpdate(
    classId,
    { classTeacher: teacherId },
    { new: true }
  );

  return !!updated;
}



  async getClassTeacher(classId: string): Promise<{ teacherId: string; name: string } | null> {
    const cls = await ClassModel.findById(classId).populate({
      path: "classTeacher",
      select: "name",
    });

    if (!cls || !cls.classTeacher) return null;

    return {
      teacherId: (cls.classTeacher as any)._id.toString(),
      name: (cls.classTeacher as any).name,
    };
  }

  async getAllTeacher(): Promise<{ teacherId: string; name: string }[]> {
    return (await TeacherModel.find({}, "name").lean()).map((t) => ({
      teacherId: t._id.toString(),
      name: t.name,
    }));
  }
}

   
   

