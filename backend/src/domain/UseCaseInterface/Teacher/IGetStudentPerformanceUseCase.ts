import { StudentPerformanceDTO } from "../../../applications/dto/StudentPerformanceDTO";

export interface IGetStudentPerformanceUseCase {
    execute(studentId: string): Promise<StudentPerformanceDTO>;
}
