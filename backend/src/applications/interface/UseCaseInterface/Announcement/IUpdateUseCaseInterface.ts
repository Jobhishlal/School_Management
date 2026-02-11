
import { UpdateAnnouncementDTO } from "../../../dto/Announcement/UpdateAnnouncementDTO";
import { Announcement } from "../../../../domain/entities/Announcement/Announcement";


export interface IAnnouncementUpdateUseCase {
  execute(
    id: string,
    data: UpdateAnnouncementDTO
  ): Promise<Announcement>;

}