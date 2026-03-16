import { Class } from "../../../domain/entities/Class";

export interface IClassUpdateUseCase {
  execute(id: string, update: Partial<Class>): Promise<Class | null>;
}