import { Request, Response } from "express";
import { AskAIDoubtUseCase } from "../../../applications/useCases/Student/AskAIDoubtUseCase";
import { StatusCodes } from "../../../shared/constants/statusCodes";

export class AIController {
    constructor(private askAIDoubtUseCase: AskAIDoubtUseCase) { }

    async askDoubt(req: Request, res: Response): Promise<void> {
        try {
            const { question } = req.body;

            if (!question) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Question is required" });
                return;
            }

            const result = await this.askAIDoubtUseCase.execute(question);
            res.status(StatusCodes.OK).json({ success: true, data: result });

        } catch (error: any) {
            console.error("AI Controller Error:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || "Something went wrong"
            });
        }
    }
}
