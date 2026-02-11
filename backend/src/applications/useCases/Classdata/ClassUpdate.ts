
import { IClassUpdateUseCase } from "../../interface/UseCaseInterface/IClassUpdateUseCase";
import { IClassRepository } from "../../interface/RepositoryInterface/Classrepo/IClassRepository";
import { Class } from "../../../domain/entities/Class";
import { validateClassUpdate } from "../../../presentation/validators/ClassValidation/ClassValidators";
export class UpdateClassUseCase implements IClassUpdateUseCase {
  constructor(private classRepo: IClassRepository) {}

  async execute(id: string, update: Partial<Class>): Promise<Class | null> {
    validateClassUpdate(update)
    const updatedClass = await this.classRepo.updateClass(id, update);

    if (!updatedClass) {

      return null;
    }

    return updatedClass;
  }
}
