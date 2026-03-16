import { Announcement } from "../../../../domain/entities/Announcement/Announcement";
import { CreateAnnouncementDTO } from "../../../dto/Announcement/AnnouncementDTO";
export interface IAnnoucementUseCase{
    execute(data:CreateAnnouncementDTO):Promise<Announcement>
}