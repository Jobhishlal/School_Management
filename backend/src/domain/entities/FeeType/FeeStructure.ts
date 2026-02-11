import { FeeStructureError } from "../../enums/FeeStructure/FeeStructure";

export class FeeStructureItem {
  private _feeTypeId: string;
  private _name: string | undefined;
  private _amount: number;
  private _frequency: string;
  private _isOptional: boolean;

  constructor(
    feeTypeId: string,
    name: string | undefined,
    amount: number,
    frequency: string,
    isOptional: boolean
  ) {
    this._feeTypeId = feeTypeId;
    this._name = name;
    this._amount = amount;
    this._frequency = frequency;
    this._isOptional = isOptional;
  }

  get feeTypeId(): string { return this._feeTypeId; }
  set feeTypeId(value: string) { this._feeTypeId = value; }

  get name(): string | undefined { return this._name; }
  set name(value: string | undefined) { this._name = value; }

  get amount(): number { return this._amount; }
  set amount(value: number) { this._amount = value; }

  get frequency(): string { return this._frequency; }
  set frequency(value: string) { this._frequency = value; }

  get isOptional(): boolean { return this._isOptional; }
  set isOptional(value: boolean) { this._isOptional = value; }
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

  public static validate(data: {
    name?: string;
    classId?: string;
    academicYear?: string;
    feeItems?: any[];
    startDate?: string | Date;
    expiryDate?: string | Date;
  }): void {
    if (data.name !== undefined) {
      if (data.name.trim() === "") {
        throw new Error(FeeStructureError.EMPTY_NAME);
      }
    }

    if (data.academicYear !== undefined) {
      if (!/^\d{4}-\d{4}$/.test(data.academicYear)) {
        throw new Error(FeeStructureError.INVALID_ACADEMIC_YEAR);
      }
    }

    if (data.feeItems !== undefined) {
      if (data.feeItems.length === 0) {
        throw new Error(FeeStructureError.EMPTY_FEE_ITEMS);
      }

      const seenFeeTypes = new Set<string>();
      data.feeItems.forEach((item, index) => {
        if (!item.feeTypeId) {
          throw new Error(`${FeeStructureError.INVALID_FEE_TYPE_ID} at index ${index}`);
        }
        if (seenFeeTypes.has(item.feeTypeId)) {
          throw new Error(FeeStructureError.DUPLICATE_FEE_TYPE);
        }
        seenFeeTypes.add(item.feeTypeId);

        if (Number(item.amount) <= 0) {
          throw new Error(FeeStructureError.INVALID_AMOUNT);
        }
      });
    }

    if (data.startDate !== undefined && data.expiryDate !== undefined) {
      this.validateDate(new Date(data.startDate), new Date(data.expiryDate));
    }
  }

  public static validateDate(startDate: Date, expiryDate: Date): void {
    const start = new Date(startDate);
    const end = new Date(expiryDate);
    if (isNaN(start.getTime())) throw new Error(FeeStructureError.INVALID_START_DATE);
    if (isNaN(end.getTime())) throw new Error(FeeStructureError.INVALID_EXPIRY_DATE);
    if (end <= start) {
      throw new Error(FeeStructureError.EXPIRY_BEFORE_START);
    }
  }

  public calculateTotalAmount(): number {
    return this._feeItems.reduce((sum, item) => sum + item.amount, 0);
  }
}
