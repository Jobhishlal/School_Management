import { IYouTubeVideo } from "../repositories/AI/IYouTubeService";

export interface AIChatMessage {
    id: string;
    role: 'user' | 'ai';
    content: string;
    videos?: IYouTubeVideo[];
    timestamp: Date;
}

export class AISession {
    constructor(
        public readonly id: string,
        public readonly studentId: string,
        public title: string,
        public messages: AIChatMessage[],
        public createdAt: Date,
        public updatedAt: Date
    ) { }
}
