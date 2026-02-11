
import { IParentRepository } from "../../../domain/repositories/IParentsRepository";
import { IGetAllParentsUseCase } from "../../interface/UseCaseInterface/ParentuseCase/IparentGetUseCase";
import { ParentResponseDTO } from "../../dto/ParentResponse";

export class GetAllParentsUseCase implements IGetAllParentsUseCase {
  constructor(private readonly parentRepo: IParentRepository) {}

  async execute(): Promise<ParentResponseDTO[]> {
    const parents = await this.parentRepo.getAll();

    
    return parents.map((parent) => ({
      id: parent.id,
      name: parent.name ?? "",
      contactNumber: parent.contactNumber,
      whatsappNumber: parent.whatsappNumber,
      email: parent.email,
      relationship: parent.relationship,
    }));
  }
}
