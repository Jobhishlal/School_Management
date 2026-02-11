import { IClassRepository } from "../../../domain/repositories/Classrepo/IClassRepository";
import { Class } from "../../../domain/entities/Class";
import { IAssignClassUseCase } from "../../interface/UseCaseInterface/AssignClassUseCase";


export class AssignClass implements IAssignClassUseCase{
    constructor(private readonly classRepo:IClassRepository){}
    async execute(className: string): Promise<Class> {
         const assignedClass = await this.classRepo.assignClassWithDivision(className);

    if (!assignedClass) {
      throw new Error(`All divisions for class ${className} are full`);
    }

    return assignedClass;
  }
    }

