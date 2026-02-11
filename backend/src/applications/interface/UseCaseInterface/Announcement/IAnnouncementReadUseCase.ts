import { Announcement } from "../../../../domain/entities/Announcement/Announcement";
import { FindAnnouncementInput } from "../../../dto/FindAnnouncementInput ";

export interface IAnnoucementfindclassBase {
  execute(input: FindAnnouncementInput): Promise<Announcement[]>;
}