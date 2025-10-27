export interface GenerateStudentFeeDTO {
  studentId: string;
  feeStructureId: string;
  dueDate?: string;
  notes?: string;
}