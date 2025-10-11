import { TimetableEntity } from "../../entities/TimeTableEntity";
import { CreateTimetableDTO } from "../../../applications/dto/CreateTImeTableDTO";
export interface IUPDATETIMETABLE{
    execute(dto:CreateTimetableDTO):Promise<TimetableEntity>
}