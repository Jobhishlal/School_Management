import { StudentModel } from "../database/models/StudentModel";
import { IClassDivisionRepository } from "../../domain/repositories/Classrepo/IClassDivisionview";
import { ClassModel } from "../database/models/ClassModel";
import { TeacherModel } from "../database/models/Teachers";
export class ClassDivisionRepository implements IClassDivisionRepository {
  async getStudentsByClassAndDivision(className?: string, division?: string) {
 
    const classQuery: any = {};
    if (className) classQuery.className = className;
    if (division) classQuery.division = division;
  
    const allClasses = await ClassModel.find(classQuery)
      .populate("classTeacher", "name")
      .lean();

    console.log(`[DEBUG] Fetched ${allClasses.length} classes from DB. Query:`, classQuery);
    if (allClasses.length > 0) {
      console.log("[DEBUG] First class sample:", allClasses[0]);
    }

    const students = await StudentModel.find({ classId: { $ne: null } })
      .select("fullName studentId gender photos classId")
      .lean();

  
    const studentsByClassId: Record<string, any[]> = {};

    for (const student of students) {
      const cId = (student.classId as any).toString();
      if (!studentsByClassId[cId]) {
        studentsByClassId[cId] = [];
      }
      studentsByClassId[cId].push({
        studentId: student.studentId,
        fullName: student.fullName,
        gender: student.gender,
        photos: student.photos,
      });
    }

    const results = allClasses.map((cls) => {
      const cId = cls._id.toString();
      return {
        classId: cId,
        className: cls.className,
        division: cls.division,
        students: studentsByClassId[cId] || [], 
        classTeacher: cls.classTeacher
          ? {
            teacherId: (cls.classTeacher as any)._id,
            name: (cls.classTeacher as any).name,
          }
          : null,
      };
    });

    return results;
  }




  async AssignClassTeacher(classId: string, teacherId: string): Promise<{
    success: boolean;
    type: "assigned" | "reassigned";
  }> {
    const existingClass = await ClassModel.findById(classId);

    if (!existingClass) {
      throw new Error("Class not found");
    }

    const hadTeacher = !!existingClass.classTeacher;

    await ClassModel.findByIdAndUpdate(
      classId,
      { classTeacher: teacherId },
      { new: true }
    );

    return {
      success: true,
      type: hadTeacher ? "reassigned" : "assigned"
    };
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

  async getAllTeacher(): Promise<{ teacherId: string; name: string; subjects: { name: string }[] }[]> {
    return (await TeacherModel.find({}, "name subjects").lean()).map((t) => ({
      teacherId: t._id.toString(),
      name: t.name,
      subjects: t.subjects || []
    }));
  }
}




