import { FeeStructure } from "../../../../domain/entities/FeeType/FeeStructure";



export interface IFeeStructureRepository {
    create(feestructure: FeeStructure): Promise<FeeStructure>;
    findById(id: string): Promise<FeeStructure | null>;

    findClassWisePaymentStatus(classId: string, page: number, limit: number): Promise<{ students: ReturnType<typeof JSON.parse>[], total: number }>;
    findStudentPaymentStatusByName(studentName: string): Promise<ReturnType<typeof JSON.parse>[]>;
    findStudentPaymentStatusByName(studentName: string): Promise<ReturnType<typeof JSON.parse>[]>;
    findAll(): Promise<FeeStructure[]>;
    getTotalExpectedFees(): Promise<number>;
}