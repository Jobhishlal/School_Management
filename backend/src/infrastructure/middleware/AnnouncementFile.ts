
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";
import multer from "multer";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "Announcement_documents",
    resource_type: "auto",
    public_id: `${Date.now()}-${file.originalname}`,
  }),
});

export const AnnouncementAttachment = multer({ storage });
