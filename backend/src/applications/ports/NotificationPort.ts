import { AnnouncementNotificationDTO } from "../dto/AnnouncementNotificationDTO";

export interface NotificationPort {
  send(data: AnnouncementNotificationDTO): Promise<void>;
}