import { TimetableEntity } from "../../../domain/entities/TimeTableEntity";
import { TimeTableError } from "../../../domain/enums/TimeTable/TimeTableError";

export function validateTimetableFormat(data: any): void {
    if (!data.classId || !data.division || !data.days || data.days.length === 0) {
        throw new Error(TimeTableError.REQUIRED);
    }

    for (const day of data.days) {
        if (!day.day) throw new Error("Each day must have a name");
        if (!Array.isArray(day.periods) || day.periods.length === 0) {
            throw new Error(`Each day (${day.day}) must have at least one period`);
        }

        for (const period of day.periods) {
            const { startTime, endTime, subject, teacherId } = period;
            if (!startTime || !endTime || (subject !== "Break" && !teacherId)) {
                throw new Error(`Missing required fields for period on ${day.day}`);
            }
            TimetableEntity.validatePeriodRange(startTime, endTime);
        }

        if (day.breaks && Array.isArray(day.breaks)) {
            for (const brk of day.breaks) {
                const { startTime, endTime } = brk;
                if (!startTime || !endTime) {
                    throw new Error(`Start and end time are required for all breaks on ${day.day}`);
                }
                TimetableEntity.validatePeriodRange(startTime, endTime);
            }
        }
    }
}
