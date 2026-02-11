import { ExpensePaymentMode } from "../../enums/FeeStructure/ExpensePaymentMode";

export class Expense {
  private _id: string;
  private _title: string;
  private _description: string;
  private _amount: number;
  private _expenseDate: Date;
  private _paymentMode: ExpensePaymentMode;
  private _status: "PENDING" | "APPROVED" | "REJECTED";
  private _createdBy: string;
  private _approvedBy?: string;
  private _createdAt?: Date;
  private _updatedAt?: Date;

  constructor(
    id: string,
    title: string,
    description: string,
    amount: number,
    expenseDate: Date,
    paymentMode: ExpensePaymentMode,
    status: "PENDING" | "APPROVED" | "REJECTED",
    createdBy: string,
    approvedBy?: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this._id = id;
    this._title = title;
    this._description = description;
    this._amount = amount;
    this._expenseDate = expenseDate;
    this._paymentMode = paymentMode;
    this._status = status;
    this._createdBy = createdBy;
    this._approvedBy = approvedBy;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  get id(): string { return this._id; }
  set id(value: string) { this._id = value; }

  get title(): string { return this._title; }
  set title(value: string) { this._title = value; }

  get description(): string { return this._description; }
  set description(value: string) { this._description = value; }

  get amount(): number { return this._amount; }
  set amount(value: number) { this._amount = value; }

  get expenseDate(): Date { return this._expenseDate; }
  set expenseDate(value: Date) { this._expenseDate = value; }

  get paymentMode(): ExpensePaymentMode { return this._paymentMode; }
  set paymentMode(value: ExpensePaymentMode) { this._paymentMode = value; }

  get status(): "PENDING" | "APPROVED" | "REJECTED" { return this._status; }
  set status(value: "PENDING" | "APPROVED" | "REJECTED") { this._status = value; }

  get createdBy(): string { return this._createdBy; }
  set createdBy(value: string) { this._createdBy = value; }

  get approvedBy(): string | undefined { return this._approvedBy; }
  set approvedBy(value: string | undefined) { this._approvedBy = value; }

  get createdAt(): Date | undefined { return this._createdAt; }
  set createdAt(value: Date | undefined) { this._createdAt = value; }

  get updatedAt(): Date | undefined { return this._updatedAt; }
  set updatedAt(value: Date | undefined) { this._updatedAt = value; }

  public static validate(data: {
    title?: string;
    amount?: number;
    expenseDate?: string | Date;
    paymentMode?: string;
  }): void {
    if (data.title !== undefined) {
      if (!data.title.trim()) {
        throw new Error("Expense title is required");
      }
    }

    if (data.amount !== undefined) {
      if (data.amount <= 0) {
        throw new Error("Expense amount must be greater than zero");
      }
    }

    if (data.expenseDate !== undefined) {
      if (!data.expenseDate) {
        throw new Error("Expense date is required");
      }
    }

    if (data.paymentMode !== undefined) {
      const validModes = ["CASH", "UPI", "BANK_TRANSFER"];
      if (!validModes.includes(data.paymentMode)) {
        throw new Error("Invalid payment mode");
      }
    }
  }
}