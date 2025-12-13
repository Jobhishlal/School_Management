import { TimetableEntity } from "../../entities/TimeTableEntity";
import { CreateTimetableDTO } from "../../../applications/dto/CreateTImeTableDTO";
import { Students } from "../../entities/Students";


export interface ITimeTableRepository{
    create(timetable:TimetableEntity):Promise<TimetableEntity>;
    validateAndCheck(dto: CreateTimetableDTO): Promise<void>;
    getByClass(classId:string,division:string):Promise<TimetableEntity|null>;
    findById(id:string):Promise<TimetableEntity|null>;
    update(timetable:TimetableEntity):Promise<TimetableEntity>;
    delete(id:string):Promise<void>
    viewtimetable(classId: string): Promise<TimetableEntity | null>;
    getStudentTimeTable(studentId: string): Promise<TimetableEntity | null>

}