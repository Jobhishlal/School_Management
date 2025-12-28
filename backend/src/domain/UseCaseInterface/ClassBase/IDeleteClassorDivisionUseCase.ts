export interface IDeleteClassUseCase {
  execute(id: string): Promise<boolean>;
}
