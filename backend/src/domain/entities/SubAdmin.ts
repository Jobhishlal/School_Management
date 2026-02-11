import { AdminRole } from "../enums/AdminRole";
import { SubAdminProfileError } from "../enums/SubAdminProfileError";
import { passwordError } from "../enums/PasswordError";

export interface AddressValue {
  _id: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export class SubAdminEntities {
  private _id: string;
  private _name: string;
  private _email: string;
  private _phone: string;
  private _role: AdminRole;
  private _password: string;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _blocked: boolean;
  private _major_role: string;
  private _dateOfBirth: Date;
  private _gender: string;
  private _documents: any[];
  private _address?: string | AddressValue;
  private _photo?: any[];
  private _leaveBalance?: { sickLeave: number; casualLeave: number; };

  constructor(
    id: string,
    name: string,
    email: string,
    phone: string,
    role: AdminRole,
    password: string,
    createdAt: Date,
    updatedAt: Date,
    blocked: boolean,
    major_role: string,
    dateOfBirth: Date,
    gender: string,
    documents: any[],
    address?: string | AddressValue,
    photo?: any[],
    leaveBalance?: { sickLeave: number; casualLeave: number; }
  ) {
    this._id = id;
    this._name = name;
    this._email = email;
    this._phone = phone;
    this._role = role;
    this._password = password;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._blocked = blocked;
    this._major_role = major_role;
    this._dateOfBirth = dateOfBirth;
    this._gender = gender;
    this._documents = documents;
    this._address = address;
    this._photo = photo;
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

  get role(): AdminRole { return this._role; }
  set role(value: AdminRole) { this._role = value; }

  get password(): string { return this._password; }
  set password(value: string) { this._password = value; }

  get createdAt(): Date { return this._createdAt; }
  set createdAt(value: Date) { this._createdAt = value; }

  get updatedAt(): Date { return this._updatedAt; }
  set updatedAt(value: Date) { this._updatedAt = value; }

  get blocked(): boolean { return this._blocked; }
  set blocked(value: boolean) { this._blocked = value; }

  get major_role(): string { return this._major_role; }
  set major_role(value: string) { this._major_role = value; }

  get dateOfBirth(): Date { return this._dateOfBirth; }
  set dateOfBirth(value: Date) { this._dateOfBirth = value; }

  get gender(): string { return this._gender; }
  set gender(value: string) { this._gender = value; }

  get documents(): any[] { return this._documents; }
  set documents(value: any[]) { this._documents = value; }

  get address(): string | AddressValue | undefined { return this._address; }
  set address(value: string | AddressValue | undefined) { this._address = value; }

  get photo(): any[] | undefined { return this._photo; }
  set photo(value: any[] | undefined) { this._photo = value; }

  get leaveBalance(): { sickLeave: number; casualLeave: number; } | undefined { return this._leaveBalance; }
  set leaveBalance(value: { sickLeave: number; casualLeave: number; } | undefined) { this._leaveBalance = value; }

  public static validateAge(dateOfBirth: Date): void {
    const dob = new Date(dateOfBirth);
    if (isNaN(dob.getTime())) {
      throw new Error(SubAdminProfileError.INVALID_DATEOFBIRTH);
    }

    const today = new Date();
    if (dob > today) {
      throw new Error(SubAdminProfileError.DOB_FUTURE);
    }

    const age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      // Adjustment for current month/day
    }

    // Simplistic age check as per existing validator
    if (age < 25 || age > 50) {
      throw new Error(SubAdminProfileError.DOB_AGE_LIMIT);
    }
  }

  public static validateName(name: string): void {
    if (!/^[A-Za-z\s]{3,50}$/.test(name)) {
      throw new Error(SubAdminProfileError.INVALID_NAME);
    }
  }

  public static validateEmail(email: string): void {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error(SubAdminProfileError.INVALID_EMAIL);
    }
  }

  public static validatePhone(phone: string): void {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      throw new Error(SubAdminProfileError.INVALID_PHONE);
    }
  }

  public static validateGender(gender: string): void {
    if (gender && !["Male", "Female", "Other"].includes(gender)) {
      throw new Error(SubAdminProfileError.INVALID_GENDER);
    }
  }

  public static validatePassword(password: string): void {
    if (!password || password.trim() === "") {
      throw new Error(passwordError.PASSWORD_REQUIRED);
    }

    if (password.length < 8) {
      throw new Error(passwordError.PASSWORD_TOO_SHORT);
    }

    if (!/[A-Z]/.test(password)) {
      throw new Error(passwordError.PASSWORD_MISSING_UPPERCASE);
    }

    if (!/[a-z]/.test(password)) {
      throw new Error(passwordError.PASSWORD_MISSING_LOWERCASE);
    }

    if (!/[0-9]/.test(password)) {
      throw new Error(passwordError.PASSWORD_MISSING_NUMBER);
    }

    if (!/[@$!%*?&]/.test(password)) {
      throw new Error(passwordError.PASSWORD_MISSING_SPECIAL);
    }
  }
}
