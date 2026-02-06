export interface NotificationDTO {
    title: string;
    content: string;
    type: 'ANNOUNCEMENT' | 'MEETING' | 'FINANCE' | 'PAYMENT';
    scope: 'GLOBAL' | 'CLASS' | 'DIVISION' | 'USER';
    classes: string[];
    division?: string | undefined;
    link?: string;
    recipientId?: string;
}

export type AnnouncementNotificationDTO = NotificationDTO; // Alias for backward compatibility if needed