import { StudentValidationErrors } from "../enums/StudentError";

export class Students {
  private _id: string;
  private _fullName: string;
  private _dateOfBirth: Date;
  private _gender: "Male" | "Female" | "Other";
  private _studentId: string;
  private _parentId: string;
  private _addressId: string;
  private _classId: string;
  private _photos: { url: string; filename: string; uploadedAt: Date }[];
  private _Password: string;
  private _parent?: { id: string; name: string; contactNumber: string; whatsappNumber?: string; email?: string; relationship?: string };
  private _classDetails?: { id: string; className: string; division: string; department: string; rollNumber: string };
  private _blocked: boolean;
  private _address?: { id: string; street?: string; city?: string; state?: string; pincode?: string };
  private _role?: string;

  constructor(
    id: string,
    fullName: string,
    dateOfBirth: Date,
    gender: "Male" | "Female" | "Other",
    studentId: string,
    parentId: string,
    addressId: string,
    classId: string,
    photos: { url: string; filename: string; uploadedAt: Date }[] = [],
    Password: string,
    parent?: { id: string; name: string; contactNumber: string; whatsappNumber?: string; email?: string; relationship?: string },
    classDetails?: { id: string; className: string; division: string; department: string; rollNumber: string },
    blocked: boolean = false,
    address?: { id: string; street?: string; city?: string; state?: string; pincode?: string },
    role?: string
  ) {
    this._id = id;
    this._fullName = fullName;
    this._dateOfBirth = dateOfBirth;
    this._gender = gender;
    this._studentId = studentId;
    this._parentId = parentId;
    this._addressId = addressId;
    this._classId = classId;
    this._photos = photos;
    this._Password = Password;
    this._parent = parent;
    this._classDetails = classDetails;
    this._blocked = blocked;
    this._address = address;
    this._role = role;
  }

  get id(): string { return this._id; }
  set id(value: string) { this._id = value; }

  get fullName(): string { return this._fullName; }
  set fullName(value: string) { this._fullName = value; }

  get dateOfBirth(): Date { return this._dateOfBirth; }
  set dateOfBirth(value: Date) { this._dateOfBirth = value; }

  get gender(): "Male" | "Female" | "Other" { return this._gender; }
  set gender(value: "Male" | "Female" | "Other") { this._gender = value; }

  get studentId(): string { return this._studentId; }
  set studentId(value: string) { this._studentId = value; }

  get parentId(): string { return this._parentId; }
  set parentId(value: string) { this._parentId = value; }

  get addressId(): string { return this._addressId; }
  set addressId(value: string) { this._addressId = value; }

  get classId(): string { return this._classId; }
  set classId(value: string) { this._classId = value; }

  get photos(): { url: string; filename: string; uploadedAt: Date }[] { return this._photos; }
  set photos(value: { url: string; filename: string; uploadedAt: Date }[]) { this._photos = value; }

  get Password(): string { return this._Password; }
  set Password(value: string) { this._Password = value; }

  get parent(): { id: string; name: string; contactNumber: string; whatsappNumber?: string; email?: string; relationship?: string } | undefined { return this._parent; }
  set parent(value: { id: string; name: string; contactNumber: string; whatsappNumber?: string; email?: string; relationship?: string } | undefined) { this._parent = value; }

  get classDetails(): { id: string; className: string; division: string; department: string; rollNumber: string } | undefined { return this._classDetails; }
  set classDetails(value: { id: string; className: string; division: string; department: string; rollNumber: string } | undefined) { this._classDetails = value; }

  get blocked(): boolean { return this._blocked; }
  set blocked(value: boolean) { this._blocked = value; }

  get address(): { id: string; street?: string; city?: string; state?: string; pincode?: string } | undefined { return this._address; }
  set address(value: { id: string; street?: string; city?: string; state?: string; pincode?: string } | undefined) { this._address = value; }

  get role(): string | undefined { return this._role; }
  set role(value: string | undefined) { this._role = value; }

  public static validate(data: {
    fullName?: string;
    dateOfBirth?: Date;
    gender?: string;
    photos?: { url: string }[];
  }): void {
    if (data.fullName !== undefined) {
      const nameRegex = /^[A-Za-z\s]+$/;
      if (!nameRegex.test(data.fullName)) {
        throw new Error(StudentValidationErrors.INVALID_FULLNAME);
      }
      if (data.fullName.length < 2 || data.fullName.length > 50) {
        throw new Error(StudentValidationErrors.FULLNAME_LENGTH);
      }
    }

    if (data.gender !== undefined) {
      const validGenders = ["Male", "Female", "Other"];
      if (!validGenders.includes(data.gender)) {
        throw new Error(StudentValidationErrors.INVALID_GENDER);
      }
    }

    if (data.dateOfBirth !== undefined) {
      const dob = new Date(data.dateOfBirth);
      const today = new Date();
      if (dob > today) {
        throw new Error(StudentValidationErrors.DOB_FUTURE);
      }
      const age = today.getFullYear() - dob.getFullYear();
      if (age < 3 || age > 25) {
        throw new Error(StudentValidationErrors.DOB_AGE_LIMIT);
      }
    }

    if (data.photos && data.photos.length > 0) {
      data.photos.forEach(photo => {
        if (!photo.url.match(/\.(jpg|jpeg|png)$/i)) {
          throw new Error(StudentValidationErrors.INVALID_PHOTO);
        }
      });
    }
  }
}
