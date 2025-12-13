import { TimetableEntity } from "../../entities/TimeTableEntity";

export interface ITimeTableStudentview{
    execute(studentId: string):Promise<TimetableEntity|null>
}