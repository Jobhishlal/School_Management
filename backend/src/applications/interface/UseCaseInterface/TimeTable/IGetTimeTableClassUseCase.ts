import { TimetableEntity } from "../../../../domain/entities/TimeTableEntity";

export interface IGETTIMETABLECLASS{
    execute(classId:string,division:string):Promise<TimetableEntity|null>
}