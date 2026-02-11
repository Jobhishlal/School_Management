import { Announcement } from "../../../domain/entities/Announcement/Announcement";
import { CreateAnnouncementDTO } from "../../dto/Announcement/AnnouncementDTO";
import { IAnnouncementRepository } from "../../interface/RepositoryInterface/Announcement/IAnnouncement";
import { IAnnoucementUseCase } from "../../interface/UseCaseInterface/Announcement/IAnnouncementUseCase";
import { NotificationPort } from "../../../infrastructure/services/ports/NotificationPort";
import { AnnouncementNotificationDTO } from "../../dto/AnnouncementNotificationDTO";
export class AnnouncementUseCase implements IAnnoucementUseCase {
  constructor(
    private repo: IAnnouncementRepository,
    private notification: NotificationPort
  ) { }

  async execute(data: CreateAnnouncementDTO): Promise<Announcement> {
    const announcement = new Announcement(
      undefined,
      data.title,
      data.content,
      data.scope,
      data.classes ?? [],
      data.division ?? null,
      data.attachment,
      new Date(data.activeTime),
      new Date(data.endTime),
      data.status ?? "DRAFT"
    );


    const result = await this.repo.create(announcement);

    const notificationDTO: AnnouncementNotificationDTO = {
      title: result.title ?? '',
      content: result.content ?? '',
      scope: result.scope ?? 'GLOBAL',
      type: 'ANNOUNCEMENT',
      classes: result.classes ?? [],
      division: result.division ?? undefined,
    };

    await this.notification.send(notificationDTO);

    return result;
  }
}
