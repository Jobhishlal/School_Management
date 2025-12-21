import { Types } from "mongoose";
import { TakeAttendance } from "../../dto/Attendance/TakeAttendanceDTO";
import { AttendanceEntity } from "../../../domain/entities/AttandanceEntity";
import { IAttendanceCreateUseCase } from "../../../domain/UseCaseInterface/Attandance/ITakeAttendanceUseCase";
import { IAttandanceRepository } from "../../../domain/repositories/Attandance/IAttendanceRepository";
import { StudentDetails } from "../../../domain/repositories/Admin/IStudnetRepository";
import { IClassRepository } from "../../../domain/repositories/Classrepo/IClassRepository";
import { getCurrentSession } from "../../../shared/constants/utils/getAttendanceSession";

export class AttendanceCreateUseCase implements IAttendanceCreateUseCase {
  constructor(
    private attendanceRepo: IAttandanceRepository,
    private classRepo: IClassRepository,
    private studentRepo: StudentDetails
  ) {}


  
 async execute(data: TakeAttendance): Promise<AttendanceEntity> {
    console.log("reached here")
  const { classId, teacherId, attendance, date, session } = data;
  console.log("data",data.classId)

  const classData = await this.classRepo.findById(classId.toString());
  console.log("classData",classData)
  if (!classData) throw new Error("Class not found");

   console.log("class teacher",classData.classTeacher)
  if (!classData.classTeacher) {
    throw new Error(
      `No teacher is assigned to the class "${classData.className} ${classData.division}"`
    );
  }

  if (String(classData.classTeacher) !== String(teacherId)) {
    throw new Error("You are not authorized to take attendance for this class");
  }


  const students = await this.studentRepo.findByClassId(classId.toString());
  console.log(students)
  if (!students || students.length === 0) {
    throw new Error("No students found for this class");
  }

  const validStudentIds = students.map((s) => String(s.id));
  console.log(validStudentIds)
  for (const item of attendance) {
    if (!validStudentIds.includes(String(item.studentId))) {
      throw new Error(`Invalid student in attendance list: ${item.studentId}`);
    }
  }
  const existing = await this.attendanceRepo.findByDateSession(
    classId,
    date,
    session
  );
  if (existing) {
    throw new Error(
      `Attendance already taken for ${classData.className} ${classData.division} (${session})`
    );
  }

  const createdAttendance = await this.attendanceRepo.create(data);

  return createdAttendance;
}

}
