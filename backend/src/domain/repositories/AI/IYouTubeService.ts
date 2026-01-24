export interface IYouTubeVideo {
    id: string;
    title: string;
    thumbnail: string;
    url: string;
}

export interface IYouTubeService {
    searchVideos(query: string): Promise<IYouTubeVideo[]>;
}
