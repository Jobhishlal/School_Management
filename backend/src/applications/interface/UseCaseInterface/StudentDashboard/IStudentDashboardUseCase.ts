import { StudentDashboardDTO } from "../../../dto/StudentDashboard/StudentDashboardDTO";

export interface IStudentDashboardUseCase {
    execute(studentId: string): Promise<StudentDashboardDTO>;
}
