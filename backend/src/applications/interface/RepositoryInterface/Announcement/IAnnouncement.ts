import { Announcement } from "../../../../domain/entities/Announcement/Announcement";


export interface IAnnouncementRepository {
  create(announcement: Announcement): Promise<Announcement>;
  findAll(): Promise<Announcement[]>
  findById(id: string): Promise<Announcement | null>
  findForClass(classId: string): Promise<Announcement[]>;
  update(
    id: string,
    data: Announcement
  ): Promise<Announcement>;
  delete(id: string): Promise<void>;
  findLatest(limit: number): Promise<Announcement[]>;
}
