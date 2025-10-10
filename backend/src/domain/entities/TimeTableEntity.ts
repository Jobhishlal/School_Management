export class PeriodEntity {
  constructor(
    public startTime: string,
    public endTime: string,
    public subject: string,
    public teacherId: string
  ) {}
}

export class DayScheduleEntity {
  constructor(
    public day: string,
    public periods: PeriodEntity[]
  ) {}
}

export class TimetableEntity {
  constructor(
    public id: string,
    public classId: string,
    public division: string,
    public days: DayScheduleEntity[]
  ) {}
}
