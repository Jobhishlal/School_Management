export class FeeStructureItem {
  constructor(
    public feeTypeId: string,
    public name: string | undefined,
    public amount: number,
    public frequency: string,
    public isOptional: boolean
  ) { }
}

export class FeeStructure {
  private _id: string;
  private _name: string;
  private _classId: string;
  private _academicYear: string;
  private _feeItems: FeeStructureItem[];
  private _notes: string | undefined;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _startDate: Date;
  private _expiryDate: Date;

  constructor(
    id: string,
    name: string,
    classId: string,
    academicYear: string,
    feeItems: FeeStructureItem[],
    notes: string | undefined,
    createdAt: Date,
    updatedAt: Date,
    startDate: Date,
    expiryDate: Date
  ) {
    this._id = id;
    this._name = name;
    this._classId = classId;
    this._academicYear = academicYear;
    this._feeItems = feeItems;
    this._notes = notes;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._startDate = startDate;
    this._expiryDate = expiryDate;
  }

  get id(): string { return this._id; }
  set id(value: string) { this._id = value; }

  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }

  get classId(): string { return this._classId; }
  set classId(value: string) { this._classId = value; }

  get academicYear(): string { return this._academicYear; }
  set academicYear(value: string) { this._academicYear = value; }

  get feeItems(): FeeStructureItem[] { return this._feeItems; }
  set feeItems(value: FeeStructureItem[]) { this._feeItems = value; }

  get notes(): string | undefined { return this._notes; }
  set notes(value: string | undefined) { this._notes = value; }

  get createdAt(): Date { return this._createdAt; }
  set createdAt(value: Date) { this._createdAt = value; }

  get updatedAt(): Date { return this._updatedAt; }
  set updatedAt(value: Date) { this._updatedAt = value; }

  get startDate(): Date { return this._startDate; }
  set startDate(value: Date) { this._startDate = value; }

  get expiryDate(): Date { return this._expiryDate; }
  set expiryDate(value: Date) { this._expiryDate = value; }

  public static validateDate(startDate: Date, expiryDate: Date): void {
    const start = new Date(startDate);
    const end = new Date(expiryDate);
    const now = new Date();

   

    if (end <= start) {
      throw new Error("Expiry date must be after start date");
    }
  }

  public calculateTotalAmount(): number {
    return this._feeItems.reduce((sum, item) => sum + item.amount, 0);
  }
}

