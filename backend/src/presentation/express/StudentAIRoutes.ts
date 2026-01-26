import { Router } from "express";
import { AIController } from "../http/controllers/Student/AIController";
import { AskAIDoubtUseCase } from "../../applications/useCases/Student/AskAIDoubtUseCase";
import { GetStudentChatHistoryUseCase } from "../../applications/useCases/Student/GetStudentChatHistoryUseCase";
import { GetChatSessionUseCase } from "../../applications/useCases/Student/GetChatSessionUseCase";
import { DeleteChatSessionUseCase } from "../../applications/useCases/Student/DeleteChatSessionUseCase";
import { GeminiAIService } from "../../infrastructure/services/GeminiAIService";
import { YouTubeService } from "../../infrastructure/services/YouTubeService";
import { MongoAISessionRepo } from "../../infrastructure/repositories/AI/MongoAISessionRepo";

import { authMiddleware } from "../../infrastructure/middleware/AuthMiddleWare";



const studentAIRouter = Router();

const aiService = new GeminiAIService();
const youtubeService = new YouTubeService();
const sessionRepo = new MongoAISessionRepo();

const askAIDoubtUseCase = new AskAIDoubtUseCase(aiService, youtubeService, sessionRepo);
const getStudentHistoryUseCase = new GetStudentChatHistoryUseCase(sessionRepo);
const getChatSessionUseCase = new GetChatSessionUseCase(sessionRepo);
const deleteChatSessionUseCase = new DeleteChatSessionUseCase(sessionRepo);

const aiController = new AIController(askAIDoubtUseCase, getStudentHistoryUseCase, getChatSessionUseCase, deleteChatSessionUseCase);

studentAIRouter.post('/ask', authMiddleware, (req, res) => aiController.askDoubt(req, res));
studentAIRouter.get('/history', authMiddleware, (req, res) => aiController.getHistory(req, res));
studentAIRouter.get('/session/:id', authMiddleware, (req, res) => aiController.getSession(req, res));
studentAIRouter.delete('/session/:id', authMiddleware, (req, res) => aiController.deleteSession(req, res));

export default studentAIRouter;
