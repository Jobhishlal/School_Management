
import { GetAllParentsUseCase } from "../../../../applications/useCases/Parent/GetAllParents";
import { ParentAddUseCase } from "../../../../applications/useCases/Parent/ParentUseCase";
import { Request, Response } from "express";
import { ParentEntity } from "../../../../domain/entities/Parents";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { Iupdatparentusecase } from "../../../../applications/interface/UseCaseInterface/IParentUseCase";
import { IGetParentProfileUseCase } from "../../../../applications/interface/UseCaseInterface/Parent/IGetParentProfileUseCase";
import { validateParentCreate, validateParentUpdate } from '../../../validators/ParentValidation/ParentValidators';


export class ParentManagementCOntroller {
    constructor(
        private readonly ParentAddController: ParentAddUseCase,
        private readonly getAllParents: GetAllParentsUseCase,
        private readonly updateParents: Iupdatparentusecase,
        private readonly getParentProfile: IGetParentProfileUseCase

    ) { }
    async create(req: Request, res: Response): Promise<void> {
        try {
            const { name, contactNumber, whatsappNumber, email, relationship } = req.body;

            validateParentCreate(req.body);
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

        } catch (err: unknown) {
            console.error((err as Error).message);
            res.status(StatusCodes.BAD_REQUEST).json({
                message: (err as Error).message || "Failed to create parent"
            });
        }

    }
    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const parents = await this.getAllParents.execute()
            res.status(StatusCodes.OK).json(parents)
        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "Its failed to fetch backend", error })
        }
    }

    async updateparents(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const update = req.body;

            validateParentUpdate(update);

            const updateparent = await this.updateParents.execute(id, update);

            if (!updateparent) {
                res.status(StatusCodes.NOT_FOUND).json({ message: "Parents Not Found" });
                return;
            }


            res.status(StatusCodes.OK).json({ message: "Parent Update Successfully", parent: updateparent });
        } catch (error: unknown) {
            console.error("Error updating parent:", (error as Error).message);

            const isValidationError = (error as Error).message.includes("valid") || (error as Error).message.includes("required");

            const statusCode = isValidationError ?
                StatusCodes.BAD_REQUEST :
                StatusCodes.INTERNAL_SERVER_ERROR;

            res.status(statusCode).json({
                message: (error as Error).message || "Failed to update parent",
            });
        }
    }

    async getProfile(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;



            const profile = await this.getParentProfile.execute(id);
            res.status(StatusCodes.OK).json(profile);
        } catch (error: unknown) {
            console.error("Error fetching parent profile:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: (error as Error).message || "Failed to fetch profile"
            });
        }
    }
}
