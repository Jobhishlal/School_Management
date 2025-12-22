import { TakeAttendance } from "../../dto/Attendance/TakeAttendanceDTO";
import { AttendanceEntity } from "../../../domain/entities/AttandanceEntity";
import { IAttendanceCreateUseCase } from "../../../domain/UseCaseInterface/Attandance/ITakeAttendanceUseCase";
import { IAttandanceRepository } from "../../../domain/repositories/Attandance/IAttendanceRepository";
import { StudentDetails } from "../../../domain/repositories/Admin/IStudnetRepository";
import { IClassRepository } from "../../../domain/repositories/Classrepo/IClassRepository";
import { ValidateAttendanceCreate } from "../../validators/AttendanceValidation/AttendanceValidation";

export class AttendanceCreateUseCase implements IAttendanceCreateUseCase {
  constructor(
    private attendanceRepo: IAttandanceRepository,
    private classRepo: IClassRepository,
    private studentRepo: StudentDetails
  ) {}

  async execute(data: TakeAttendance): Promise<AttendanceEntity> {
    ValidateAttendanceCreate(data);

    const { classId, teacherId, attendance, session } = data;

    if (!session) {
      throw new Error("Session is required");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const classData = await this.classRepo.findById(classId.toString());
    if (!classData) throw new Error("Class not found");

    if (!classData.classTeacher) {
      throw new Error("No teacher assigned to this class");
    }

    if (String(classData.classTeacher) !== String(teacherId)) {
      throw new Error("You are not authorized to take attendance for this class");
    }

    const students = await this.studentRepo.findByClassId(classId.toString());
    if (!students.length) {
      throw new Error("No students found for this class");
    }

    const validStudentIds = students.map(s => s.id);

    for (const item of attendance) {
      if (!validStudentIds.includes(item.studentId)) {
        throw new Error(`Invalid student in attendance list: ${item.studentId}`);
      }
    }

    const existing = await this.attendanceRepo.findByDateSession(
      classId,
      today,
      session
    );

    if (existing) {
      throw new Error(`${session} attendance already taken for today`);
    }

    return await this.attendanceRepo.create({
      classId,
      teacherId,
      attendance,
      date: today,
      session,
    });
  }
}
