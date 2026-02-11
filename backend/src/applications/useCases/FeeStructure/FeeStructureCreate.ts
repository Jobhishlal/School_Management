import { IFeeStructureRepository } from "../../interface/RepositoryInterface/FeeDetails/IFeeStructureRepository";
import { IFeeTypeRepository } from "../../interface/RepositoryInterface/FeeDetails/IFeeTypeRepository";
import { FeeStructure } from "../../../domain/entities/FeeType/FeeStructure";
import { FeeStructureItem } from "../../../domain/entities/FeeType/FeeStructure";
import { CreateFeeStructureDTO } from "../../dto/FeeDTO/CreateFeeStructureDTO ";
import { ICreateFeeStructureUseCase } from "../../interface/UseCaseInterface/IFeeCreateInterFace";
import { calculateExpiryDate } from "../../../shared/constants/utils/dateUtils";
import { NotificationPort } from "../../../infrastructure/services/ports/NotificationPort";

export class CreateFeeStructureUseCase implements ICreateFeeStructureUseCase {
  constructor(
    private feeStructureRepo: IFeeStructureRepository,
    private feeTypeRepo: IFeeTypeRepository,
    private notificationPort: NotificationPort

  ) { }

  async execute(request: CreateFeeStructureDTO): Promise<FeeStructure> {


    const feeItems: FeeStructureItem[] = [];

    for (const item of request.feeItems) {
      const feeType = await this.feeTypeRepo.findById(item.feeTypeId);
      if (!feeType) throw new Error(`Invalid FeeType: ${item.feeTypeId}`);

      feeItems.push(
        new FeeStructureItem(
          feeType.id,
          feeType.name,
          item.amount,
          feeType.frequency,
          item.isOptional
        )
      );
    }

    const startDate = new Date();

    const effectiveStartDate = request.startDate ? new Date(request.startDate) : new Date();
    const effectiveExpiryDate = request.expiryDate ? new Date(request.expiryDate) : calculateExpiryDate(effectiveStartDate, 4);

    FeeStructure.validateDate(effectiveStartDate, effectiveExpiryDate);

    const feeStructure = new FeeStructure(
      "",
      request.name,
      request.classId,
      request.academicYear,
      feeItems,
      request.notes,
      new Date(),
      new Date(), 
      effectiveStartDate,
      effectiveExpiryDate
    );


    const createdFee = await this.feeStructureRepo.create(feeStructure);

    await this.notificationPort.send({
      title: "New Fee Structure: " + request.name,
      content: `New fee payment details available for ${request.name}`,
      type: "FINANCE",
      scope: "CLASS",
      classes: [request.classId],
      link: "/parent/finance"
    });

    return createdFee;
  }
}
