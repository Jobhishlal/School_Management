import { Announcement } from "../../../domain/entities/Announcement/Announcement";
import { AnnouncementErrors } from "../../../domain/enums/AnnouncementError";

export function validateAnnouncementCreate(data: ReturnType<typeof JSON.parse>): void {
    if (
        !data.title ||
        !data.content ||
        !data.scope ||
        !data.activeTime ||
        !data.endTime
    ) {
        throw new Error(AnnouncementErrors.REQUIRED);
    }
    Announcement.validate(data);
}

export function validateAnnouncementUpdate(data: ReturnType<typeof JSON.parse>): void {
    Announcement.validate(data);
}
