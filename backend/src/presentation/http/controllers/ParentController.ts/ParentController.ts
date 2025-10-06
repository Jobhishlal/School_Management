
import { GetAllParentsUseCase } from "../../../../applications/useCases/Parent/GetAllParents";
import { ParentAddUseCase } from "../../../../applications/useCases/Parent/ParentUseCase";
import { Request,Response } from "express";
import { ParentEntity } from "../../../../domain/entities/Parents";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { Iupdatparentusecase } from "../../../../domain/UseCaseInterface/IParentUseCase";


export class ParentManagementCOntroller{
    constructor(
        private readonly ParentAddController:ParentAddUseCase,
        private readonly getAllParents:GetAllParentsUseCase,
        private readonly updateParents:Iupdatparentusecase

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

        }catch (err: any) {
  console.error(err.message);
  res.status(StatusCodes.BAD_REQUEST).json({
    message: err.message || "Failed to create parent"
  });
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
 
async updateparents(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const update = req.body;
        
        const updateparent = await this.updateParents.execute(id, update);
        
        if (!updateparent) {
            res.status(StatusCodes.NOT_FOUND).json({ message: "Parents Not Found" });
            return;
        }
    
        
        res.status(StatusCodes.OK).json({ message: "Parent Update Successfully", parent: updateparent });
        } catch (error: any) {
        console.error("Error updating parent:", error.message);

        const isValidationError = error.message.includes("valid") || error.message.includes("required");

        const statusCode = isValidationError ? 
            StatusCodes.BAD_REQUEST : 
            StatusCodes.INTERNAL_SERVER_ERROR;

        res.status(statusCode).json({
            message: error.message || "Failed to update parent",
        });
    }
}
}

