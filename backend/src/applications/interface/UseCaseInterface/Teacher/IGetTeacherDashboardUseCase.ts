
import { TeacherDashboardDTO } from "../../../dto/TeacherDashboardDTO";

export interface IGetTeacherDashboardUseCase {
    execute(teacherId: string): Promise<TeacherDashboardDTO>;
}
