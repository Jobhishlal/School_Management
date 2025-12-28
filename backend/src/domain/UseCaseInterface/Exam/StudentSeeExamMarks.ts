
import { StudentExamResultResponse } from
  "../../../applications/dto/Exam/IGetStudentExamResultsUseCase";

export interface IGetStudentExamResultsUseCase {
  execute(
    studentId: string,
    classId: string
  ): Promise<StudentExamResultResponse>;
}
