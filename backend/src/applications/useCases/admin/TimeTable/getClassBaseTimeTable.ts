
import { TimetableEntity } from "../../../../domain/entities/TimeTableEntity";
import { ITimeTableRepository } from "../../../../domain/repositories/Admin/ITimeTableCreate";
import { IGETTIMETABLECLASS } from "../../../interface/UseCaseInterface/TimeTable/IGetTimeTableClassUseCase";

export class GetClassbaseTimeTable implements IGETTIMETABLECLASS{
    constructor(private readonly timetablerepo:ITimeTableRepository){}
    async execute(classId: string, division: string): Promise<TimetableEntity | null> {
        const data = await this.timetablerepo.getByClass(classId,division)
        return data
    }
}

