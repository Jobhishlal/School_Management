export class StudentFeeInstallment {
  constructor(
    public dueDate: Date,
    public amount: number,
    public paid: boolean = false,
    public paidAt?: Date
  ) {}
}

export class StudentFeeRecord {
  constructor(
    public id: string,
    public studentId: string,
    public feeStructureId: string,
    public totalAmount: number,
    public balanceAmount: number,
    public installments: StudentFeeInstallment[],
    public status: 'Pending' | 'Partially Paid' | 'Paid',
    public createdAt: Date
  ) {}
}