import { IFeeTypeRepository } from "../../../applications/interface/RepositoryInterface/FeeDetails/IFeeTypeRepository";
import { FeeType } from "../../../domain/entities/FeeType/FeeType";
import { FeeTypeModel } from "../../database/models/FeeManagement/FeeType";


export class FeeTypeManagemnt implements IFeeTypeRepository {
  
  async create(feeType: FeeType): Promise<FeeType> {
    const created = await FeeTypeModel.create({
      name: feeType.name,
      description: feeType.description,
      defaultAmount: feeType.defaultAmount,
      frequency: feeType.frequency,
      isOptional: feeType.isOptional,
      isActive: feeType.isActive,
      Offers:feeType.offers
    });

    return new FeeType(
      created.id.toString(),
      created.name,
      created.description,
      created.defaultAmount,
      created.frequency,
      created.isOptional,
      created.isActive,
      created.Offers
    );
  }

  async findById(id: string): Promise<FeeType | null> {
    const found = await FeeTypeModel.findById(id);
    if (!found) return null;

    return new FeeType(
      found.id.toString(),
      found.name,
      found.description,
      found.defaultAmount,
      found.frequency,
      found.isOptional,
      found.isActive,
      found.Offers
    );
  }

  async findByName(name: string): Promise<FeeType | null> {
    const found = await FeeTypeModel.findOne({ name });
    if (!found) return null;

    return new FeeType(
      found.id.toString(),
      found.name,
      found.description,
      found.defaultAmount,
      found.frequency,
      found.isOptional,
      found.isActive,
      found.Offers
    );
  }

  async findAll(): Promise<FeeType[]> {
    const results = await FeeTypeModel.find();
    return results.map(
      (r) =>
        new FeeType(
          r.id.toString(),
          r.name,
          r.description,
          r.defaultAmount,
          r.frequency,
          r.isOptional,
          r.isActive,
          r.Offers
        )
    );
  }

  async update(id: string, feeType: Partial<FeeType>): Promise<FeeType | null> {
    const updated = await FeeTypeModel.findByIdAndUpdate(id, feeType, { new: true });
    if (!updated) return null;

    return new FeeType(
      updated.id.toString(),
      updated.name,
      updated.description,
      updated.defaultAmount,
      updated.frequency,
      updated.isOptional,
      updated.isActive,
      updated.Offers
    );
  }

  async delete(id: string): Promise<void> {
    await FeeTypeModel.findByIdAndDelete(id);
  }
}
