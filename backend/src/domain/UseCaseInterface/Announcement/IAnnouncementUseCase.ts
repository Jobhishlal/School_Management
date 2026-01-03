import { Announcement } from "../../entities/Announcement/Announcement";
import { CreateAnnouncementDTO } from "../../../applications/dto/AnnouncementDTO";

export interface IAnnoucementUseCase{
    execute(data:CreateAnnouncementDTO):Promise<Announcement>
}