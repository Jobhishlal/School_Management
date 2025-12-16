import { FeeStructure } from "../entities/FeeType/FeeStructure";
import { IFeeStructure } from "../../infrastructure/database/models/FeeManagement/FeeStructure";
import { FeeStructureItem } from "../entities/FeeType/FeeStructure";
export class FeeStructureMapper {
  static toPersistence(domain: FeeStructure) {
    return {
      name: domain.name,
      classId: domain.classId,
      academicYear: domain.academicYear,
      feeItems: domain.feeItems.map(item => ({
        feeTypeId: item.feeTypeId,
        name: item.name,
        amount: item.amount,
        frequency: item.frequency,
        isOptional: item.isOptional
      })),
      notes: domain.notes,
      startDate: domain.startDate,    
      expiryDate: domain.expiryDate   
    };
  }

  static toDomain(model: IFeeStructure): FeeStructure {
    return new FeeStructure(
      model.id.toString(),
      model.name,
      model.classId.toString(),
      model.academicYear,
      model.feeItems.map(item =>
        new FeeStructureItem(
          item.feeTypeId.toString(),
          item.name,
          item.amount,
          item.frequency,
          item.isOptional
        )
      ),
      model.notes,
      model.createdAt,
      model.updatedAt,
      model.startDate,   
      model.expiryDate   
    );
  }
}
