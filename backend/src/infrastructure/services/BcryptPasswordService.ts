
import bcrypt from "bcrypt";
import { IPasswordService } from "../../applications/interfaces/IPasswordService";

export class BcryptPasswordService implements IPasswordService {
    async compare(plain: string, hashed: string): Promise<boolean> {
        return await bcrypt.compare(plain, hashed);
    }

    async hash(plain: string): Promise<string> {
        return await bcrypt.hash(plain, 10);
    }
}
