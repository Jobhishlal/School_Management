import { ParentEntity } from "../../../domain/entities/Parents";

import { IParentRepository } from "../../../domain/repositories/IParentsRepository";


export class ParentgetAll {
    constructor(private readonly getall:IParentRepository){}
   async execute():Promise<ParentEntity[]>{
    const parents  = this.getall.getAll()
     return parents
   }
}