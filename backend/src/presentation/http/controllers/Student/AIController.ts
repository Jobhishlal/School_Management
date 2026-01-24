import { Request, Response } from "express";
import { AskAIDoubtUseCase } from "../../../../applications/useCases/Student/AskAIDoubtUseCase";
import { StatusCodes } from "../../../../shared/constants/statusCodes";

export class AIController {
    constructor(private askAIDoubtUseCase: AskAIDoubtUseCase) { }

    async askDoubt(req: Request, res: Response): Promise<void> {
        try {
            console.log("AIController: Received request", req.body);
            const { question } = req.body;

            if (!question || question.trim().length < 5) {
                console.warn("AIController: Question too short");
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: "Please ask a complete question (at least 5 characters)"
                });
                return;
            }

            const result = await this.askAIDoubtUseCase.execute(question);
            console.log("AIController: Successfully generated response");
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
