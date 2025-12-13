export interface UpdateFeeStructureDTO {
  name?: string;
  notes?: string;
  feeItems?: {
    feeTypeId: string;
    amount?: number;
  }[];
}