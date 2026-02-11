import { TimetableEntity } from "../../../../domain/entities/TimeTableEntity";
import { CreateTimetableDTO } from "../../../dto/CreateTImeTableDTO";
export interface IUPDATETIMETABLE{
    execute(dto:CreateTimetableDTO):Promise<TimetableEntity>
}