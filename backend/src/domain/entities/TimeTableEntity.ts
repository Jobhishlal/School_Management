export class PeriodEntity {
  constructor(
    public startTime: string,
    public endTime: string,
    public subject: string,
    public teacherId: string
  ) { }
}

export class BreakEntity {
  constructor(
    public startTime: string,
    public endTime: string,
    public name?: string
  ) { }
}

export class DayScheduleEntity {
  constructor(
    public day: string,
    public periods: PeriodEntity[],
    public breaks: BreakEntity[] = []
  ) { }
}

export class TimetableEntity {
  constructor(
    public id: string,
    public classId: string,
    public className: string,
    public division: string,
    public days: DayScheduleEntity[]
  ) { }
}
