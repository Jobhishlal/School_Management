import { ParentUseCase } from "../../../domain/UseCaseInterface/IParentCreate";
import { IParentRepository } from "../../../domain/repositories/IParentsRepository";
import { ParentEntity } from "../../../domain/entities/Parents";

export class ParentAddUseCase implements ParentUseCase {
  constructor(private readonly parentRepo: IParentRepository) {}

  async execute(parent: ParentEntity): Promise<ParentEntity> {
    const created = await this.parentRepo.create(parent);
    return created;
  }
}
