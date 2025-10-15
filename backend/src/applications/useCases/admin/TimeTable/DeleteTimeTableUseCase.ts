import { IDeleteTimeTable } from "../../../../domain/UseCaseInterface/TimeTable/IDeleteTimeTableUseCase";
import { ITimeTableRepository } from "../../../../domain/repositories/Admin/ITimeTableCreate";

export class DeleteTimeTableUseCase implements IDeleteTimeTable {
  constructor(private readonly timetablerepo: ITimeTableRepository) {}

  async execute(id: string): Promise<void> {
    const existingTimetable = await this.timetablerepo.getById(id);
    if (!existingTimetable) {
      throw new Error("Timetable not found");
    }
    await this.timetablerepo.delete(id);
  }
}
