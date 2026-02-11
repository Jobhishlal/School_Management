export class OfferEntity {
  private _type: string;
  private _discountPercentage?: number;
  private _discountAmount?: number;
  private _finalAmount?: number;
  private _validUntil?: Date;

  constructor(
    type: string,
    discountPercentage?: number,
    discountAmount?: number,
    finalAmount?: number,
    validUntil?: Date
  ) {
    this._type = type;
    this._discountPercentage = discountPercentage;
    this._discountAmount = discountAmount;
    this._finalAmount = finalAmount;
    this._validUntil = validUntil;
  }

  get type(): string { return this._type; }
  set type(value: string) { this._type = value; }

  get discountPercentage(): number | undefined { return this._discountPercentage; }
  set discountPercentage(value: number | undefined) { this._discountPercentage = value; }

  get discountAmount(): number | undefined { return this._discountAmount; }
  set discountAmount(value: number | undefined) { this._discountAmount = value; }

  get finalAmount(): number | undefined { return this._finalAmount; }
  set finalAmount(value: number | undefined) { this._finalAmount = value; }

  get validUntil(): Date | undefined { return this._validUntil; }
  set validUntil(value: Date | undefined) { this._validUntil = value; }
}

export class FeeType {
  private _id: string;
  private _name: string;
  private _description: string;
  private _defaultAmount: number;
  private _frequency: "ONCE" | "MONTHLY" | "YEARLY";
  private _isOptional: boolean;
  private _isActive: boolean;
  private _offers: OfferEntity[] | undefined;

  constructor(
    id: string,
    name: string,
    description: string,
    defaultAmount: number,
    frequency: "ONCE" | "MONTHLY" | "YEARLY",
    isOptional: boolean,
    isActive: boolean,
    offers?: OfferEntity[]
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

  get offers(): OfferEntity[] | undefined { return this._offers; }
  set offers(value: OfferEntity[] | undefined) { this._offers = value; }

  public static validate(data: {
    name?: string;
    description?: string;
    defaultAmount?: number;
    frequency?: string;
  }): void {
    if (data.name !== undefined) {
      if (!data.name.trim()) {
        throw new Error("Fee type name is required");
      }
    }

    if (data.defaultAmount !== undefined) {
      if (data.defaultAmount < 0) {
        throw new Error("Default amount cannot be negative");
      }
    }

    if (data.frequency !== undefined) {
      const validFrequencies = ["ONCE", "MONTHLY", "YEARLY"];
      if (!validFrequencies.includes(data.frequency)) {
        throw new Error("Invalid frequency");
      }
    }
  }
}
