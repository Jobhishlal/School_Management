export interface CreateFeeStructureDTO {
  name: string;
  classId: string;
  academicYear: string;
  feeItems: {
    feeTypeId: string;
    amount: number;
    isOptional: boolean;
  }[];
  notes?: string;
  startDate:Date;
  expiryDate:Date;
}
