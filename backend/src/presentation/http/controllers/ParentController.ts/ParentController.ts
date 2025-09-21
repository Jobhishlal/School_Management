
import { ParentgetAll } from "../../../../applications/useCases/Parent/GetAllParents";
import { ParentAddUseCase } from "../../../../applications/useCases/Parent/ParentUseCase";
import { Request,Response } from "express";
import { ParentEntity } from "../../../../domain/entities/Parents";
import { StatusCodes } from "../../../../shared/constants/statusCodes";


export class ParentManagementCOntroller{
    constructor(
        private readonly ParentAddController:ParentAddUseCase,
        private readonly getAllParents:ParentgetAll

    ){}
    async create(req:Request,res:Response):Promise<void>{
        try{
            const { name, contactNumber, whatsappNumber, email, relationship} =req.body;
            const Parent = new ParentEntity(
                "",
                name,
               contactNumber,
               whatsappNumber,
               email || "",
                relationship

            )
            console.log(req.body)
            const createParent = await this.ParentAddController.execute(Parent)
           res.status(StatusCodes.OK).json({
  message: "Parent Create Successfully",
  parent: {
    _id: createParent.id || "", 
    name: createParent.name,
    contactNumber: createParent.contactNumber,
    whatsappNumber: createParent.whatsappNumber,
    email: createParent.email,
    relationship: createParent.relationship
  }
});

        }catch(err:any){
           console.error(err.message)
           res.status(StatusCodes.BAD_REQUEST).json({message:"Its show an error",err:err.message})
        }
    }
    async getAll(req:Request,res:Response):Promise<void>{
        try {
            const parents = await this.getAllParents.execute()
            res.status(StatusCodes.OK).json(parents)
        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json({message:"Its failed to fetch backend",error})
        }
    }

}

