import bcrypt from 'bcrypt';


export class MainAdminPassHash{
    static async comparePassword(plain:string,hashed:string):Promise<Boolean>{
        return bcrypt.compare(plain,hashed)
    }
}