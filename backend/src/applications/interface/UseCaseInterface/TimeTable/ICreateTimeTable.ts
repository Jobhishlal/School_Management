import { CreateTimetableDTO } from "../../../dto/CreateTImeTableDTO";
import { TimetableEntity } from "../../../../domain/entities/TimeTableEntity";


export interface ICreateTimeTable{
    execute(dto:CreateTimetableDTO):Promise<TimetableEntity>
}