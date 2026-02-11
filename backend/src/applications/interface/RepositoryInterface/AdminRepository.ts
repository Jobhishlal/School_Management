import {AdminResponseDTO} from '../../dto/Admin'

export interface IAdminRepository{
    create(admin:AdminResponseDTO):Promise<AdminResponseDTO>;
    findByEmail(email:string):Promise<AdminResponseDTO|null>;
    findByUserName(username: string): Promise<AdminResponseDTO | null>; 
    getAll():Promise<AdminResponseDTO[]>
}