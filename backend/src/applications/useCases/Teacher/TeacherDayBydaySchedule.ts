import { IGetTeacherDailySchedule } from "../../../domain/UseCaseInterface/TimeTable/IGetTeacherDailySchedule";
import { ITimeTableRepository } from "../../../domain/repositories/Admin/ITimeTableCreate";
import { TeacherDailyScheduleDTO } from "../../dto/TeacherDailyScheduleDTO";

export class TeacherDaybydayschedule implements IGetTeacherDailySchedule{
    constructor(private readonly _repo:ITimeTableRepository){}
    
     async execute(teacherId: string, day?: string): Promise<TeacherDailyScheduleDTO[]> {
         
        if(!teacherId){
            throw new Error('TeacherId deos not get it ')
        }
        const result = await this._repo.getTeacherDailySchedule(teacherId,day)
        return result
     }
}