
import { ParentEntity } from "../../../../domain/entities/Parents";
import { ParentStudentFetchDTO } from "../../../dto/FeeDTO/ParentStudentFinanceDTO";

export interface IParentStudentList {
  execute(request: ParentStudentFetchDTO): Promise<ParentEntity | null>;
}
