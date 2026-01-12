import { TeacherDailyScheduleDTO } from "../../../applications/dto/TeacherDailyScheduleDTO";

export interface IGetTeacherDailySchedule {
  execute(
    teacherId: string,
    day?: string
  ): Promise<TeacherDailyScheduleDTO[]>;
}