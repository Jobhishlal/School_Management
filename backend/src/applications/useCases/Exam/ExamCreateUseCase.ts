import { IExamCreateRepository } from "../../../domain/UseCaseInterface/Exam/IExamCreateUseCase";
import { CreateExamDTO } from "../../dto/Exam/CreateExamDTO";
import { ExamEntity } from "../../../domain/entities/Exam/ExamEntity";
import { IExamRepository } from "../../../domain/repositories/Exam/IExamRepoInterface";
import { IClassRepository } from "../../../domain/repositories/Classrepo/IClassRepository";
import { ITeacherCreate } from "../../../domain/repositories/TeacherCreate";
import { ValidateExamCreate } from "../../validators/Examvalidation/ExamCreateValidation";
import { ExamErrorMessages } from "../../../shared/constants/ExamErrorMessages";

export class ExamCreateUseCase implements IExamCreateRepository {
  constructor(
    private examRepo: IExamRepository,
    private classRepo: IClassRepository,
    private teacherRepo: ITeacherCreate
  ) { }

  async execute(data: CreateExamDTO): Promise<ExamEntity> {
    ValidateExamCreate(data)

    const examDate = new Date(data.examDate);
    const currentDate = new Date();

    
    examDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    if (examDate < currentDate) {
      throw new Error(ExamErrorMessages.EXAM_DATE_CANNOT_BE_IN_PAST);
    }

    const classData = await this.classRepo.findById(data.classId);
    if (!classData) {

      throw new Error(ExamErrorMessages.CLASS_NOT_FOUND);
    }

    const teacher = await this.teacherRepo.findById(data.teacherId);
    if (!teacher) {
      throw new Error(ExamErrorMessages.TEACHER_NOT_FOUND);
    }

    const subjectExists = teacher.subjects

    if (!subjectExists) {
      throw new Error(ExamErrorMessages.TEACHER_NOT_ASSIGNED_TO_SUBJECT);
    }


    return await this.examRepo.createExam(data);

  }
}
