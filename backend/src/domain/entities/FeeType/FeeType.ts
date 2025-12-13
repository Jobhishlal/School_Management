import { OfferInterface } from "../../../infrastructure/database/models/FeeManagement/FeeType";

export class FeeType {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public defaultAmount: number,
    public frequency: "ONCE" | "MONTHLY" | "YEARLY",
    public isOptional: boolean,
    public isActive: boolean,
    public offers?: OfferInterface[]  
  ) {}
}
