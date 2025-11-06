import { FeeType } from "../../entities/FeeType/FeeType";
import { CreateFeeTypeDTO } from "../../../applications/dto/FeeDTO/CreateFeeTypeDTO";

export interface ITypeCreateUseCase{
    execute(createfeetype:CreateFeeTypeDTO):Promise<FeeType>
}