import { AIController } from "../../presentation/http/controllers/Student/AIController";
import { AskAIDoubtUseCase } from "../../applications/useCases/Student/AskAIDoubtUseCase";
import { GetStudentChatHistoryUseCase } from "../../applications/useCases/Student/GetStudentChatHistoryUseCase";
import { GetChatSessionUseCase } from "../../applications/useCases/Student/GetChatSessionUseCase";
import { DeleteChatSessionUseCase } from "../../applications/useCases/Student/DeleteChatSessionUseCase";
import { GeminiAIService } from "../services/GeminiAIService";
import { YouTubeService } from "../services/YouTubeService";
import { MongoAISessionRepo } from "../repositories/AI/MongoAISessionRepo";

// Repositories
const sessionRepo = new MongoAISessionRepo();

// Services
const aiService = new GeminiAIService();
const youtubeService = new YouTubeService();

// Use Cases
const askAIDoubtUseCase = new AskAIDoubtUseCase(aiService, youtubeService, sessionRepo);
const getStudentHistoryUseCase = new GetStudentChatHistoryUseCase(sessionRepo);
const getChatSessionUseCase = new GetChatSessionUseCase(sessionRepo);
const deleteChatSessionUseCase = new DeleteChatSessionUseCase(sessionRepo);

// Controller
export const aiController = new AIController(
    askAIDoubtUseCase,
    getStudentHistoryUseCase,
    getChatSessionUseCase,
    deleteChatSessionUseCase
);
