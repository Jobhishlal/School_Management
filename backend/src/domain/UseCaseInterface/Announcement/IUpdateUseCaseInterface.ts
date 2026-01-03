
import { UpdateAnnouncementDTO } from "../../../applications/dto/UpdateAnnouncementDTO";
import { Announcement } from "../../entities/Announcement/Announcement";


export interface IAnnouncementUpdateUseCase{
   execute(
  id: string,
  data: Partial<Announcement>
): Promise<Announcement>;

}