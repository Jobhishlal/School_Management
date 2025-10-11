import { TimetableEntity } from "../../entities/TimeTableEntity";

export interface ITimeTableRepository{
    create(timetable:TimetableEntity):Promise<TimetableEntity>;
    getByClass(classId:string,division:string):Promise<TimetableEntity|null>;
    findById(id:string):Promise<TimetableEntity|null>;
    update(timetable:TimetableEntity):Promise<TimetableEntity>;
    delete(classId:string,division:string):Promise<void>
}