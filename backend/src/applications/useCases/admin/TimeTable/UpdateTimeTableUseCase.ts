
import { TimetableEntity } from "../../../../domain/entities/TimeTableEntity";
import { ITimeTableRepository } from "../../../../domain/repositories/Admin/ITimeTableCreate";
import { IUPDATETIMETABLE } from "../../../../domain/UseCaseInterface/TimeTable/IUpdateTimeTable";
import { CreateTimetableDTO } from "../../../dto/CreateTImeTableDTO";

export class UpdateTimeTableUseCase implements IUPDATETIMETABLE{
    constructor(private readonly timetableRepo:ITimeTableRepository){}
    async execute(dto: CreateTimetableDTO): Promise<TimetableEntity> {
    const existing = await this.timetableRepo.findById(dto.id);
    if (!existing) throw new Error("Timetable not found");

    const updated = new TimetableEntity(
      dto.id,
      dto.classId,
      dto.division,
      dto.days
    );

    const result = await this.timetableRepo.update(updated);
    return result;
  }
}
