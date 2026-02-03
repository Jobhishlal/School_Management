import { NotificationDTO } from "../dto/AnnouncementNotificationDTO";

export interface NotificationPort {
  send(data: NotificationDTO): Promise<void>;
}