import { TimetableEntity } from "../../../../domain/entities/TimeTableEntity";
import { MongoTimeTableCreate } from "../../../../infrastructure/repositories/MongoTimeTableCreation";

export class StudentTimeTableViewUseCase {
  constructor(private readonly timetableRepo: MongoTimeTableCreate) {}

  async execute(studentId: string): Promise<TimetableEntity> {
    const timetable = await this.timetableRepo.getStudentTimeTable(studentId);
    if (!timetable) {
      throw new Error("Student not found or class not assigned / Timetable not available");
    }
    return timetable;
  }
}