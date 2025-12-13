import { FeeType } from "../../../domain/entities/FeeType/FeeType";
import { IFeeTypeRepository } from "../../../domain/repositories/FeeDetails/IFeeTypeRepository";
import { CreateFeeTypeDTO } from "../../dto/FeeDTO/CreateFeeTypeDTO";
import { ITypeCreateUseCase } from "../../../domain/UseCaseInterface/FeeStructure/IFeeTypeCreate";
import { CalculateAmount } from "../../../shared/constants/utils/FeeCalculate";
import { FeeTypeValidationfunction } from "../../validators/FeeStructureValidation/CreateValidationFeeStructure";


export class CreateFeeTypeUseCase implements ITypeCreateUseCase {
  constructor(private repo: IFeeTypeRepository) {}

  async execute(request: CreateFeeTypeDTO): Promise<FeeType> {
    const { name, description, defaultAmount, frequency, isOptional, isActive, offers } = request;

    FeeTypeValidationfunction(request)

    const feeType = new FeeType(
      "",
      name,
      description || "",
      defaultAmount,
      frequency,
      isOptional ?? false,
      isActive ?? true,
      offers || []
    );

    if (feeType.offers && feeType.offers.length > 0) {
      feeType.offers = feeType.offers.map(offer => {
        const calculatedAmount = CalculateAmount(feeType, offer.type);
        return {
          ...offer,
          finalAmount: calculatedAmount, 
        };
      });
    }

  
    return await this.repo.create(feeType);
  }
}
