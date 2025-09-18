import {MainAdmin} from '../entities/MainAdmin'
export interface SuperAdminLoRepo{
    create(MainAdmin:MainAdmin):Promise<string>;
    findByEmail(email:string):Promise<string>
}