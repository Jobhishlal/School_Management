import { Announcement } from "../../../domain/entities/Announcement/Announcement";
import { CreateAnnouncementDTO } from "../../dto/AnnouncementDTO";
import { IAnnouncementRepository } from "../../../domain/repositories/Announcement/IAnnouncement";
import { IAnnoucementUseCase } from "../../../domain/UseCaseInterface/Announcement/IAnnouncementUseCase";
import { NotificationPort } from "../../../infrastructure/services/ports/NotificationPort";
import { AnnouncementNotificationDTO } from "../../dto/AnnouncementNotificationDTO";
import { ValidateAnnouncementCreate } from "../../validators/AnnouncementValidation";
export class AnnouncementUseCase implements IAnnoucementUseCase {
  constructor(
    private repo: IAnnouncementRepository,
    private notification: NotificationPort
  ) { }

  async execute(data: CreateAnnouncementDTO): Promise<Announcement> {
    ValidateAnnouncementCreate(data)
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
