import { IAnnouncementRepository } from "../../interface/RepositoryInterface/Announcement/IAnnouncement";

export class DeleteAnnouncementUseCase {
    constructor(private announcementRepo: IAnnouncementRepository) { }

    async execute(id: string): Promise<void> {
        if (!id) {
            throw new Error("Announcement ID is required");
        }
        await this.announcementRepo.delete(id);
    }
}
