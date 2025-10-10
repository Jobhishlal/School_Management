import { CreateTimetableDTO } from "../../../applications/dto/CreateTImeTableDTO";
import { TimetableEntity } from "../../entities/TimeTableEntity";


export interface ICreateTimeTable{
    execute(dto:CreateTimetableDTO):Promise<TimetableEntity>
}