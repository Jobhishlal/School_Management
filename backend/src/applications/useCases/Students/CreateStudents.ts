import { Students } from "../../../domain/entities/Students";
import { IStudentAddUsecase } from "../../../domain/UseCaseInterface/IAddStudents";
import { StudentDetails } from "../../../domain/repositories/IStudnetRepository";
import { GenaratesStudent_id } from "../../../infrastructure/security/Student_idGen";
import { genaratePassword } from "../../../shared/constants/utils/TempPassGenarator";

export class StudentAddUseCase implements IStudentAddUsecase {
  constructor(private readonly studentRepo: StudentDetails) {}

  async execute(student: Students): Promise<Students> {
    const existing = await this.studentRepo.findByStudentId(student.id);

    if (existing) {
      throw new Error("Student with this ID already exists");
    }

    const student_id = GenaratesStudent_id()
    
    return this.studentRepo.create(student);
  }
}