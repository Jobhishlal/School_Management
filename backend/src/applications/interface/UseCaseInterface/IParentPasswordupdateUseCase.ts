export interface IParentRepository {
  findByEmail(email: string): Promise<{ email: string; id: string; password: string } | null>;
}
