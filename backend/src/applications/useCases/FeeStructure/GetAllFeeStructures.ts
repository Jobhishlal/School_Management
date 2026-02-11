import { IGetAllFeeStructures } from "../../interface/UseCaseInterface/FeeStructure/IGetAllFeeStructures";
import { IFeeStructureRepository } from "../../interface/RepositoryInterface/FeeDetails/IFeeStructureRepository";
import { FeeStructure } from "../../../domain/entities/FeeType/FeeStructure";

export class GetAllFeeStructures implements IGetAllFeeStructures {
    constructor(private feeStructureRepository: IFeeStructureRepository) { }

    async execute(): Promise<FeeStructure[]> {
        return this.feeStructureRepository.findAll();
    }
}
