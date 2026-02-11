import { IClassRepository } from "../../interface/RepositoryInterface/Classrepo/IClassRepository";
import { Class } from "../../../domain/entities/Class";
import { ClassValidate } from "../../validators/ClassValidate";

export class CreateClassUseCase {
  constructor(private readonly classRepo: IClassRepository) {}

  async execute(data: Class): Promise<Class> {
    ClassValidate(data)
    return await this.classRepo.create(data);
  }
}
