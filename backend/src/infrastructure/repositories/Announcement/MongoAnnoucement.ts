import { Announcement } from "../../../domain/entities/Announcement/Announcement";
import { AnnouncementModel } from "../../database/models/Announcement/Announcement";
import { IAnnouncementRepository } from "../../../applications/interface/RepositoryInterface/Announcement/IAnnouncement";
import { AnnouncementMapper } from "../../mappers/AnnouncementMapper";


export class AnnouncementMongo implements IAnnouncementRepository {

  async create(announcement: Announcement): Promise<Announcement> {
    const data = await AnnouncementModel.create(AnnouncementMapper.toPersistence(announcement));
    return AnnouncementMapper.toDomain(data);
  }

  async findAll(): Promise<Announcement[]> {
    const data = await AnnouncementModel.find();
    return data.map((d) => AnnouncementMapper.toDomain(d));
  }


  async findById(id: string): Promise<Announcement | null> {
    const data = await AnnouncementModel.findById(id);
    if (!data) return null;
    return AnnouncementMapper.toDomain(data);
  }

  async findForClass(classId: string): Promise<Announcement[]> {
    const announcements = await AnnouncementModel.find({
      status: "ACTIVE",
      $or: [
        { scope: "GLOBAL" },
        {
          scope: "CLASS",
          classes: { $in: [classId] }
        }
      ]
    }).sort({ createdAt: -1 });

    return announcements.map(doc => AnnouncementMapper.toDomain(doc));
  }

  async update(id: string, data: Announcement): Promise<Announcement> {
    const persistenceData = AnnouncementMapper.toPersistence(data);
    const updated = await AnnouncementModel.findByIdAndUpdate(
      id,
      { $set: persistenceData },
      { new: true }
    );

    if (!updated) throw new Error("Announcement not found");

    return AnnouncementMapper.toDomain(updated);
  }


  async delete(id: string): Promise<void> {
    const deleted = await AnnouncementModel.findByIdAndDelete(id);
    if (!deleted) throw new Error("Announcement not found");
  }

  async findLatest(limit: number): Promise<Announcement[]> {
    const data = await AnnouncementModel.find({ status: "ACTIVE" })
      .sort({ createdAt: -1 })
      .limit(limit);

    return data.map(doc => AnnouncementMapper.toDomain(doc));
  }
}
