import { IFeeStructureRepository } from "../../../domain/repositories/FeeDetails/IFeeStructureRepository";
import { IFeeTypeRepository } from "../../../domain/repositories/FeeDetails/IFeeTypeRepository";
import { FeeStructure } from "../../../domain/entities/FeeType/FeeStructure";
import { FeeStructureItem } from "../../../domain/entities/FeeType/FeeStructure";
import { CreateFeeStructureDTO } from "../../dto/FeeDTO/CreateFeeStructureDTO ";
import { ICreateFeeStructureUseCase } from "../../../domain/UseCaseInterface/FeeStructure/IFeeCreateInterFace";
import { CreateValidationFeeStructure } from "../../validators/FeeStructureValidation/FeeStructurevalidation";
import { calculateExpiryDate } from "../../../shared/constants/utils/dateUtils";
import { SendEMail } from "../../../infrastructure/providers/EmailService";
import { feeExpiredTemplate } from "../../../shared/constants/utils/templates/FeeExpiredTemplate";
import { NotificationPort } from "../../../infrastructure/services/ports/NotificationPort";

export class CreateFeeStructureUseCase implements ICreateFeeStructureUseCase {
  constructor(
    private feeStructureRepo: IFeeStructureRepository,
    private feeTypeRepo: IFeeTypeRepository,
    private notificationPort: NotificationPort

  ) { }

  async execute(request: CreateFeeStructureDTO): Promise<FeeStructure> {
    CreateValidationFeeStructure(request);

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
    const expiryDate = calculateExpiryDate(startDate, 4);

    const feeStructure = new FeeStructure(
      "",
      request.name,
      request.classId,
      request.academicYear,
      feeItems,
      request.notes,
      startDate,
      startDate,
      startDate,
      expiryDate
    );


    const createdFee = await this.feeStructureRepo.create(feeStructure);

    // Emit Notification
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