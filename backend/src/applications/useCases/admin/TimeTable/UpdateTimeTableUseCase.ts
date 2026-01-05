
import { TimetableEntity } from "../../../../domain/entities/TimeTableEntity";
import { ITimeTableRepository } from "../../../../domain/repositories/Admin/ITimeTableCreate";
import { IUPDATETIMETABLE } from "../../../../domain/UseCaseInterface/TimeTable/IUpdateTimeTable";
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
            dto.days.map(d => ({
                day: d.day,
                periods: d.periods.map(p => ({
                    startTime: p.startTime,
                    endTime: p.endTime,
                    subject: p.subject,
                    teacherId: p.teacherId
                })),
                breaks: (d.breaks || []).map(b => ({
                    startTime: b.startTime,
                    endTime: b.endTime,
                    name: b.name
                }))
            }))
        );

        return this.timetableRepo.update(updatedEntity);
    }

}
