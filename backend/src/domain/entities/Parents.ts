import { ParentValidationErrors } from "../enums/ParentValidateError";

export class ParentEntity {
  private _id: string;
  private _name?: string;
  private _contactNumber?: string;
  private _whatsappNumber?: string;
  private _email?: string;
  private _password?: string;
  private _relationship?: "Son" | "Daughter";

  constructor(
    id: string,
    name?: string,
    contactNumber?: string,
    whatsappNumber?: string,
    email?: string,
    password?: string,
    relationship?: "Son" | "Daughter"
  ) {
    this._id = id;
    this._name = name;
    this._contactNumber = contactNumber;
    this._whatsappNumber = whatsappNumber;
    this._email = email;
    this._password = password;
    this._relationship = relationship;
  }

  get id(): string { return this._id; }
  set id(value: string) { this._id = value; }

  get name(): string | undefined { return this._name; }
  set name(value: string | undefined) { this._name = value; }

  get contactNumber(): string | undefined { return this._contactNumber; }
  set contactNumber(value: string | undefined) { this._contactNumber = value; }

  get whatsappNumber(): string | undefined { return this._whatsappNumber; }
  set whatsappNumber(value: string | undefined) { this._whatsappNumber = value; }

  get email(): string | undefined { return this._email; }
  set email(value: string | undefined) { this._email = value; }

  get password(): string | undefined { return this._password; }
  set password(value: string | undefined) { this._password = value; }

  get relationship(): "Son" | "Daughter" | undefined { return this._relationship; }
  set relationship(value: "Son" | "Daughter" | undefined) { this._relationship = value; }

  public static validate(data: {
    name?: string;
    contactNumber?: string;
    email?: string;
    whatsappNumber?: string;
  }): void {
    if (data.name !== undefined) {
      if (!data.name.trim()) throw new Error(ParentValidationErrors.REQUIRED_FIELDS);
      const nameRegex = /^[A-Za-z\s]+$/;
      if (!nameRegex.test(data.name)) {
        throw new Error(ParentValidationErrors.INVALID_NAME);
      }
      if (data.name.length < 2 || data.name.length > 50) {
        throw new Error(ParentValidationErrors.NAME_LENGTH);
      }
    }

    if (data.contactNumber !== undefined) {
      const phoneRegex = /^\+?\d{10}$/;
      if (!phoneRegex.test(data.contactNumber)) {
        throw new Error(ParentValidationErrors.INVALID_CONTACT);
      }
    }

    if (data.whatsappNumber !== undefined) {
      const phoneRegex = /^\+?\d{10}$/;
      if (!phoneRegex.test(data.whatsappNumber)) {
        throw new Error(ParentValidationErrors.INVALID_CONTACT);
      }
    }

    if (data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error(ParentValidationErrors.INVALID_EMAIL);
      }
    }
  }
}
