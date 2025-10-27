export interface CreateFeeTypeDTO{
    name:string;
    description?:string;
    defaultAmount:number;
    frequency: "ONCE" | "MONTHLY" | "YEARLY";
    isOptional?: boolean;

}