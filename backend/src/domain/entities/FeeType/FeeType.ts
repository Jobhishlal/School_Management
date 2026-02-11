import { OfferInterface } from "../../../infrastructure/database/models/FeeManagement/FeeType";

export class FeeType {
  private _id: string;
  private _name: string;
  private _description: string;
  private _defaultAmount: number;
  private _frequency: "ONCE" | "MONTHLY" | "YEARLY";
  private _isOptional: boolean;
  private _isActive: boolean;
  private _offers: OfferInterface[] | undefined;

  constructor(
    id: string,
    name: string,
    description: string,
    defaultAmount: number,
    frequency: "ONCE" | "MONTHLY" | "YEARLY",
    isOptional: boolean,
    isActive: boolean,
    offers?: OfferInterface[]
  ) {
    this._id = id;
    this._name = name;
    this._description = description;
    this._defaultAmount = defaultAmount;
    this._frequency = frequency;
    this._isOptional = isOptional;
    this._isActive = isActive;
    this._offers = offers;
  }

  get id(): string { return this._id; }
  set id(value: string) { this._id = value; }

  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }

  get description(): string { return this._description; }
  set description(value: string) { this._description = value; }

  get defaultAmount(): number { return this._defaultAmount; }
  set defaultAmount(value: number) { this._defaultAmount = value; }

  get frequency(): "ONCE" | "MONTHLY" | "YEARLY" { return this._frequency; }
  set frequency(value: "ONCE" | "MONTHLY" | "YEARLY") { this._frequency = value; }

  get isOptional(): boolean { return this._isOptional; }
  set isOptional(value: boolean) { this._isOptional = value; }

  get isActive(): boolean { return this._isActive; }
  set isActive(value: boolean) { this._isActive = value; }

  get offers(): OfferInterface[] | undefined { return this._offers; }
  set offers(value: OfferInterface[] | undefined) { this._offers = value; }
}
