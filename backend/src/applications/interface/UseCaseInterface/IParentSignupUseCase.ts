import { ParentSignUpEntity } from "../../../domain/entities/ParentSignupEntity";
import { ParentLoginDTO } from "../../dto/ParentLoginDTO";

export interface IParentSignupUseCase {
  execute(dto: ParentLoginDTO): Promise<ParentSignUpEntity>;
}
