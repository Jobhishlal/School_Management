import { TeacherDailyScheduleDTO } from "../../../dto/TeacherDailyScheduleDTO";

export interface IGetTeacherDailySchedule {
  execute(
    teacherId: string,
    day?: string
  ): Promise<TeacherDailyScheduleDTO[]>;
}