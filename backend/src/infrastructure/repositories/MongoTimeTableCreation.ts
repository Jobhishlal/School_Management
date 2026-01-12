import { TimetableModel } from "../database/models/Admin/TimeTableCraete";
import { ITimeTableRepository } from "../../domain/repositories/Admin/ITimeTableCreate";
import { TimetableEntity, DayScheduleEntity, PeriodEntity } from "../../domain/entities/TimeTableEntity";
import { TeacherModel } from "../database/models/Teachers";
import { ClassModel } from "../database/models/ClassModel";
import { CreateTimetableDTO } from "../../applications/dto/CreateTImeTableDTO";
import { StudentModel } from "../database/models/StudentModel";
import { validateTimetable } from "../../applications/validators/Timetable/TimetableValidator";

import mongoose from "mongoose";
import { TeacherDailyScheduleDTO } from "../../applications/dto/TeacherDailyScheduleDTO";


export class MongoTimeTableCreate implements ITimeTableRepository {

  async validateAndCheck(dto: CreateTimetableDTO): Promise<void> {
    const cls = await ClassModel.findById(dto.classId);
    if (!cls) throw new Error("Class not found");

    for (const day of dto.days) {
      for (const period of day.periods) {
        if (!period.teacherId || period.teacherId === "") continue;

        const teacher = await TeacherModel.findById(period.teacherId);
        if (!teacher) throw new Error(`Teacher not found: ${period.teacherId}`);

        // Check if the teacher teaches the subject
        const subjectExists = teacher.subjects.some(
          (sub) => sub.name === period.subject
        );

        if (!subjectExists) {
          throw new Error(
            `Teacher ${teacher.name} does not teach ${period.subject}`
          );
        }
      }
    }

  }



  async create(timetable: TimetableEntity): Promise<TimetableEntity> {
    await validateTimetable(timetable);

    const classObjectId = new mongoose.Types.ObjectId(timetable.classId);

    const existing = await TimetableModel.findOne({
      classId: classObjectId,
      division: timetable.division
    });

    if (existing) {
      throw new Error(`Timetable already exists for Class ${existing.className} - Division ${existing.division}`);
    }

    const daysData = timetable.days.length > 0 ? timetable.days : [
      { day: "Monday", periods: [], breaks: [] },
      { day: "Tuesday", periods: [], breaks: [] },
      { day: "Wednesday", periods: [], breaks: [] },
      { day: "Thursday", periods: [], breaks: [] },
      { day: "Friday", periods: [], breaks: [] },
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
          teacherId: p.teacherId ? new mongoose.Types.ObjectId(p.teacherId) : undefined,
        })),
        breaks: (d.breaks || []).map((b: any) => ({
          startTime: b.startTime,
          endTime: b.endTime,
          name: b.name
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
        )),
        (d.breaks || []).map(b => ({ startTime: b.startTime, endTime: b.endTime, name: b.name }))
      ))
    );
  }



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
        )),
        (d.breaks || []).map(b => ({ startTime: b.startTime, endTime: b.endTime, name: b.name }))
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
            teacherId: p.teacherId ? new mongoose.Types.ObjectId(p.teacherId) : undefined
          })),
          breaks: (d.breaks || []).map((b: any) => ({
            startTime: b.startTime,
            endTime: b.endTime,
            name: b.name
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
        )),
        (d.breaks || []).map(b => ({ startTime: b.startTime, endTime: b.endTime, name: b.name }))
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
        )),
        (d.breaks || []).map(b => ({ startTime: b.startTime, endTime: b.endTime, name: b.name }))
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
              p.teacherId ? (p.teacherId as any)?.name || "" : ""
            )
          ),
          (d.breaks || []).map(b => ({ startTime: b.startTime, endTime: b.endTime, name: b.name }))
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
        )),
        (d.breaks || []).map(b => ({ startTime: b.startTime, endTime: b.endTime, name: b.name }))
      ))
    ) : null;
  }



  async getTeacherDailySchedule(teacherId: string, day?: string): Promise<TeacherDailyScheduleDTO[]> {
    const Matchstage: any = {
      'days.periods.teacherId': new mongoose.Types.ObjectId(teacherId)
    }
    if (day) {
      Matchstage['days.day'] = day
    }


    const activeClasses = await TimetableModel.aggregate([

      { $match: Matchstage },

      { $unwind: '$days' },

      { $unwind: '$days.periods' },


      {
        $match: {
          'days.periods.teacherId': new mongoose.Types.ObjectId(teacherId),
          ...(day && { 'days.day': day })
        }
      },

      {
        $lookup: {
          from: 'classes',
          localField: 'classId',
          foreignField: '_id',
          as: 'class'
        }
      },

      { $unwind: '$class' },
      {
        $project: {
          _id: 0,
          day: "$days.day",
          className: "$class.className",
          division: "$division",
          startTime: "$days.periods.startTime",
          endTime: "$days.periods.endTime",
          subject: "$days.periods.subject"
        }
      },

      { $sort: { startTime: 1 } }
    ]);

    // Fetch a reference timetable to determine the day structure (periods/breaks)
    // We try to find one associated with the teacher, or fallback to any timetable (assuming generic bell schedule)
    const reference = await TimetableModel.findOne({
      'days.periods.teacherId': new mongoose.Types.ObjectId(teacherId)
    }).lean() || await TimetableModel.findOne().lean();

    if (!reference) {
      // Fallback if no timetable exists at all
      return activeClasses.map(c => ({ ...c, type: 'class' }));
    }

    const finalSchedule: TeacherDailyScheduleDTO[] = [];
    const daysToProcess = day ? [day] : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    for (const currentDay of daysToProcess) {
      // 1. Get all active classes for this day
      const dayClasses = activeClasses.filter(c => c.day === currentDay);

      // 2. Add all active classes to final schedule
      dayClasses.forEach(c => {
        finalSchedule.push({ ...c, type: 'class' });
      });

      // 3. Find reference structure for this day
      const dayRef = reference.days.find(d => d.day === currentDay);
      if (dayRef) {
        // Add Breaks
        if (dayRef.breaks) {
          dayRef.breaks.forEach((brk: any) => {
            finalSchedule.push({
              day: currentDay,
              startTime: brk.startTime,
              endTime: brk.endTime,
              subject: brk.name || "Break",
              type: 'break'
            });
          });
        }

        // Add Rest Periods (only if no class exists at that time)
        if (dayRef.periods) {
          dayRef.periods.forEach((refPeriod: any) => {
            // Check if we already have a class (or break) at this time
            const hasClass = finalSchedule.some(s =>
              s.day === currentDay &&
              s.startTime === refPeriod.startTime &&
              s.type === 'class'
            );

            // Also check for overlapping breaks just in case, though breaks usually don't overlap periods
            // If no class, it's a rest
            if (!hasClass) {
              // Check if we already added a rest/break at this exact time to avoid duplicates
              const exists = finalSchedule.some(s =>
                s.day === currentDay &&
                s.startTime === refPeriod.startTime
              );

              if (!exists) {
                finalSchedule.push({
                  day: currentDay,
                  startTime: refPeriod.startTime,
                  endTime: refPeriod.endTime,
                  subject: "Rest Period",
                  type: 'rest'
                });
              }
            }
          });
        }
      }
    }

    // Sort by Day (Monday first...) then Time
    const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    return finalSchedule.sort((a, b) => {
      const dayDiff = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
      if (dayDiff !== 0) return dayDiff;
      return a.startTime.localeCompare(b.startTime);
    });
  }



}


