import { AnnouncementErrors } from "../../domain/enums/AnnouncementError";
import { CreateAnnouncementDTO } from "../dto/AnnouncementDTO";
import { isValidText } from "../../shared/constants/utils/textValidation";



export function ValidateAnnouncementCreate(data:CreateAnnouncementDTO){
    if (
    !data.title ||
    !data.content ||
    !data.scope ||
    !data.activeTime ||
    !data.endTime
  ) {
    throw new Error(AnnouncementErrors.REQUIRED);
  }
  if (
    data.title.trim().length < 3 ||
    data.title.trim().length > 100 ||
    !isValidText(data.title)
  ) {
    throw new Error(AnnouncementErrors.INVALID_TITLE);
  }

   if (
    data.content.trim().length < 5 ||
    data.content.trim().length > 5000 ||
    !isValidText(data.content)
  ) {
    throw new Error(AnnouncementErrors.INVALID_CONTENT);
  }
  if (!["GLOBAL", "CLASS", "DIVISION"].includes(data.scope)) {
    throw new Error(AnnouncementErrors.INVALID_SCOPE);
  }

    const start = new Date(data.activeTime);
     const end = new Date(data.endTime);
    if (end < start) {
     throw new Error(AnnouncementErrors.INVALID_DATE);
    }

    if (data.attachment) {
     if (
       !data.attachment.url ||
       !data.attachment.filename ||
       !data.attachment.uploadAt
      ) {
      throw new Error(AnnouncementErrors.INVALID_ATTACHMENT);
      }
    }
    if (data.status && !["DRAFT", "ACTIVE"].includes(data.status)) {
      throw new Error(AnnouncementErrors.INVALID_STATUS);
     }

  return true;
}