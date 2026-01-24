import axios from "axios";
import { IYouTubeService, IYouTubeVideo } from "../../domain/repositories/AI/IYouTubeService";

export class YouTubeService implements IYouTubeService {
    private apiKey: string;
    private baseUrl = "https://www.googleapis.com/youtube/v3/search";

    constructor() {
        this.apiKey = process.env.YOUTUBE_API_KEY || "";
    }

    async searchVideos(query: string): Promise<IYouTubeVideo[]> {
        try {
            const response = await axios.get(this.baseUrl, {
                params: {
                    part: "snippet",
                    q: query,
                    key: this.apiKey,
                    type: "video",
                    maxResults: 3,
                    videoEmbeddable: "true"
                }
            });

            return response.data.items.map((item: any) => ({
                id: item.id.videoId,
                title: item.snippet.title,
                thumbnail: item.snippet.thumbnails.medium.url,
                url: `https://www.youtube.com/watch?v=${item.id.videoId}`
            }));
        } catch (error) {
            console.error("YouTube API Error:", error);
            // Return empty array instead of failing completely, so AI answer still works
            return [];
        }
    }
}
