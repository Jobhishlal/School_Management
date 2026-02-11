import { IGETALLCLASSTEACHER } from "../../interface/UseCaseInterface/ClassBase/IGetAllTeacherstClass";
import { IClassDivisionRepository } from "../../interface/RepositoryInterface/Classrepo/IClassDivisionview";


export class GetAssignClassTeacher implements IGETALLCLASSTEACHER{
    constructor(private readonly iclassrepo:IClassDivisionRepository){}
      async execute(): Promise<{ teacherId: string; name: string; }[]> {
          const data  = await this.iclassrepo.getAllTeacher()
          return data
      }
    }
