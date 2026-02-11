import { Class } from "../../../domain/entities/Class";
import { IClassRepository } from "../../interface/RepositoryInterface/Classrepo/IClassRepository";


export class GetAllClass{
    constructor(private readonly getAll:IClassRepository){}

    async execute():Promise<Class[]>{
    const newclass = await this.getAll.getAll()
    return newclass
    }
}