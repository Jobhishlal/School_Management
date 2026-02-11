import { Class } from "../entities/Class";

export interface IClassUpdateUseCase {
  execute(id: string, update: Partial<Class>): Promise<Class | null>;
}