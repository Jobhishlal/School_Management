import { StudentDashboardDTO } from "../../../applications/dto/StudentDashboard/StudentDashboardDTO";

export interface IStudentDashboardUseCase {
    execute(studentId: string): Promise<StudentDashboardDTO>;
}
