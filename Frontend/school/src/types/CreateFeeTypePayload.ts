

export interface OfferInterface {
  type: string; 
  discountPercentage?: number;
  discountAmount?: number;
  finalAmount?: number; 
  validUntil?: string; 
}



export interface CreateFeeTypePayload {
  name: string;
  description?: string;
  defaultAmount: number | ""; 
  frequency: "ONCE" | "MONTHLY" | "YEARLY";
  isOptional?: boolean;
  isActive?: boolean;
  offers:OfferInterface[]
}
