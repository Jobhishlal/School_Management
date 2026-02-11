import { TimetableEntity, DayScheduleEntity, PeriodEntity, BreakEntity } from "../../../../domain/entities/TimeTableEntity";
import { ITimeTableRepository } from "../../../interface/RepositoryInterface/Admin/ITimeTableCreate";
import { IUPDATETIMETABLE } from "../../../interface/UseCaseInterface/TimeTable/IUpdateTimeTable";
import { CreateTimetableDTO } from "../../../dto/CreateTImeTableDTO";

export class UpdateTimeTableUseCase implements IUPDATETIMETABLE {
    constructor(private readonly timetableRepo: ITimeTableRepository) { }
    async execute(dto: CreateTimetableDTO): Promise<TimetableEntity> {

        const existed = await this.timetableRepo.getByClass(dto.classId, dto.division);
        if (!existed) {
            throw new Error("Timetable does not exist");
        }

        const updatedEntity = new TimetableEntity(
            existed.id,
            dto.classId,
            dto.className,
            dto.division,
            dto.days.map(d => new DayScheduleEntity(
                d.day,
                d.periods.map(p => new PeriodEntity(
                    p.startTime,
                    p.endTime,
                    p.subject,
                    p.teacherId
                )),
                (d.breaks || []).map(b => new BreakEntity(
                    b.startTime,
                    b.endTime,
                    b.name
                ))
            ))
        );

        return this.timetableRepo.update(updatedEntity);
    }

}
