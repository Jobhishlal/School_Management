import { ParentResponseDTO } from "../../../applications/dto/ParentResponse";

export interface IGetAllParentsUseCase {
  execute(): Promise<ParentResponseDTO[]>;
}