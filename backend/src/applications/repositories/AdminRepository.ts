import {Admin} from '../../domain/dto/Admin'

export interface IAdminRepository{
    create(admin:Admin):Promise<Admin>;
    findByEmail(email:string):Promise<Admin|null>;
    findByUserName(username: string): Promise<Admin | null>; 
    getAll():Promise<Admin[]>
}