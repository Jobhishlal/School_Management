import { RESPONSE_MESSAGES } from "../../../../shared/constants/responseMessages";
import { Request, Response } from "express";
import { IAskAIDoubtUseCase } from "../../../../applications/useCases/Student/interfaces/IAskAIDoubtUseCase";
import { IGetStudentChatHistoryUseCase } from "../../../../applications/useCases/Student/interfaces/IGetStudentChatHistoryUseCase";
import { IGetChatSessionUseCase } from "../../../../applications/useCases/Student/interfaces/IGetChatSessionUseCase";
import { IDeleteChatSessionUseCase } from "../../../../applications/useCases/Student/interfaces/IDeleteChatSessionUseCase";
import { StatusCodes } from "../../../../shared/constants/statusCodes";

export class AIController {
    constructor(
        private askAIDoubtUseCase: IAskAIDoubtUseCase,
        private getStudentChatHistoryUseCase: IGetStudentChatHistoryUseCase,
        private getChatSessionUseCase: IGetChatSessionUseCase,
        private deleteChatSessionUseCase: IDeleteChatSessionUseCase
    ) { }

    async askDoubt(req: Request, res: Response): Promise<void> {
        try {
            console.log("AIController: askDoubt called", req.body);
            const { question, sessionId } = req.body;
            // @ts-ignore
            const studentId = req.user?.id;
            console.log("AIController: askDoubt studentId:", studentId);

            if (!studentId) {
                console.warn("AIController: askDoubt Unauthorized - No studentId");
                res.status(StatusCodes.UNAUTHORIZED).json({ message: RESPONSE_MESSAGES.UNAUTHORIZED });
                return;
            }

            if (!question || question.trim().length < 5) {
                console.warn("AIController: Question too short");
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: RESPONSE_MESSAGES.PLEASE_ASK_A_COMPLETE_QUESTION_AT_LEAST_5_CHARACTE
                });
                return;
            }

            const result = await this.askAIDoubtUseCase.execute(studentId, question, sessionId);
            console.log("AIController: Successfully generated response");
            res.status(StatusCodes.OK).json({ success: true, data: result });

        } catch (error: unknown) {
            console.error("AI Controller Error:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: (error as Error).message || "Something went wrong"
            });
        }
    }

    async getHistory(req: Request, res: Response): Promise<void> {
        try {
            console.log("AIController: getHistory called");
            // @ts-ignore
            const studentId = req.user?.id;
            console.log("AIController: getHistory studentId:", studentId);

            if (!studentId) {
                console.warn("AIController: getHistory Unauthorized - No studentId");
                res.status(StatusCodes.UNAUTHORIZED).json({ message: RESPONSE_MESSAGES.UNAUTHORIZED });
                return;
            }

            const history = await this.getStudentChatHistoryUseCase.execute(studentId);
            res.status(StatusCodes.OK).json({ success: true, data: history });
        } catch (error: unknown) {
            console.error("AI Controller Error (History):", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: (error as Error).message || "Failed to fetch history"
            });
        }
    }

    async getSession(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const session = await this.getChatSessionUseCase.execute(id);

            if (!session) {
                res.status(StatusCodes.NOT_FOUND).json({ success: false, message: RESPONSE_MESSAGES.SESSION_NOT_FOUND });
                return;
            }

            res.status(StatusCodes.OK).json({ success: true, data: session });
        } catch (error: unknown) {
            console.error("AI Controller Error (Session):", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: (error as Error).message || "Failed to fetch session"
            });
        }
    }
    async deleteSession(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            // @ts-ignore
            const studentId = req.user?.id;

            if (!studentId) {
                res.status(StatusCodes.UNAUTHORIZED).json({ message: RESPONSE_MESSAGES.UNAUTHORIZED });
                return;
            }

           
            await this.deleteChatSessionUseCase.execute(id);

            res.status(StatusCodes.OK).json({ success: true, message: RESPONSE_MESSAGES.SESSION_DELETED_SUCCESSFULLY });
        } catch (error: unknown) {
            console.error("AI Controller Error (Delete):", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: (error as Error).message || "Failed to delete session"
            });
        }
    }
}
