import { IAnnouncementRepository } from "../../../domain/repositories/Announcement/IAnnouncement";
import { Announcement } from "../../../domain/entities/Announcement/Announcement";
import { IAnnouncementUpdateUseCase } from "../../../domain/UseCaseInterface/Announcement/IUpdateUseCaseInterface";
import { validateAnnouncementUpdate } from "../../validators/ValidateAnnouncementUpdate";

export class UpdateAnnouncementUseCase implements IAnnouncementUpdateUseCase
{
  constructor(
    private readonly repo: IAnnouncementRepository
  ) {}

  async execute( id: string,data: Partial<Announcement>): Promise<Announcement> {

    validateAnnouncementUpdate(data)

    const domainData: Partial<Announcement> = {
      title: data.title,
      content: data.content,
      scope: data.scope,
      classes: data.classes,
      division: data.division,
      attachment: data.attachment ?? undefined,
      activeTime: data.activeTime,
      endTime: data.endTime,
      status: data.status,
    };

    return this.repo.update(id, domainData);
  }
}
