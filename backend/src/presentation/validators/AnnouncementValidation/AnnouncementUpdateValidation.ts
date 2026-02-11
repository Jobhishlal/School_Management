import { Types } from "mongoose";
import { AnnouncementErrors } from "../../../domain/enums/AnnouncementError";
import { isValidText } from "../../../shared/constants/utils/textValidation";
import { Announcement } from "../../../domain/entities/Announcement/Announcement";

export function validateAnnouncementUpdate(
  data: Partial<Announcement>
) {
  if (data.title !== undefined && !isValidText(data.title)) {
    throw new Error(AnnouncementErrors.INVALID_TITLE);
  }

  if (data.content !== undefined && !isValidText(data.content)) {
    throw new Error(AnnouncementErrors.INVALID_CONTENT);
  }

  if (data.scope !== undefined) {
    if (!["GLOBAL", "CLASS", "DIVISION"].includes(data.scope)) {
      throw new Error(AnnouncementErrors.INVALID_SCOPE);
    }
  }


  if (data.division !== undefined && data.division !== null) {
    if (!isValidText(data.division)) {
      throw new Error(AnnouncementErrors.INVALID_DIVISION);
    }
  }

  if (data.attachment !== undefined) {
    if (!data.attachment.url || !data.attachment.filename) {
      throw new Error(AnnouncementErrors.INVALID_ATTACHMENT);
    }
  }

  if (data.activeTime && data.endTime) {
    const start = new Date(data.activeTime);
    const end = new Date(data.endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error(AnnouncementErrors.INVALID_DATE);
    }

    if (end < start) {
      throw new Error(AnnouncementErrors.INVALID_DATE);
    }
  }

  if (data.status !== undefined) {
    if (!["DRAFT", "ACTIVE"].includes(data.status)) {
      throw new Error(AnnouncementErrors.INVALID_STATUS);
    }
  }

  return true;
}
