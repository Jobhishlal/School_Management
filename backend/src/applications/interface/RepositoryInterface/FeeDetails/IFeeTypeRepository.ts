import { FeeType } from "../../../../domain/entities/FeeType/FeeType";

export interface IFeeTypeRepository{
    create(feeType:FeeType):Promise<FeeType>;
    findById(id:string):Promise<FeeType|null>;
    findByName(name:string):Promise<FeeType|null>;
    findAll():Promise<FeeType[]>;
    update(id:string,feeType:Partial<FeeType>):Promise<FeeType|null>;
    delete(id:string):Promise<void>
}
