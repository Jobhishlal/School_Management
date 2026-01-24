import { IAIService } from "../../domain/repositories/AI/IAIService";
import { IYouTubeService, IYouTubeVideo } from "../../domain/repositories/AI/IYouTubeService";

interface AIResponse {
    answer: string;
    videos: IYouTubeVideo[];
}

export class AskAIDoubtUseCase {
    constructor(
        private aiService: IAIService,
        private youtubeService: IYouTubeService
    ) { }

    async execute(question: string): Promise<AIResponse> {
        if (!question) {
            throw new Error("Question is required");
        }

        // Run both requests in parallel for better performance
        const [answer, videos] = await Promise.all([
            this.aiService.getAnswer(question),
            this.youtubeService.searchVideos(question)
        ]);

        return { answer, videos };
    }
}
