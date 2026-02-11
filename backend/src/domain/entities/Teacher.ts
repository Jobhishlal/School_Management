export class Teeacher {
  private _id: string;
  private _name: string;
  private _email: string;
  private _phone: string;
  private _gender: string;
  private _role: string;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _blocked: boolean;
  private _Password: string;
  private _documents?: { url: string; filename: string; uploadedAt: Date }[];
  private _subjects?: { name: string, code: string }[];
  private _department?: "LP" | "UP" | "HS";
  private _leaveBalance?: { sickLeave: number; casualLeave: number };

  constructor(
    id: string,
    name: string,
    email: string,
    phone: string,
    gender: string,
    role: string,
    createdAt: Date,
    updatedAt: Date,
    blocked: boolean,
    Password: string,
    documents?: { url: string; filename: string; uploadedAt: Date }[],
    subjects?: { name: string, code: string }[],
    department?: "LP" | "UP" | "HS",
    leaveBalance?: { sickLeave: number; casualLeave: number }
  ) {
    this._id = id;
    this._name = name;
    this._email = email;
    this._phone = phone;
    this._gender = gender;
    this._role = role;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._blocked = blocked;
    this._Password = Password;
    this._documents = documents;
    this._subjects = subjects;
    this._department = department;
    this._leaveBalance = leaveBalance;
  }

  get id(): string { return this._id; }
  set id(value: string) { this._id = value; }

  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }

  get email(): string { return this._email; }
  set email(value: string) { this._email = value; }

  get phone(): string { return this._phone; }
  set phone(value: string) { this._phone = value; }

  get gender(): string { return this._gender; }
  set gender(value: string) { this._gender = value; }

  get role(): string { return this._role; }
  set role(value: string) { this._role = value; }

  get createdAt(): Date { return this._createdAt; }
  set createdAt(value: Date) { this._createdAt = value; }

  get updatedAt(): Date { return this._updatedAt; }
  set updatedAt(value: Date) { this._updatedAt = value; }

  get blocked(): boolean { return this._blocked; }
  set blocked(value: boolean) { this._blocked = value; }

  get Password(): string { return this._Password; }
  set Password(value: string) { this._Password = value; }

  get documents(): { url: string; filename: string; uploadedAt: Date }[] | undefined { return this._documents; }
  set documents(value: { url: string; filename: string; uploadedAt: Date }[] | undefined) { this._documents = value; }

  get subjects(): { name: string, code: string }[] | undefined { return this._subjects; }
  set subjects(value: { name: string, code: string }[] | undefined) { this._subjects = value; }

  get department(): "LP" | "UP" | "HS" | undefined { return this._department; }
  set department(value: "LP" | "UP" | "HS" | undefined) { this._department = value; }

  get leaveBalance(): { sickLeave: number; casualLeave: number } | undefined { return this._leaveBalance; }
  set leaveBalance(value: { sickLeave: number; casualLeave: number } | undefined) { this._leaveBalance = value; }
}
