import { Announcement } from "../../entities/Announcement/Announcement";

export interface FindAllaanouncement{
    execute():Promise<Announcement[]>
}