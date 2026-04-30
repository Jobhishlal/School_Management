import { RESPONSE_MESSAGES } from "../../../../shared/constants/responseMessages";
import { Request, Response } from "express";
import { ICreateParentComplaintUseCase } from "../../../../applications/useCases/Parent/ICreateParentComplaintUseCase";
import { IGetParentComplaintsUseCase } from "../../../../applications/useCases/Parent/IGetParentComplaintsUseCase";
import { IUpdateParentComplaintUseCase } from "../../../../applications/useCases/Parent/IUpdateParentComplaintUseCase";
import { AuthRequest } from "../../../../infrastructure/types/AuthRequest";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { validateComplaintCreate } from '../../../validators/ParentComplaintValidation/ComplaintValidators';

export class ParentComplaintController {
    constructor(
        private createParentComplaintUseCase: ICreateParentComplaintUseCase,
        private getParentComplaintsUseCase: IGetParentComplaintsUseCase,
        private updateParentComplaintUseCase: IUpdateParentComplaintUseCase
    ) { }

    async createComplaint(req: Request, res: Response): Promise<void> {
        try {
            const { concernTitle, description } = req.body;
            const authReq = req as AuthRequest;
            const parentId = authReq.user?.id;

            if (!parentId) {
                res.status(StatusCodes.UNAUTHORIZED).json({ message: RESPONSE_MESSAGES.UNAUTHORIZED });
                return;
            }

            validateComplaintCreate({ concernTitle, description });

            const complaint = await this.createParentComplaintUseCase.execute({
                parentId: parentId,
                concernTitle,
                description
            });

            res.status(StatusCodes.CREATED).json({ message: RESPONSE_MESSAGES.COMPLAINT_CREATED_SUCCESSFULLY, complaint });
        } catch (error) {
            console.error("Error creating complaint:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR_2 });
        }
    }

    async getComplaints(req: Request, res: Response): Promise<void> {
        try {
            const authReq = req as AuthRequest;
            const parentId = authReq.user?.id;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 5;

            if (!parentId) {
                res.status(StatusCodes.UNAUTHORIZED).json({ message: RESPONSE_MESSAGES.UNAUTHORIZED });
                return;
            }

            const result = await this.getParentComplaintsUseCase.execute(parentId, page, limit);
            res.status(StatusCodes.OK).json(result);
        } catch (error) {
            console.error("Error fetching complaints:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR_2 });
        }
    }

    async updateComplaint(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { concernTitle, description } = req.body;
            const authReq = req as AuthRequest;
            const parentId = authReq.user?.id;

            if (!parentId) {
                res.status(401).json({ message: RESPONSE_MESSAGES.UNAUTHORIZED });
                return;
            }

            validateComplaintCreate({ concernTitle, description });

            const updatedComplaint = await this.updateParentComplaintUseCase.execute(id, {
                concernTitle,
                description
            });

            if (!updatedComplaint) {
                res.status(StatusCodes.NOT_FOUND).json({ message: RESPONSE_MESSAGES.COMPLAINT_NOT_FOUND });
                return;
            }

            res.status(StatusCodes.CREATED).json({ message: RESPONSE_MESSAGES.COMPLAINT_UPDATED_SUCCESSFULLY, complaint: updatedComplaint });
        } catch (error) {
            console.error("Error updating complaint:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR_2 });
        }
    }
}
