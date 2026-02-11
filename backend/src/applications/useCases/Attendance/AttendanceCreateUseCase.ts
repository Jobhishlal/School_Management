import { TakeAttendance } from "../../dto/Attendance/TakeAttendanceDTO";
import { AttendanceEntity } from "../../../domain/entities/AttandanceEntity";
import { IAttendanceCreateUseCase } from "../../interface/UseCaseInterface/Attandance/ITakeAttendanceUseCase";
import { IAttandanceRepository } from "../../../domain/repositories/Attandance/IAttendanceRepository";
import { StudentDetails } from "../../../domain/repositories/Admin/IStudnetRepository";
import { IClassRepository } from "../../../domain/repositories/Classrepo/IClassRepository";
import { ValidateAttendanceCreate } from "../../validators/AttendanceValidation/AttendanceValidation";
import { SendEMail } from "../../../infrastructure/providers/EmailService";
import { IParentRepository } from "../../../domain/repositories/IParentsRepository";
import { EMAIL_SUBJECTS, EmailTemplates } from "../../../shared/constants/utils/Email/emailTemplates";

export class AttendanceCreateUseCase implements IAttendanceCreateUseCase {
  constructor(
    private attendanceRepo: IAttandanceRepository,
    private classRepo: IClassRepository,
    private studentRepo: StudentDetails,
    private parentRepo: IParentRepository
  ) { }

  async execute(data: TakeAttendance): Promise<AttendanceEntity> {
    ValidateAttendanceCreate(data);

    const { classId, teacherId, attendance, session } = data;

    if (!session) {
      throw new Error("Session is required");
    }

    // Date Logic: Force UTC Midnight to avoid timezone offsets
    // Uses the provided date or defaults to now, then constructs a clean UTC date object
    const inputDate = data.date ? new Date(data.date) : new Date();
    const today = new Date(Date.UTC(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate()));

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

    const result = await this.attendanceRepo.create({
      classId,
      teacherId,
      attendance,
      date: today,
      session,
    });


    const absentStudents = attendance.filter(
      (a) => a.status === "Absent" || a.status === "Leave"
    );

    if (absentStudents.length > 0) {
      for (const item of absentStudents) {
        try {

          const student = students.find((s) => s.id === item.studentId);
          if (student && student.parentId) {
            const parent = await this.parentRepo.getById(student.parentId);

            if (parent && parent.email) {
              const subject = `${EMAIL_SUBJECTS.STUDENT_ABSENT} - ${student.fullName}`;

              const message = EmailTemplates.studentAbsent({
                studentName: student.fullName,
                status: item.status,
                session,
                date: today.toLocaleDateString(),
              });

              await SendEMail(parent.email, subject, message);
              console.log(`Email sent to ${parent.email} for student ${student.fullName}`);
            }

          }
        } catch (emailError) {
          console.error(`Failed to send email for student ${item.studentId}:`, emailError);

        }
      }
    }

    return result;
  }
}
