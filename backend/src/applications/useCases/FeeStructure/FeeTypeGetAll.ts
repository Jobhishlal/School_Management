import { IGetAllFeeType } from "../../interface/UseCaseInterface/FeeStructure/IGetAllFeeType";
import { FeeType } from "../../../domain/entities/FeeType/FeeType";
import { IFeeTypeRepository } from "../../interface/RepositoryInterface/FeeDetails/IFeeTypeRepository";

export class GetFeeTypeAll implements IGetAllFeeType {
  constructor(private repo: IFeeTypeRepository) {}

  async execute(): Promise<FeeType[]> {
    const data = await this.repo.findAll();
    return data;
  }
}
