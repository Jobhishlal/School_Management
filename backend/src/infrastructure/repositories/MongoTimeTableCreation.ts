import { TimetableModel } from "../database/models/Admin/TimeTableCraete";
import { ITimeTableRepository } from "../../domain/repositories/Admin/ITimeTableCreate";
import { TimetableEntity,DayScheduleEntity,PeriodEntity } from "../../domain/entities/TimeTableEntity";

export class MongoTimeTableCreate implements ITimeTableRepository{
    async create(timetable: TimetableEntity): Promise<TimetableEntity> {
        const doc = new TimetableModel({
            classId:timetable.classId,
            division:timetable.division,
            days:timetable.days.map(d=>({
                day:d.day,
                periods: d.periods.map(p => ({
                startTime: p.startTime,
                endTime: p.endTime,
                subject: p.subject,
                teacherId: p.teacherId
                }))
            }))
        })
        const saved = await doc.save()
        return new TimetableEntity(
            saved.id.toString(),
            saved.classId.toString(),
            saved.division,
            saved.days.map(d => new DayScheduleEntity(
           d.day,
           d.periods.map(p => new PeriodEntity(p.startTime, p.endTime, p.subject, p.teacherId.toString()))
         ))
        )
    }

    async getByClass(classId: string, division: string): Promise<TimetableEntity | null> {
        const doc = await TimetableModel.findOne({classId,division}).populate("days.periods.teacherId", "name");
         if(!doc)return null;
        return new TimetableEntity(
            doc.id.toString(),
            doc.classId.toString(),
            doc.division,
            doc.days.map(d => new DayScheduleEntity(
           d.day,
           d.periods.map(p => new PeriodEntity(p.startTime, p.endTime, p.subject, p.teacherId.toString()))
         ))
        )
    }
    async update(timetable: TimetableEntity): Promise<TimetableEntity> {
        const doc = await TimetableModel.findByIdAndUpdate(timetable.id,{
            classId:timetable.classId,
            division:timetable.division,
            days: timetable.days.map(d => ({
          day: d.day,
          periods: d.periods.map(p => ({
            startTime: p.startTime,
            endTime: p.endTime,
            subject: p.subject,
            teacherId: p.teacherId
          }))
        }))
        },{new:true})

        if(!doc){
            throw new Error("Time Table Not Found")
        }
         return new TimetableEntity(
            doc.id.toString(),
            doc.classId.toString(),
            doc.division,
            doc.days.map(d => new DayScheduleEntity(
           d.day,
           d.periods.map(p => new PeriodEntity(p.startTime, p.endTime, p.subject, p.teacherId.toString()))
         ))
        )
    }

    async findById(id: string): Promise<TimetableEntity | null> {
        const doc = await TimetableModel.findById(id).populate("days.periods.teacherId", "name")
        if(!doc)return null
        return new TimetableEntity(
            doc.id.toString(),
            doc.classId.toString(),
            doc.division,
           doc.days.map(
           (d) =>
             new DayScheduleEntity(
              d.day,
              d.periods.map(
              (p) => new PeriodEntity(p.startTime, p.endTime, p.subject, p.teacherId.toString())
           )
          )
          )
        )

    }


    async delete(classId: string, division: string): Promise<void> {
         await TimetableModel.findByIdAndDelete({classId,division})
    }
}