import { FeeType } from "../../../../domain/entities/FeeType/FeeType";

export interface IGetAllFeeType {
  execute(): Promise<FeeType[]>;
}
