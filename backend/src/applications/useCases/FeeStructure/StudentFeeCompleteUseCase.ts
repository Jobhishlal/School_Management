import { IStudentFullFeePaymentStatusUseCase } from "../../../domain/UseCaseInterface/FeeStructure/IStudentFeePaidDetails";
import { IFeeStructureRepository } from "../../../domain/repositories/FeeDetails/IFeeStructureRepository";

export class StudentPaymentDetailList implements IStudentFullFeePaymentStatusUseCase{
    constructor(private readonly repo:IFeeStructureRepository){}

    async execute(classId: string): Promise<any[]> {
        
        const data = await this.repo.findClassWisePaymentStatus(classId)
        if(!classId){
            throw new Error("does no get class Id")
        }
        return data
    }
    
}