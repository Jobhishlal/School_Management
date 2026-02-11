import { ICreateTimeTable } from "../../../interface/UseCaseInterface/TimeTable/ICreateTimeTable";
import { TimetableEntity, DayScheduleEntity, PeriodEntity, BreakEntity } from "../../../../domain/entities/TimeTableEntity";
import { ITimeTableRepository } from "../../../interface/RepositoryInterface/Admin/ITimeTableCreate";
import { CreateTimetableDTO } from "../../../dto/CreateTImeTableDTO";

export class CreateTimeTable implements ICreateTimeTable {
  constructor(private readonly timetableRepo: ITimeTableRepository) { }

  async execute(dto: CreateTimetableDTO): Promise<TimetableEntity> {

    await this.timetableRepo.validateAndCheck(dto);

    const timetable = new TimetableEntity(
      "",
      dto.classId,
      dto.className,
      dto.division,
      dto.days.map(
        d =>
          new DayScheduleEntity(
            d.day,
            d.periods.map(
              p => new PeriodEntity(p.startTime, p.endTime, p.subject, p.teacherId)
            ),
            (d.breaks || []).map(b => new BreakEntity(b.startTime, b.endTime, b.name))
          )
      )
    );

    return await this.timetableRepo.create(timetable);
  }
}
