import { StudentPerformanceDTO } from "../../../applications/useCases/Teacher/GetStudentPerformanceUseCase";

export interface IGetStudentPerformanceUseCase {
    execute(studentId: string): Promise<StudentPerformanceDTO>;
}
