import { Announcement } from "../../../../domain/entities/Announcement/Announcement";

export interface FindAllaanouncement{
    execute():Promise<Announcement[]>
}