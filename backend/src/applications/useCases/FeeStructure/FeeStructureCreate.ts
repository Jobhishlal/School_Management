import { IFeeStructureRepository } from "../../../domain/repositories/FeeDetails/IFeeStructureRepository";
import { IFeeTypeRepository } from "../../../domain/repositories/FeeDetails/IFeeTypeRepository";
import { FeeStructure } from "../../../domain/entities/FeeType/FeeStructure";
import { FeeStructureItem } from "../../../domain/entities/FeeType/FeeStructure";
import { CreateFeeStructureDTO } from "../../dto/FeeDTO/CreateFeeStructureDTO ";
import { ICreateFeeStructureUseCase } from "../../../domain/UseCaseInterface/FeeStructure/IFeeCreateInterFace";


export class CreateFeeStructureUseCase implements ICreateFeeStructureUseCase {
  constructor(
    private feeStructureRepo: IFeeStructureRepository,
    private feeTypeRepo: IFeeTypeRepository
  ) {}

  async execute(request: CreateFeeStructureDTO): Promise<FeeStructure> {

    const feeItems: FeeStructureItem[] = [];

    for (const item of request.feeItems) {
      const feeType = await this.feeTypeRepo.findById(item.feeTypeId);
      if (!feeType) {
        throw new Error(`Invalid FeeType: ${item.feeTypeId}`);
      }

      const feeItem = new FeeStructureItem(
        feeType.id,
        feeType.name,
        item.amount,
        feeType.frequency,          
        item.isOptional
      );

      feeItems.push(feeItem);
    }

    const feeStructure = new FeeStructure(
      "",
      request.name,
      request.classId,
      request.academicYear,
      feeItems,
      request.notes,
      new Date(),
      new Date()
    );

    return await this.feeStructureRepo.create(feeStructure);
  }
}
