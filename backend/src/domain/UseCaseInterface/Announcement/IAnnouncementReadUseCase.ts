import { Announcement } from "../../entities/Announcement/Announcement";
import { FindAnnouncementInput } from "../../../applications/dto/FindAnnouncementInput ";

export interface IAnnoucementfindclassBase {
  execute(input: FindAnnouncementInput): Promise<Announcement[]>;
}