import {SubAdminEntities} from '../../../domain/entities/SubAdmin'


export interface SubAdminRepository{
    create(admin:SubAdminEntities):Promise<SubAdminEntities>;
    findByEmail(email:string):Promise<SubAdminEntities | null>;
    findAll():Promise<SubAdminEntities[]>;
    findByPhone(phone: string): Promise<SubAdminEntities | null>;
    update(id:string,updates:Partial<SubAdminEntities>):Promise<SubAdminEntities  | null >;
    findById(id:string):Promise<SubAdminEntities | null >;
     updatePassword(id: string, hashedPassword: string): Promise<SubAdminEntities | null>;

}