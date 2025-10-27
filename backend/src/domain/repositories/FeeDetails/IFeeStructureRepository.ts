import { FeeStructure } from "../../entities/FeeType/FeeStructure";


export interface IFeeStructureRepository{
    create(feestructure:FeeStructure):Promise<FeeStructure>;
    findById(id:string):Promise<FeeStructure|null>;
    findByClassAndYear(classId: string, academicYear: string): Promise<FeeStructure | null>;
    findAll(): Promise<FeeStructure[]>;
    update(id: string, update: Partial<FeeStructure>): Promise<FeeStructure | null>;
    delete(id: string): Promise<void>;
}