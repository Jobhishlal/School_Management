import { hashedPassword,genaratePassword } from "../../../shared/constants/utils/TempPassGenarator";
import { IGenarateTempPassword } from "../../interface/UseCaseInterface/StudentCreate/GenaratePassword";


export class GenarateTempPassword implements IGenarateTempPassword{
   async execute():Promise<{plain:string,hashed:string}>{
        const plain = genaratePassword()
        const hashed = await hashedPassword(plain)
        return {plain,hashed}
    }
}