import { FeeStructure } from "../../../../domain/entities/FeeType/FeeStructure";

export interface IGetAllFeeStructures {
    execute(): Promise<FeeStructure[]>;
}
