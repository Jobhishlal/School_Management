import { IGetAllFeeStructures } from "../../../domain/UseCaseInterface/FeeStructure/IGetAllFeeStructures";
import { IFeeStructureRepository } from "../../../domain/repositories/FeeDetails/IFeeStructureRepository";
import { FeeStructure } from "../../../domain/entities/FeeType/FeeStructure";

export class GetAllFeeStructures implements IGetAllFeeStructures {
    constructor(private feeStructureRepository: IFeeStructureRepository) { }

    async execute(): Promise<FeeStructure[]> {
        return this.feeStructureRepository.findAll();
    }
}
