export interface NotificationDTO {
    title: string;
    content: string;
    type: 'ANNOUNCEMENT' | 'MEETING' | 'FINANCE';
    scope: 'GLOBAL' | 'CLASS' | 'DIVISION';
    classes: string[];
    division?: string | undefined;
    link?: string;
}

export type AnnouncementNotificationDTO = NotificationDTO; // Alias for backward compatibility if needed