
import { StudentExamResultResponse } from
  "../../../dto/Exam/IGetStudentExamResultsUseCase";

export interface IGetStudentExamResultsUseCase {
  execute(
    studentId: string,
    classId: string
  ): Promise<StudentExamResultResponse>;
}
