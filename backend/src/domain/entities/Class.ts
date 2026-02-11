import { ClassErrors } from "../enums/ClassError";

export class Class {
  private static allowedClasses = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  private static allowedDivisions = ["A", "B", "C", "D"];

  private _id: string;
  private _className: string;
  private _division: string;
  private _rollNumber: string;
  private _department?: "LP" | "UP" | "HS";
  private _subjects?: string[];
  private _classTeacher?: string;

  constructor(
    id: string,
    className: string,
    division: string,
    rollNumber: string,
    department?: "LP" | "UP" | "HS",
    subjects?: string[],
    classTeacher?: string
  ) {
    this._id = id;
    this._className = className;
    this._division = division;
    this._rollNumber = rollNumber;
    this._department = department;
    this._subjects = subjects;
    this._classTeacher = classTeacher;
  }

  get id(): string { return this._id; }
  set id(value: string) { this._id = value; }

  get className(): string { return this._className; }
  set className(value: string) { this._className = value; }

  get division(): string { return this._division; }
  set division(value: string) { this._division = value; }

  get rollNumber(): string { return this._rollNumber; }
  set rollNumber(value: string) { this._rollNumber = value; }

  get department(): "LP" | "UP" | "HS" | undefined { return this._department; }
  set department(value: "LP" | "UP" | "HS" | undefined) { this._department = value; }

  get subjects(): string[] | undefined { return this._subjects; }
  set subjects(value: string[] | undefined) { this._subjects = value; }

  get classTeacher(): string | undefined { return this._classTeacher; }
  set classTeacher(value: string | undefined) { this._classTeacher = value; }

  public static validate(className: string, division: string): void {
    if (!className || !division) {
      throw new Error(ClassErrors.REQUIRED);
    }

    if (!this.allowedClasses.includes(className) || !this.allowedDivisions.includes(division)) {
      throw new Error(ClassErrors.INVALID_SELECTION);
    }
  }

  public static validateClassName(className: string): void {
    if (!this.allowedClasses.includes(className)) {
      throw new Error(ClassErrors.INVALID_SELECTION);
    }
  }

  public static validateDivision(division: string): void {
    if (!this.allowedDivisions.includes(division)) {
      throw new Error(ClassErrors.INVALID_SELECTION);
    }
  }
}
