import { FeeStructure } from "../../entities/FeeType/FeeStructure";



export interface IFeeStructureRepository {
    create(feestructure: FeeStructure): Promise<FeeStructure>;
    findById(id: string): Promise<FeeStructure | null>;

    findClassWisePaymentStatus(classId: string, page: number, limit: number): Promise<{ students: any[], total: number }>;
    findStudentPaymentStatusByName(studentName: string): Promise<any[]>;
    findAll(): Promise<FeeStructure[]>;
}