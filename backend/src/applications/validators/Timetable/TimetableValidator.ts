import { TimeTableError } from "../../../domain/enums/TimeTable/TimeTableError";
import { CreateTimetableDTO } from "../../dto/CreateTImeTableDTO";
import { ClassModel } from "../../../infrastructure/database/models/ClassModel";
import { TeacherModel } from "../../../infrastructure/database/models/Teachers";
import { TimetableModel } from "../../../infrastructure/database/models/Admin/TimeTableCraete";

export function parseTime(time: string): number {
  const match = time.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i);
  if (!match) throw new Error(`Invalid time format: ${time}`);

  let hour = parseInt(match[1]);
  const minutes = parseInt(match[2] || "0");
  const period = match[3]?.toUpperCase();

  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  return hour + minutes / 60;
}


async function checkTeacherAvailability(
  day: string,
  startHour: number,
  endHour: number,
  teacherId: string,
  currentClassId?: string
) {
  const timetables = await TimetableModel.find({
    "days.day": day,
    ...(currentClassId ? { classId: { $ne: currentClassId } } : {}),
  });

  let periodsCount = 0;

  for (const timetable of timetables) {
    const daySchedule = timetable.days.find(d => d.day === day);
    if (!daySchedule) continue;

    for (const period of daySchedule.periods) {
      if (period.teacherId.toString() === teacherId) {
        periodsCount++;

        const periodStart = parseTime(period.startTime);
        const periodEnd = parseTime(period.endTime);

        if (!(endHour <= periodStart || startHour >= periodEnd)) {
          throw new Error(
            `Teacher is already assigned in class ${timetable.className}-${timetable.division} from ${period.startTime} to ${period.endTime}`
          );
        }
      }
    }
  }

  if (periodsCount >= 5) {
    throw new Error(`Teacher cannot be assigned more than 5 periods per day on ${day}`);
  }
}


export async function validateTimetable(dto: CreateTimetableDTO): Promise<void> {
  if (!dto.classId || !dto.division || !dto.days || dto.days.length === 0) {
    throw new Error(TimeTableError.REQUIRED);
  }

  const classExists = await ClassModel.findById(dto.classId);
  if (!classExists) {
    throw new Error(TimeTableError.ClASS_NOT_FOUND);
  }

  const MIN_HOUR = 9;
  const LUNCH_TIME_START = 12;
  const LUNCH_TIME_OVER = 13;

  for (const day of dto.days) {
    if (!day.day) throw new Error("Each day must have a name");
    if (!Array.isArray(day.periods) || day.periods.length === 0) {
      throw new Error(`Each day (${day.day}) must have at least one period`);
    }

    const MAX_LIMIT_HOUR = 16; // 16:00

    if (day.breaks && Array.isArray(day.breaks)) {
      for (const brk of day.breaks) {
        const { startTime, endTime } = brk;
        if (!startTime || !endTime) {
          throw new Error(`Start and end time are required for all breaks on ${day.day}`);
        }

        const startH = parseInt(startTime.split(':')[0]);
        const endH = parseInt(endTime.split(':')[0]);

        if (startH >= MAX_LIMIT_HOUR || endH > MAX_LIMIT_HOUR) {
          throw new Error(`Breaks cannot be scheduled after 16:00 on ${day.day}`);
        }

        const startHour = parseTime(startTime);
        const endHour = parseTime(endTime);

        if (endHour <= startHour) {
          throw new Error(`Break end time must be after start time on ${day.day}`);
        }
      }
    }

    const seenTimes = new Set<number>();

    for (const period of day.periods) {
      const { startTime, endTime, subject, teacherId } = period;

      if (!startTime || !endTime || (subject !== "Break" && !teacherId)) {
        throw new Error(`Missing required fields for period on ${day.day}`);
      }

      const startHour = parseTime(startTime);
      const endHour = parseTime(endTime);

      if (startHour < MIN_HOUR || endHour > MAX_LIMIT_HOUR) {
        throw new Error(`Time must be between 9:00 and 16:00 for ${day.day}`);
      }

      if (startHour >= LUNCH_TIME_START && endHour <= LUNCH_TIME_OVER) {
        throw new Error(
          `Cannot schedule a class during lunch break (12:00 PM - 1:00 PM) on ${day.day}`
        );
      }

      if (endHour <= startHour) {
        throw new Error(`End time must be after start time on ${day.day}`);
      }

      if (seenTimes.has(startHour)) {
        throw new Error(`Duplicate start time ${startTime} found on ${day.day}`);
      }
      seenTimes.add(startHour);

      if (subject !== "Break") {
        const teacher = await TeacherModel.findById(teacherId);
        if (!teacher) {
          throw new Error(`Teacher not found for period (${subject})`);
        }

        if (!teacher.subjects.some(s => s.name === period.subject)) {
          throw new Error(`${teacher.name} does not teach ${period.subject}`);
        }

        await checkTeacherAvailability(day.day, startHour, endHour, teacherId, dto.classId);
      }
    }
  }
}
