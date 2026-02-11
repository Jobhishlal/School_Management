import { ExamErrors } from "../../enums/ExamErrorMessages/ExamError";

export type ExamType = "UNIT_TEST" | "MIDTERM" | "FINAL";
export type ExamStatus = "DRAFT" | "PUBLISHED";

export class ExamEntity {
  private _id: string;
  private _examId: string;
  private _title: string;
  private _type: ExamType;
  private _classId: string;
  private _className: string;
  private _division: string;
  private _subject: string;
  private _teacherId: string;
  private _teacherName: string;
  private _examDate: Date;
  private _startTime: string;
  private _endTime: string;
  private _maxMarks: number;
  private _passMarks: number;
  private _description: string;
  private _status: ExamStatus;
  private _pendingConcerns: number;
  private _concerns: Array<{ studentName: string, concern: string, studentId: string }>;

  constructor(
    id: string,
    examId: string,
    title: string,
    type: ExamType,
    classId: string,
    className: string,
    division: string,
    subject: string,
    teacherId: string,
    teacherName: string,
    examDate: Date,
    startTime: string,
    endTime: string,
    maxMarks: number,
    passMarks: number,
    description: string = "",
    status: ExamStatus = "DRAFT",
    pendingConcerns: number = 0,
    concerns: Array<{ studentName: string, concern: string, studentId: string }> = []
  ) {
    this._id = id;
    this._examId = examId;
    this._title = title;
    this._type = type;
    this._classId = classId;
    this._className = className;
    this._division = division;
    this._subject = subject;
    this._teacherId = teacherId;
    this._teacherName = teacherName;
    this._examDate = examDate;
    this._startTime = startTime;
    this._endTime = endTime;
    this._maxMarks = maxMarks;
    this._passMarks = passMarks;
    this._description = description;
    this._status = status;
    this._pendingConcerns = pendingConcerns;
    this._concerns = concerns;
  }

  get id(): string { return this._id; }
  set id(value: string) { this._id = value; }

  get examId(): string { return this._examId; }
  set examId(value: string) { this._examId = value; }

  get title(): string { return this._title; }
  set title(value: string) { this._title = value; }

  get type(): ExamType { return this._type; }
  set type(value: ExamType) { this._type = value; }

  get classId(): string { return this._classId; }
  set classId(value: string) { this._classId = value; }

  get className(): string { return this._className; }
  set className(value: string) { this._className = value; }

  get division(): string { return this._division; }
  set division(value: string) { this._division = value; }

  get subject(): string { return this._subject; }
  set subject(value: string) { this._subject = value; }

  get teacherId(): string { return this._teacherId; }
  set teacherId(value: string) { this._teacherId = value; }

  get teacherName(): string { return this._teacherName; }
  set teacherName(value: string) { this._teacherName = value; }

  get examDate(): Date { return this._examDate; }
  set examDate(value: Date) { this._examDate = value; }

  get startTime(): string { return this._startTime; }
  set startTime(value: string) { this._startTime = value; }

  get endTime(): string { return this._endTime; }
  set endTime(value: string) { this._endTime = value; }

  get maxMarks(): number { return this._maxMarks; }
  set maxMarks(value: number) { this._maxMarks = value; }

  get passMarks(): number { return this._passMarks; }
  set passMarks(value: number) { this._passMarks = value; }

  get description(): string { return this._description; }
  set description(value: string) { this._description = value; }

  get status(): ExamStatus { return this._status; }
  set status(value: ExamStatus) { this._status = value; }

  get pendingConcerns(): number { return this._pendingConcerns; }
  set pendingConcerns(value: number) { this._pendingConcerns = value; }

  get concerns(): Array<{ studentName: string, concern: string, studentId: string }> { return this._concerns; }
  set concerns(value: Array<{ studentName: string, concern: string, studentId: string }>) { this._concerns = value; }

  public static validate(data: {
    title?: string;
    type?: string;
    subject?: string;
    examDate?: string | Date;
    startTime?: string;
    endTime?: string;
    maxMarks?: number;
    passMarks?: number;
    description?: string;
  }): void {
    if (data.type) {
      const EXAM_TYPES = ["UNIT_TEST", "MIDTERM", "FINAL"];
      if (!EXAM_TYPES.includes(data.type)) {
        throw new Error(ExamErrors.INVALID_EXAM_TYPE);
      }
    }

    if (data.examDate) {
      const examDate = new Date(data.examDate);
      if (isNaN(examDate.getTime())) {
        throw new Error(ExamErrors.INVALID_DATE);
      }
      this.validateDate(examDate);
    }

    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (data.startTime && !timeRegex.test(data.startTime)) {
      throw new Error(ExamErrors.INVALID_TIME);
    }
    if (data.endTime && !timeRegex.test(data.endTime)) {
      throw new Error(ExamErrors.INVALID_TIME);
    }

    if (data.startTime && data.endTime) {
      const [sh, sm] = data.startTime.split(":").map(Number);
      const [eh, em] = data.endTime.split(":").map(Number);
      if (eh * 60 + em <= sh * 60 + sm) {
        throw new Error(ExamErrors.INVALID_TIME_RANGE);
      }
    }

    if (data.maxMarks !== undefined) {
      if (typeof data.maxMarks !== "number" || data.maxMarks <= 0) {
        throw new Error(ExamErrors.INVALID_MARKS);
      }
    }

    if (data.passMarks !== undefined) {
      if (typeof data.passMarks !== "number" || data.passMarks <= 0) {
        throw new Error("Pass marks must be a positive number.");
      }
      if (data.maxMarks !== undefined && data.passMarks > data.maxMarks) {
        throw new Error("Pass marks cannot be greater than maximum marks.");
      }
    }

    if (data.subject !== undefined) {
      if (typeof data.subject !== "string" || data.subject.trim().length === 0) {
        throw new Error(ExamErrors.INVALID_SUBJECT);
      }
    }

    if (data.description && data.description.length > 500) {
      throw new Error(ExamErrors.DESCRIPTION_LENGTH);
    }
  }

  public static validateDate(date: Date): void {
    const examDate = new Date(date);
    const currentDate = new Date();
    examDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
    if (examDate < currentDate) {
      throw new Error("Exam date cannot be in the past");
    }
  }
}
