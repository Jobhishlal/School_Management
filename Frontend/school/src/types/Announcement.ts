export interface Announcement {
    _id: string;
    title: string;
    content: string;
    scope: string;
    status: string;
    classes?: string[];
    division?: string;
    activeTime: string;
    endTime: string;
    attachment?: { url: string };
}
