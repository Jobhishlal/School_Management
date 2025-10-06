import bcrypt from 'bcrypt'
import { genaratePassword } from '../../../shared/constants/utils/TempPassGenarator'
import { IPasswordsubadmin } from '../../../domain/UseCaseInterface/SubAdmin/IPasswordHash'

export class GenaratePasswordSubAdmin implements IPasswordsubadmin{
    async execute(): Promise<{ plain: string; hashed: string; }> {
        const plain = genaratePassword()
        const hashed = await bcrypt.hash(plain,10)
        console.log("plain subadmin",plain)
        return {plain,hashed}
    }
}