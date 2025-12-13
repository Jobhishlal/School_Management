export class FeeStructureItem {
  constructor(
    public feeTypeId: string,
    public name: string | undefined,
    public amount: number,
    public frequency:string,
    public isOptional: boolean
  ) {}
}

export class FeeStructure {
  constructor(
    public id: string,
    public name: string,
    public classId: string,
    public academicYear: string,
    public feeItems: FeeStructureItem[],
    public notes: string | undefined,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}

