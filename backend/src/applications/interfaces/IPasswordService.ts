
export interface IPasswordService {
    compare(plain: string, hashed: string): Promise<boolean>;
    hash(plain: string): Promise<string>;
}
