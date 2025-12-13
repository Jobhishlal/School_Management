import { IDeleteTimeTable } from "../../../../domain/UseCaseInterface/TimeTable/IDeleteTimeTableUseCase";
import { ITimeTableRepository } from "../../../../domain/repositories/Admin/ITimeTableCreate";

export class DeleteTimeTableUseCase implements IDeleteTimeTable {
  constructor(private readonly timetablerepo: ITimeTableRepository) {}

  async execute(id: string): Promise<void> {
    if (!id) throw new Error("Timetable ID is required");

    const existingTimetable = await this.timetablerepo.findById(id);
    if (!existingTimetable) throw new Error("Timetable not found");

    await this.timetablerepo.delete(id);
  }
}
