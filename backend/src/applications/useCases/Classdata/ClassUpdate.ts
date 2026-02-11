
import { IClassUpdateUseCase } from "../../interface/UseCaseInterface/IClassUpdateUseCase";
import { IClassRepository } from "../../../domain/repositories/Classrepo/IClassRepository";
import { Class } from "../../../domain/entities/Class";
import { validateClassUpdate } from '../../validators/ClassValidate';
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
