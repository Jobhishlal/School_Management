import { TimetableEntity } from "../../../../domain/entities/TimeTableEntity";

export interface ITimeTableStudentview{
    execute(studentId: string):Promise<TimetableEntity|null>
}