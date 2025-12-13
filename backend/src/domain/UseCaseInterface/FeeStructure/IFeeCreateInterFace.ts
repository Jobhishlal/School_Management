import { FeeStructure } from "../../../domain/entities/FeeType/FeeStructure";
import { CreateFeeStructureDTO } from "../../../applications/dto/FeeDTO/CreateFeeStructureDTO ";

export interface ICreateFeeStructureUseCase {
  execute(request: CreateFeeStructureDTO): Promise<FeeStructure>;
}
