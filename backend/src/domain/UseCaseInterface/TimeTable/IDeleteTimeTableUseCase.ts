import { TimetableEntity } from "../../entities/TimeTableEntity";


export interface IDeleteTimeTable {
  execute(classId:string,division:string):Promise<void>
}