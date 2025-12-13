
import { ParentEntity } from "../../entities/Parents";
import { ParentStudentFetchDTO } from "../../../applications/dto/FeeDTO/ParentStudentFinanceDTO";

export interface IParentStudentList {
  execute(request: ParentStudentFetchDTO): Promise<ParentEntity | null>;
}
