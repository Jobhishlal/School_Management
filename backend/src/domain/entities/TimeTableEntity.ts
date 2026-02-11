export class PeriodEntity {
  private _startTime: string;
  private _endTime: string;
  private _subject: string;
  private _teacherId: string;

  constructor(
    startTime: string,
    endTime: string,
    subject: string,
    teacherId: string
  ) {
    this._startTime = startTime;
    this._endTime = endTime;
    this._subject = subject;
    this._teacherId = teacherId;
  }

  get startTime(): string { return this._startTime; }
  set startTime(value: string) { this._startTime = value; }

  get endTime(): string { return this._endTime; }
  set endTime(value: string) { this._endTime = value; }

  get subject(): string { return this._subject; }
  set subject(value: string) { this._subject = value; }

  get teacherId(): string { return this._teacherId; }
  set teacherId(value: string) { this._teacherId = value; }
}

export class BreakEntity {
  private _startTime: string;
  private _endTime: string;
  private _name?: string;

  constructor(
    startTime: string,
    endTime: string,
    name?: string
  ) {
    this._startTime = startTime;
    this._endTime = endTime;
    this._name = name;
  }

  get startTime(): string { return this._startTime; }
  set startTime(value: string) { this._startTime = value; }

  get endTime(): string { return this._endTime; }
  set endTime(value: string) { this._endTime = value; }

  get name(): string | undefined { return this._name; }
  set name(value: string | undefined) { this._name = value; }
}

export class DayScheduleEntity {
  private _day: string;
  private _periods: PeriodEntity[];
  private _breaks: BreakEntity[];

  constructor(
    day: string,
    periods: PeriodEntity[],
    breaks: BreakEntity[] = []
  ) {
    this._day = day;
    this._periods = periods;
    this._breaks = breaks;
  }

  get day(): string { return this._day; }
  set day(value: string) { this._day = value; }

  get periods(): PeriodEntity[] { return this._periods; }
  set periods(value: PeriodEntity[]) { this._periods = value; }

  get breaks(): BreakEntity[] { return this._breaks; }
  set breaks(value: BreakEntity[]) { this._breaks = value; }
}

export class TimetableEntity {
  private _id: string;
  private _classId: string;
  private _className: string;
  private _division: string;
  private _days: DayScheduleEntity[];

  constructor(
    id: string,
    classId: string,
    className: string,
    division: string,
    days: DayScheduleEntity[]
  ) {
    this._id = id;
    this._classId = classId;
    this._className = className;
    this._division = division;
    this._days = days;
  }

  get id(): string { return this._id; }
  set id(value: string) { this._id = value; }

  get classId(): string { return this._classId; }
  set classId(value: string) { this._classId = value; }

  get className(): string { return this._className; }
  set className(value: string) { this._className = value; }

  get division(): string { return this._division; }
  set division(value: string) { this._division = value; }

  get days(): DayScheduleEntity[] { return this._days; }
  set days(value: DayScheduleEntity[]) { this._days = value; }

  public static parseTime(time: string): number {
    const match = time.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i);
    if (!match) throw new Error(`Invalid time format: ${time}`);

    let hour = parseInt(match[1]);
    const minutes = parseInt(match[2] || "0");
    const period = match[3]?.toUpperCase();

    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;

    return hour + minutes / 60;
  }

  public static validatePeriodRange(startTime: string, endTime: string): void {
    const startH = this.parseTime(startTime);
    const endH = this.parseTime(endTime);

    if (endH <= startH) {
      throw new Error("End time must be after start time");
    }

    if (startH < 9 || endH > 16) {
      throw new Error("Time must be between 9:00 AM and 4:00 PM");
    }
  }
}
