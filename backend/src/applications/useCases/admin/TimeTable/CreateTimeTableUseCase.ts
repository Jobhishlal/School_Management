import { ICreateTimeTable } from "../../../../domain/UseCaseInterface/TimeTable/ICreateTimeTable";
import { TimetableEntity } from "../../../../domain/entities/TimeTableEntity";
import { ITimeTableRepository } from "../../../../domain/repositories/Admin/ITimeTableCreate";
import { CreateTimetableDTO } from "../../../dto/CreateTImeTableDTO";

export class CreateTimeTable implements ICreateTimeTable{
    constructor(private readonly createrepo:ITimeTableRepository){}
    async execute(dto: CreateTimetableDTO): Promise<TimetableEntity> {
     const timetable = new TimetableEntity("", dto.classId, dto.division, dto.days);
    return await this.createrepo.create(timetable);
    }
}