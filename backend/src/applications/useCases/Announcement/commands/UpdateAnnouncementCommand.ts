export interface UpdateAnnouncementCommand {
    title?: string;
    content?: string;
    scope?: "GLOBAL" | "CLASS" | "DIVISION";
    classes?: string[];
    division?: string | null;
    attachment?: {
        url: string;
        filename: string;
        uploadAt: string;
    };
    activeTime?: Date;
    endTime?: Date;
    status?: "DRAFT" | "ACTIVE";
}
