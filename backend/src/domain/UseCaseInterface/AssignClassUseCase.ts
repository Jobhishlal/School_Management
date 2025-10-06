import { Class } from "../../domain/entities/Class";

export interface IAssignClassUseCase {
  execute(className: string): Promise<Class>;
}
