export class FeeStructureItem {
  constructor(
    public feeTypeId: string,
    public amount: number
  ) {}
}

export class FeeStructure {
  constructor(
    public id: string,
    public classId: string,
    public academicYear: string,
    public fees: FeeStructureItem[],
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}