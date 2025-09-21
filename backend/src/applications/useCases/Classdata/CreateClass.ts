import { IClassRepository } from "../../../domain/repositories/IClassRepository";
import { Class } from "../../../domain/entities/Class";

export class CreateClassUseCase {
  constructor(private readonly classRepo: IClassRepository) {}

  async execute(data: Class): Promise<Class> {
    return await this.classRepo.create(data);
  }
}
