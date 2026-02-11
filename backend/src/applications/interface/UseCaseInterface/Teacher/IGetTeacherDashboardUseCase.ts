
import { TeacherDashboardDTO } from "../../../applications/dto/TeacherDashboardDTO";

export interface IGetTeacherDashboardUseCase {
    execute(teacherId: string): Promise<TeacherDashboardDTO>;
}
