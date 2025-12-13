export interface PeriodTime{
    startTime:string,
    endTime:string,
    subject:string,
    teacherId:string
}

export interface DaySchedule{
    day:string,
    periods:PeriodTime[]
}

export interface CreateTimeTableDTO{
    id?:string,
    classId:string,
    className:string,
    division:string,
    days:DaySchedule[]
}