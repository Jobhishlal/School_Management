import { ParentResponseDTO } from "../../../dto/ParentResponse";

export interface IGetAllParentsUseCase {
  execute(): Promise<ParentResponseDTO[]>;
}