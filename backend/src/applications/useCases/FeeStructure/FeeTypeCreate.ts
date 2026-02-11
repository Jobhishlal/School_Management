import { FeeType, OfferEntity } from "../../../domain/entities/FeeType/FeeType";
import { IFeeTypeRepository } from "../../interface/RepositoryInterface/FeeDetails/IFeeTypeRepository";
import { CreateFeeTypeDTO } from "../../dto/FeeDTO/CreateFeeTypeDTO";
import { ITypeCreateUseCase } from "../../interface/UseCaseInterface/FeeStructure/IFeeTypeCreate";
import { CalculateAmount } from "../../../shared/constants/utils/FeeCalculate";


export class CreateFeeTypeUseCase implements ITypeCreateUseCase {
  constructor(private repo: IFeeTypeRepository) { }

  async execute(request: CreateFeeTypeDTO): Promise<FeeType> {
    const { name, description, defaultAmount, frequency, isOptional, isActive, offers } = request;

    const offerEntities = (offers || []).map(offer => new OfferEntity(
      offer.type,
      offer.discountPercentage,
      offer.discountAmount,
      offer.finalAmount,
      offer.validUntil
    ));

    const feeType = new FeeType(
      "",
      name,
      description || "",
      defaultAmount,
      frequency,
      isOptional ?? false,
      isActive ?? true,
      offerEntities
    );

    if (feeType.offers && feeType.offers.length > 0) {
      feeType.offers = feeType.offers.map(offer => {
        const calculatedAmount = CalculateAmount(feeType, offer.type);
        return new OfferEntity(
          offer.type,
          offer.discountPercentage,
          offer.discountAmount,
          calculatedAmount, // Set the calculated amount
          offer.validUntil
        );
      });
    }


    return await this.repo.create(feeType);
  }
}
