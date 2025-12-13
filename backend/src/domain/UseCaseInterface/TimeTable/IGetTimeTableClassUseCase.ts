import { TimetableEntity } from "../../entities/TimeTableEntity";

export interface IGETTIMETABLECLASS{
    execute(classId:string,division:string):Promise<TimetableEntity|null>
}