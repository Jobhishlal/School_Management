import { Announcement } from "../../entities/Announcement/Announcement";


export interface IAnnouncementRepository {
  create(announcement: Announcement): Promise<Announcement>;
  findAll(): Promise<Announcement[]>
  findById(id: string): Promise<Announcement | null>
  findForClass(classId: string): Promise<Announcement[]>;
  update(
    id: string,
    data: Partial<Announcement>
  ): Promise<Announcement>;
  delete(id: string): Promise<void>;

}
