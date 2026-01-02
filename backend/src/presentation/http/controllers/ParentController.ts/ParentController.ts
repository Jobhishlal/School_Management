
import { GetAllParentsUseCase } from "../../../../applications/useCases/Parent/GetAllParents";
import { ParentAddUseCase } from "../../../../applications/useCases/Parent/ParentUseCase";
import { Request, Response } from "express";
import { ParentEntity } from "../../../../domain/entities/Parents";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { Iupdatparentusecase } from "../../../../domain/UseCaseInterface/IParentUseCase";
import { IGetParentProfileUseCase } from "../../../../domain/UseCaseInterface/Parent/IGetParentProfileUseCase";


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

        } catch (err: any) {
            console.error(err.message);
            res.status(StatusCodes.BAD_REQUEST).json({
                message: err.message || "Failed to create parent"
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

    async getProfile(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params; // Assuming id comes from params or auth middleware populates user
            // Note: For a "me" endpoint, id usually comes from req.user.id
            // But here keeping generic as per existing pattern or specific ID request
            // For parent self-view, route should probably use req.user.id (from token)
            // Let's assume the route passes ID as param for now or use middleware extracted ID if available
            // If this is for "My Profile", usage would be: const id = (req as any).user.id;

            // Let's use the ID passed in params for consistency with admin views,
            // OR if this is strictly for Parent Portal, we might need to extract from token.
            // Given the request "setup parents profile page", it implies Parent View.
            // I'll stick to params for flexibility, but frontend should pass it.

            const profile = await this.getParentProfile.execute(id);
            res.status(StatusCodes.OK).json(profile);
        } catch (error: any) {
            console.error("Error fetching parent profile:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message || "Failed to fetch profile"
            });
        }
    }
}
