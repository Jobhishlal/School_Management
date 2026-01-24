import { Router } from "express";
import { AIController } from "../http/controllers/Student/AIController";
import { AskAIDoubtUseCase } from "../../applications/useCases/Student/AskAIDoubtUseCase";
import { GeminiAIService } from "../../infrastructure/services/GeminiAIService";
import { YouTubeService } from "../../infrastructure/services/YouTubeService";

const studentAIRouter = Router();

const aiService = new GeminiAIService();
const youtubeService = new YouTubeService();
const askAIDoubtUseCase = new AskAIDoubtUseCase(aiService, youtubeService);
const aiController = new AIController(askAIDoubtUseCase);

studentAIRouter.post('/ask', (req, res) => aiController.askDoubt(req, res));

export default studentAIRouter;
