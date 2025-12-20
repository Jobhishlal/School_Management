import { Announcement } from "../../../domain/entities/Announcement/Announcement";
import { AnnouncementModel } from "../../database/models/Announcement/Announcement";
import { IAnnouncementRepository } from "../../../domain/repositories/Announcement/IAnnouncement";


export class AnnouncementMongo implements IAnnouncementRepository{
    
   async create(announcement: Announcement): Promise<Announcement> {
    const data = await AnnouncementModel.create({
        title: announcement.title,
        content: announcement.content,
        scope: announcement.scope,
        classes: announcement.classes,
        division: announcement.division,
        attachment: announcement.attachment ? [announcement.attachment] : [],
        activeTime: announcement.activeTime,
        endTime: announcement.endTime,
        status: announcement.status,
    });

   return new Announcement(
  data._id?.toString(),       
  data.title,              
  data.content,              
  data.scope,                 
  data.classes ?? [],         
  data.division ?? null,    
  data.attachment && data.attachment.length > 0
    ? {
        url: data.attachment[0].url,
        filename: data.attachment[0].filename,
        uploadAt: data.attachment[0].uploadAt.toISOString(),
      }
    : undefined,             
  data.activeTime,            
  data.endTime,             
  data.status                 
);

}

 async findAll(): Promise<Announcement[]> {
  const data = await AnnouncementModel.find();

  return data.map((d) =>
    new Announcement(
      d.id.toString(),           
      d.title,                      
      d.content,                
      d.scope,                     
      d.classes ?? [],              
      d.division ?? null,          
      d.attachment && d.attachment.length > 0
        ? {
            url: d.attachment[0].url,
            filename: d.attachment[0].filename,
            uploadAt: d.attachment[0].uploadAt.toISOString(),
          }
        : undefined,               
      d.activeTime,                 
      d.endTime,                   
      d.status                    
  ));
}


async findById(id: string): Promise<Announcement | null> {
  const data = await AnnouncementModel.findById(id);
  if (!data) return null;

   return new Announcement(
  data._id?.toString(),       
  data.title,              
  data.content,              
  data.scope,                 
  data.classes ?? [],         
  data.division ?? null,    
  data.attachment && data.attachment.length > 0
    ? {
        url: data.attachment[0].url,
        filename: data.attachment[0].filename,
        uploadAt: data.attachment[0].uploadAt.toISOString(),
      }
    : undefined,             
  data.activeTime,            
  data.endTime,             
  data.status                 
);
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

  return announcements.map(doc => this.toDomain(doc));
}
private toDomain(doc: any): Announcement {
  return new Announcement(
    doc._id?.toString(),
    doc.title,
    doc.content,
    doc.scope,
    doc.classes ?? [],
    doc.division ?? null,
    doc.attachment && doc.attachment.length > 0
      ? {
          url: doc.attachment[0].url,
          filename: doc.attachment[0].filename,
          uploadAt: doc.attachment[0].uploadAt.toISOString(),
        }
      : undefined,
    doc.activeTime,
    doc.endTime,
    doc.status
  );
}

async update(id: string, data: Announcement): Promise<Announcement> {
  const updated = await AnnouncementModel.findByIdAndUpdate(
    id,
    {
      $set: {
        title: data.title,
        content: data.content,
        scope: data.scope,
        classes: data.classes,
        division: data.division,
        attachment: data.attachment
          ? [{
              url: data.attachment.url,
              filename: data.attachment.filename,
              uploadAt: new Date(data.attachment.uploadAt),
            }]
          : [],
        activeTime: data.activeTime,
        endTime: data.endTime,
        status: data.status,
      },
    },
    { new: true }
  );

  if (!updated) throw new Error("Announcement not found");

  return this.toDomain(updated);
}

       
}