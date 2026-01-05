import { FeeStructure } from "../../entities/FeeType/FeeStructure";

export interface IGetAllFeeStructures {
    execute(): Promise<FeeStructure[]>;
}
