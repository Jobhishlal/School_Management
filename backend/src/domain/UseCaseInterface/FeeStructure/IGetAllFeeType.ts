import { FeeType } from "../../entities/FeeType/FeeType";

export interface IGetAllFeeType {
  execute(): Promise<FeeType[]>;
}
