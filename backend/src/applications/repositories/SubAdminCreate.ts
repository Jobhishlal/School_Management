import {SubAdminEntities} from '../../domain/entities/SubAdmin'


export interface SubAdminRepository{
    create(admin:SubAdminEntities):Promise<SubAdminEntities>;
    findByEmail(email:string):Promise<SubAdminEntities | null>;
    findAll():Promise<SubAdminEntities[]>
}