import { IStudentFullFeePaymentStatusUseCase } from "../../interface/UseCaseInterface/FeeStructure/IStudentFeePaidDetails";
import { IFeeStructureRepository } from "../../../domain/repositories/FeeDetails/IFeeStructureRepository";

export class StudentPaymentDetailList implements IStudentFullFeePaymentStatusUseCase {
    constructor(private readonly repo: IFeeStructureRepository) { }

    async execute(classId: string, page: number, limit: number): Promise<{ students: any[], total: number }> {

        if (!classId) {
            throw new Error("does no get class Id")
        }
        const data = await this.repo.findClassWisePaymentStatus(classId, page, limit)
        return data
    }

}