import { Announcement } from "../../../../domain/entities/Announcement/Announcement";
import { CreateAnnouncementDTO } from "../../../applications/dto/AnnouncementDTO";

export interface IAnnoucementUseCase{
    execute(data:CreateAnnouncementDTO):Promise<Announcement>
}