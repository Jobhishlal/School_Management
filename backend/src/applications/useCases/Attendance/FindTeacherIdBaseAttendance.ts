import { IFindStudentsByTeacherUseCase } from "../../interface/UseCaseInterface/IFindStudentsByTeacherUseCase";
import { StudentDetails } from "../../../domain/repositories/Admin/IStudnetRepository";
import { IAttandanceRepository } from "../../../domain/repositories/Attandance/IAttendanceRepository";
import { Students } from "../../../domain/entities/Students";

export class FindStudentsByTeacherUseCase implements IFindStudentsByTeacherUseCase {
  constructor(
    private readonly studentRepo: StudentDetails,
    private readonly attendanceRepo: IAttandanceRepository
  ) {}

  async execute(teacherId: string): Promise<Students[]> {
   
    const classData = await this.attendanceRepo.findclassTeacher(teacherId); 
    if (!classData) throw new Error("No class assigned to this teacher");


    const students = await this.studentRepo.findByStudentClassIdBase(classData._id);
    if (!students.length) throw new Error("No students found for this class");

    return students; 
  }
}
