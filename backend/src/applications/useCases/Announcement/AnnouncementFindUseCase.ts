import { FindAllaanouncement } from "../../../domain/UseCaseInterface/Announcement/IAnnouncementFindAll";
import { Announcement } from "../../../domain/entities/Announcement/Announcement";
import { IAnnouncementRepository } from "../../../domain/repositories/Announcement/IAnnouncement";



export class FindAllAnnoucenemt implements FindAllaanouncement{
    constructor(private readonly repo:IAnnouncementRepository){}

    async execute(): Promise<Announcement[]> {
        const data = await this.repo.findAll()
        return data
    }
}