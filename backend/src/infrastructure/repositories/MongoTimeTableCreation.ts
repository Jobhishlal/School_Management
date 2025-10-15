import { TimetableModel } from "../database/models/Admin/TimeTableCraete";
import { ITimeTableRepository } from "../../domain/repositories/Admin/ITimeTableCreate";
import { TimetableEntity, DayScheduleEntity, PeriodEntity } from "../../domain/entities/TimeTableEntity";
import { TeacherModel } from "../database/models/Teachers";
import { ClassModel } from "../database/models/ClassModel";
import { CreateTimetableDTO } from "../../applications/dto/CreateTImeTableDTO";
import { StudentModel } from "../database/models/StudentModel";
import { validateTimetable } from "../../applications/validators/Timetable/TimetableValidator";

import mongoose from "mongoose";


export class MongoTimeTableCreate implements ITimeTableRepository {

   async validateAndCheck(dto: CreateTimetableDTO): Promise<void> {
    const cls = await ClassModel.findById(dto.classId);
    if (!cls) throw new Error("Class not found");

      for (const day of dto.days) {
         for (const period of day.periods) {
          if (!period.teacherId || period.teacherId === "") continue;

           const teacher = await TeacherModel.findById(period.teacherId);
           if (!teacher) throw new Error(`Teacher not found: ${period.teacherId}`);

        
     }
   }

  }

  

async create(timetable: TimetableEntity): Promise<TimetableEntity> {


  await validateTimetable(timetable)
  
  const classObjectId = new mongoose.Types.ObjectId(timetable.classId);


  let existing = await TimetableModel.findOne({ classId: classObjectId });
  if (existing) throw new Error("Timetable already exists for this class");

  const daysData = timetable.days.length > 0 ? timetable.days : [
    { day: "Monday", periods: [] },
    { day: "Tuesday", periods: [] },
    { day: "Wednesday", periods: [] },
    { day: "Thursday", periods: [] },
    { day: "Friday", periods: [] },
  ];

  const doc = new TimetableModel({
    classId: classObjectId,
    className: timetable.className,
    division: timetable.division,
    days: daysData.map(d => ({
      day: d.day,
      periods: d.periods.map(p => ({
        startTime: p.startTime,
        endTime: p.endTime,
        subject: p.subject,
        teacherId: new mongoose.Types.ObjectId(p.teacherId),
      }))
    }))
  });

  const saved = await doc.save();
  await saved.populate("classId", "className division");
  await saved.populate("days.periods.teacherId", "name");

  return new TimetableEntity(
    saved.id.toString(),
    (saved.classId as any)._id.toString(),
    (saved.classId as any).className,
    (saved.classId as any).division,
    saved.days.map(d => new DayScheduleEntity(
      d.day,
      d.periods.map(p => new PeriodEntity(
        p.startTime,
        p.endTime,
        p.subject,
        (p.teacherId as any)?._id?.toString() || p.teacherId.toString()
      ))
    ))
  );
}



  // async getByClass(classId: string, division: string): Promise<TimetableEntity | null> {
  //   const doc = await TimetableModel.findOne({ classId, division })
  //     .populate("classId", "className division")
  //     .populate("days.periods.teacherId", "name");

  //   if (!doc) return null;

  //   return new TimetableEntity(
  //     doc.id.toString(),
  //     (doc.classId as any)._id.toString(),
  //     (doc.classId as any).division,
  //      (doc.className as any).className,
  //     doc.days.map(d => new DayScheduleEntity(
  //       d.day,
  //       d.periods.map(p => new PeriodEntity(
  //         p.startTime,
  //         p.endTime,
  //         p.subject,
  //         (p.teacherId as any)._id?.toString() || p.teacherId.toString()
  //       ))
  //     ))
  //   );
  // }


  async getByClass(classId: string, division: string): Promise<TimetableEntity | null> {
  if (!classId) return null; 

  const doc = await TimetableModel.findOne({ 
      classId: new mongoose.Types.ObjectId(classId),
      division
    })
    .populate("classId", "className division")
    .populate("days.periods.teacherId", "name");

  if (!doc) return null;

  return new TimetableEntity(
    doc.id.toString(),
    (doc.classId as any)._id.toString(),
    (doc.classId as any).className,
    (doc.classId as any).division,
    doc.days.map(d => new DayScheduleEntity(
      d.day,
      d.periods.map(p => new PeriodEntity(
        p.startTime,
        p.endTime,
        p.subject,
        (p.teacherId as any)?._id?.toString() || p.teacherId.toString()
      ))
    ))
  );
}

 
  async update(timetable: TimetableEntity): Promise<TimetableEntity> {
    await validateTimetable(timetable)
    const doc = await TimetableModel.findByIdAndUpdate(
      timetable.id,
      {
        classId: timetable.classId,
        division: timetable.division,
        days: timetable.days.map(d => ({
          day: d.day,
          periods: d.periods.map(p => ({
            startTime: p.startTime,
            endTime: p.endTime,
            subject: p.subject,
            teacherId: p.teacherId
          }))
        }))
      },
      { new: true }
    )
      .populate("classId", "className division")
      .populate("days.periods.teacherId", "name");

    if (!doc) throw new Error("Time Table Not Found");

    return new TimetableEntity(
      doc.id.toString(),
      (doc.classId as any)._id.toString(),
       (doc.className as any).className,
      (doc.classId as any).division,
      doc.days.map(d => new DayScheduleEntity(
        d.day,
        d.periods.map(p => new PeriodEntity(
          p.startTime,
          p.endTime,
          p.subject,
          (p.teacherId as any)._id?.toString() || p.teacherId.toString()
        ))
      ))
    );
  }


  async findById(id: string): Promise<TimetableEntity | null> {
    const doc = await TimetableModel.findById(id)
      .populate("classId", "className division")
      .populate("days.periods.teacherId", "name");

    if (!doc) return null;

    return new TimetableEntity(
      doc.id.toString(),
      (doc.classId as any)._id.toString(),
       (doc.className as any).className,
      (doc.classId as any).division,
      doc.days.map(d => new DayScheduleEntity(
        d.day,
        d.periods.map(p => new PeriodEntity(
          p.startTime,
          p.endTime,
          p.subject,
          (p.teacherId as any)._id?.toString() || p.teacherId.toString()
        ))
      ))
    );
  }

 
  async delete(id: string): Promise<void> {
    await TimetableModel.deleteOne({ _id: id });
  }


   async viewtimetable(classId: string): Promise<TimetableEntity | null> {
    const doc = await TimetableModel.findOne({ classId: new mongoose.Types.ObjectId(classId) })
      .populate("classId", "className division")
      .populate("days.periods.teacherId", "name")
      .lean();

    if (!doc) return null;

    return new TimetableEntity(
      doc._id.toString(),
      (doc.classId as any)._id.toString(),
      (doc.classId as any).className,
      (doc.classId as any).division,
      doc.days.map(d =>
        new DayScheduleEntity(
          d.day,
          d.periods.map(p =>
            new PeriodEntity(
              p.startTime,
              p.endTime,
              p.subject,
              (p.teacherId as any)?.name || ""
            )
          )
        )
      )
    );
  }

async getStudentTimeTable(studentId: string): Promise<TimetableEntity | null> {
  const student = await StudentModel.findById(studentId)
    .populate("classId", "className division")
    .lean();

  if (!student || !student.classId) {
    console.log("Student not found or class not assigned");
    return null;
  }

  const classId = (student.classId as any)._id.toString();

  const doc = await TimetableModel.findOne({ classId: new mongoose.Types.ObjectId(classId) })
    .populate("classId", "className division")
    .populate("days.periods.teacherId", "name")
    .lean();

  return doc ? new TimetableEntity(
    doc._id.toString(),
    (doc.classId as any)._id.toString(),
    (doc.classId as any).className,
    (doc.classId as any).division,
    doc.days.map(d => new DayScheduleEntity(
      d.day,
      d.periods.map(p => new PeriodEntity(
        p.startTime,
        p.endTime,
        p.subject,
        (p.teacherId as any)?.name || ""
      ))
    ))
  ) : null;
}



 


}


