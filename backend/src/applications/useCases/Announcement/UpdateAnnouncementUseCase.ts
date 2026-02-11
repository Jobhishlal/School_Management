import { IAnnouncementRepository } from "../../interface/RepositoryInterface/Announcement/IAnnouncement";
import { Announcement } from "../../../domain/entities/Announcement/Announcement";
import { IAnnouncementUpdateUseCase } from "../../interface/UseCaseInterface/Announcement/IUpdateUseCaseInterface";
import { UpdateAnnouncementDTO } from "../../dto/Announcement/UpdateAnnouncementDTO";

export class UpdateAnnouncementUseCase implements IAnnouncementUpdateUseCase {
  constructor(
    private readonly repo: IAnnouncementRepository
  ) { }

  async execute(id: string, data: UpdateAnnouncementDTO): Promise<Announcement> {

    const announcement = await this.repo.findById(id);
    if (!announcement) {
      throw new Error("Announcement not found");
    }

    if (data.title !== undefined) announcement.title = data.title;
    if (data.content !== undefined) announcement.content = data.content;
    if (data.scope !== undefined) announcement.scope = data.scope;
    if (data.classes !== undefined) announcement.classes = data.classes;
    if (data.division !== undefined) announcement.division = data.division;
    if (data.attachment !== undefined) announcement.attachment = data.attachment;
    if (data.activeTime !== undefined) announcement.activeTime = data.activeTime;
    if (data.endTime !== undefined) announcement.endTime = data.endTime;
    if (data.status !== undefined) announcement.status = data.status;

    return this.repo.update(id, announcement);
  }
}
