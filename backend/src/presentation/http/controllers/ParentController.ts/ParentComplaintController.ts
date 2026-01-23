import { Request, Response } from "express";
import { CreateParentComplaintUseCase } from "../../../../applications/useCases/Parent/CreateParentComplaintUseCase";
import { GetParentComplaintsUseCase } from "../../../../applications/useCases/Parent/GetParentComplaintsUseCase";
import { UpdateParentComplaintUseCase } from "../../../../applications/useCases/Parent/UpdateParentComplaintUseCase";
import { AuthRequest } from "../../../../infrastructure/types/AuthRequest";
import { StatusCodes } from "../../../../shared/constants/statusCodes";

export class ParentComplaintController {
    constructor(
        private createParentComplaintUseCase: CreateParentComplaintUseCase,
        private getParentComplaintsUseCase: GetParentComplaintsUseCase,
        private updateParentComplaintUseCase: UpdateParentComplaintUseCase
    ) { }

    async createComplaint(req: Request, res: Response): Promise<void> {
        try {
            const { concernTitle, description } = req.body;
            const authReq = req as AuthRequest;
            const parentId = authReq.user?.id;

            if (!parentId) {
                res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
                return;
            }

            if (!concernTitle || !description) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "All fields are required" });
                return;
            }

            const complaint = await this.createParentComplaintUseCase.execute({
                parentId: parentId,
                concernTitle,
                description
            });

            res.status(StatusCodes.CREATED).json({ message: "Complaint created successfully", complaint });
        } catch (error) {
            console.error("Error creating complaint:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
        }
    }

    async getComplaints(req: Request, res: Response): Promise<void> {
        try {
            const authReq = req as AuthRequest;
            const parentId = authReq.user?.id;

            if (!parentId) {
                res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
                return;
            }

            const complaints = await this.getParentComplaintsUseCase.execute(parentId);
            res.status(StatusCodes.OK).json({ complaints });
        } catch (error) {
            console.error("Error fetching complaints:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
        }
    }

    async updateComplaint(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { concernTitle, description } = req.body;
            const authReq = req as AuthRequest;
            const parentId = authReq.user?.id;

            if (!parentId) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }

        

            const updatedComplaint = await this.updateParentComplaintUseCase.execute(id, {
                concernTitle,
                description
            });

            if (!updatedComplaint) {
                res.status(StatusCodes.NOT_FOUND).json({ message: "Complaint not found" });
                return;
            }

            res.status(StatusCodes.CREATED).json({ message: "Complaint updated successfully", complaint: updatedComplaint });
        } catch (error) {
            console.error("Error updating complaint:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
        }
    }
}
