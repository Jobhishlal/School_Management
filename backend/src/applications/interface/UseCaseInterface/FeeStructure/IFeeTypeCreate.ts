import { FeeType } from "../../../../domain/entities/FeeType/FeeType";
import { CreateFeeTypeDTO } from "../../../dto/FeeDTO/CreateFeeTypeDTO";

export interface ITypeCreateUseCase{
    execute(createfeetype:CreateFeeTypeDTO):Promise<FeeType>
}