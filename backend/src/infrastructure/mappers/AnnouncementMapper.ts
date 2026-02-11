import { Announcement } from "../../domain/entities/Announcement/Announcement";
import { IAnnouncement } from "../database/models/Announcement/Announcement";

export class AnnouncementMapper {
    static toDomain(doc: any): Announcement {
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

    static toPersistence(entity: Announcement): any {
        return {
            title: entity.title,
            content: entity.content,
            scope: entity.scope,
            classes: entity.classes,
            division: entity.division,
            attachment: entity.attachment
                ? [
                    {
                        url: entity.attachment.url,
                        filename: entity.attachment.filename,
                        uploadAt: new Date(entity.attachment.uploadAt),
                    },
                ]
                : [],
            activeTime: entity.activeTime,
            endTime: entity.endTime,
            status: entity.status,
        };
    }
}
