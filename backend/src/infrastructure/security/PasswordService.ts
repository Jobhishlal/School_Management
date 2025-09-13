import bcrypt from "bcryptjs";
export class Passwordservices{
  static async hashpassword(password:string):Promise<string>{
    return bcrypt.hash(password,10);
  }

  static async compare(raw:string,hashed:string):Promise<boolean>{
    return bcrypt.compare(raw,hashed)
  }
}