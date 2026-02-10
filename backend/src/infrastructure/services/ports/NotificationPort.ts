import { NotificationDTO } from "../../../applications/dto/AnnouncementNotificationDTO";

export interface NotificationPort {
  send(data: NotificationDTO): Promise<void>;
}