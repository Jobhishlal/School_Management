import { CreateTimetableDTO } from "../../applications/dto/CreateTImeTableDTO";
import { TimetableResponseDTO } from "../../applications/dto/TimeTableResponseDTO";
import { TimetableEntity, DayScheduleEntity, PeriodEntity } from "../../domain/entities/TimeTableEntity";


export const creatTimeTableDTOToEntity = (dto: CreateTimetableDTO): TimetableEntity => {
  return new TimetableEntity(
    "",
    dto.classId,
    dto.className,
    dto.division,
    dto.days.map(d => new DayScheduleEntity(
      d.day,
      d.periods.map(da => new PeriodEntity(da.startTime, da.endTime, da.subject, da.teacherId))
    ))
  )
}

export const timetableEntityToDTO = (
  entity: TimetableEntity,
  className: string,
  teacherMap: Record<string, string>
): TimetableResponseDTO => {
  return {
    className,
    division: entity.division,
    days: entity.days.map(d => ({
      day: d.day,
      periods: d.periods.map(p => ({
        startTime: p.startTime,
        endTime: p.endTime,
        subject: p.subject,
        teacherName: teacherMap[p.teacherId] || "Unknown"
      }))
    }))
  };
};