import { FeeStructure } from "../../entities/FeeType/FeeStructure";



export interface IFeeStructureRepository{
    create(feestructure:FeeStructure):Promise<FeeStructure>;
    findById(id:string):Promise<FeeStructure|null>;
  
   findClassWisePaymentStatus(classId: string): Promise<any[]>;
   findStudentPaymentStatusByName(studentName:string):Promise<any[]>;
}