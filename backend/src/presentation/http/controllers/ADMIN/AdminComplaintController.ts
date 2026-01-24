import { Request, Response } from "express";
import { IGetAllParentComplaintsUseCase } from "../../../../applications/useCases/Parent/IGetAllParentComplaintsUseCase";
import { IResolveComplaintUseCase } from "../../../../applications/useCases/Parent/IResolveComplaintUseCase";
import { StatusCodes } from "../../../../shared/constants/statusCodes";

export class AdminComplaintController {
    constructor(
        private getAllParentComplaintsUseCase: IGetAllParentComplaintsUseCase,
        private resolveComplaintUseCase: IResolveComplaintUseCase
    ) { }

    async getAllComplaints(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const result = await this.getAllParentComplaintsUseCase.execute(page, limit);
            res.status(StatusCodes.OK).json(result);
        } catch (error) {
            console.error("Error fetching all complaints:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
        }
    }

    async resolveComplaint(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { feedback } = req.body;

            if (!feedback) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Feedback is required" });
                return;
            }

            const updatedComplaint = await this.resolveComplaintUseCase.execute(id, feedback);

            if (!updatedComplaint) {
                res.status(StatusCodes.NOT_FOUND).json({ message: "Complaint not found" });
                return;
            }

            res.status(StatusCodes.OK).json({ message: "Complaint resolved successfully", complaint: updatedComplaint });
        } catch (error) {
            console.error("Error resolving complaint:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
        }
    }
}
