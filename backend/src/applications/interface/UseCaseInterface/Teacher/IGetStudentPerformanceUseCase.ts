import { StudentPerformanceDTO } from "../../../dto/StudentPerformanceDTO";

export interface IGetStudentPerformanceUseCase {
    execute(studentId: string): Promise<StudentPerformanceDTO>;
}
