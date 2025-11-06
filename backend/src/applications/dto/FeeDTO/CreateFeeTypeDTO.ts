import { OfferInterface } from "../../../infrastructure/database/models/FeeManagement/FeeType";
export interface CreateFeeTypeDTO{
    name:string;
    description?:string;
    defaultAmount:number;
    frequency: "ONCE" | "MONTHLY" | "YEARLY";
    isOptional?: boolean;
    isActive?:boolean;
    offers:OfferInterface[]

}