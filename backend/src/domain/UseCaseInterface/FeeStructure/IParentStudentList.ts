
import { ParentEntity } from "../../entities/Parents";
import { ParentLoginDTO } from "../../../applications/dto/ParentLoginDTO";

export interface IParentStudentList {
  execute(request: ParentLoginDTO): Promise<ParentEntity | null>;
}
