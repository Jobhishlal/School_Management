import { AssignmentErrors } from "../enums/AssignmentMess.ts/Assignment";

export interface AttachmentDTO {
  url: string;
  fileName: string;
}

export interface AssignmentSubmitDTO {
  studentId: string;
  url: string;
  fileName: string;
  uploadedAt: Date;
  studentDescription?: string;
  grade?: number;
  feedback?: string;
  badge?: string;
  status?: string;
}

export class AssignmentEntity {
  private _id: string;
  private _Assignment_Title: string;
  private _description: string;
  private _subject: string;
  private _classId: string;
  private _Assignment_date: Date;
  private _Assignment_Due_Date: Date;
  private _attachments: AttachmentDTO[];
  private _maxMarks: number;
  private _teacherId: string;
  private _className?: string;
  private _division?: string;
  private _assignmentSubmitFile?: AssignmentSubmitDTO[];

  constructor(
    id: string,
    Assignment_Title: string,
    description: string,
    subject: string,
    classId: string,
    Assignment_date: Date,
    Assignment_Due_Date: Date,
    attachments: AttachmentDTO[],
    maxMarks: number,
    teacherId: string,
    className?: string,
    division?: string,
    assignmentSubmitFile?: AssignmentSubmitDTO[]
  ) {
    this._id = id;
    this._Assignment_Title = Assignment_Title;
    this._description = description;
    this._subject = subject;
    this._classId = classId;
    this._Assignment_date = Assignment_date;
    this._Assignment_Due_Date = Assignment_Due_Date;
    this._attachments = attachments;
    this._maxMarks = maxMarks;
    this._teacherId = teacherId;
    this._className = className;
    this._division = division;
    this._assignmentSubmitFile = assignmentSubmitFile;
  }

  get id(): string { return this._id; }
  set id(value: string) { this._id = value; }

  get Assignment_Title(): string { return this._Assignment_Title; }
  set Assignment_Title(value: string) { this._Assignment_Title = value; }

  get description(): string { return this._description; }
  set description(value: string) { this._description = value; }

  get subject(): string { return this._subject; }
  set subject(value: string) { this._subject = value; }

  get classId(): string { return this._classId; }
  set classId(value: string) { this._classId = value; }

  get Assignment_date(): Date { return this._Assignment_date; }
  set Assignment_date(value: Date) { this._Assignment_date = value; }

  get Assignment_Due_Date(): Date { return this._Assignment_Due_Date; }
  set Assignment_Due_Date(value: Date) { this._Assignment_Due_Date = value; }

  get attachments(): AttachmentDTO[] { return this._attachments; }
  set attachments(value: AttachmentDTO[]) { this._attachments = value; }

  get maxMarks(): number { return this._maxMarks; }
  set maxMarks(value: number) { this._maxMarks = value; }

  get teacherId(): string { return this._teacherId; }
  set teacherId(value: string) { this._teacherId = value; }

  get className(): string | undefined { return this._className; }
  set className(value: string | undefined) { this._className = value; }

  get division(): string | undefined { return this._division; }
  set division(value: string | undefined) { this._division = value; }

  get assignmentSubmitFile(): AssignmentSubmitDTO[] | undefined { return this._assignmentSubmitFile; }
  set assignmentSubmitFile(value: AssignmentSubmitDTO[] | undefined) { this._assignmentSubmitFile = value; }

  public static validate(data: {
    Assignment_Title?: string;
    description?: string;
    subject?: string;
    Assignment_date?: string | Date;
    Assignment_Due_Date?: string | Date;
    maxMarks?: number;
    attachments?: { url: string; fileName: string }[];
  }): void {
    if (data.Assignment_Title !== undefined) {
      if (data.Assignment_Title.length < 3 || data.Assignment_Title.length > 100) {
        throw new Error(AssignmentErrors.TITLE_LENGTH);
      }
    }

    if (data.description !== undefined) {
      if (data.description.length < 5 || data.description.length > 1000) {
        throw new Error(AssignmentErrors.DESCRIPTION_LENGTH);
      }
    }

    if (data.subject !== undefined) {
      if (data.subject.length < 2 || data.subject.length > 50) {
        throw new Error(AssignmentErrors.SUBJECT_LENGTH);
      }
    }

    if (data.Assignment_date !== undefined && data.Assignment_Due_Date !== undefined) {
      const assignDate = new Date(data.Assignment_date);
      const dueDate = new Date(data.Assignment_Due_Date);
      if (dueDate < assignDate) {
        throw new Error(AssignmentErrors.INVALID_DATE);
      }
    }

    if (data.maxMarks !== undefined) {
      if (data.maxMarks <= 0) {
        throw new Error(AssignmentErrors.INVALID_MAX_MARKS);
      }
    }

    if (data.attachments) {
      data.attachments.forEach(file => {
        if (!file.url || !file.fileName) {
          throw new Error(AssignmentErrors.INVALID_ATTACHMENT);
        }
      });
    }
  }
}