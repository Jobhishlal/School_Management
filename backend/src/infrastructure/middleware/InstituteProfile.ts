
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";
import multer from "multer";

const InstituteStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: "institute_logo", 
    resource_type: "auto",
    public_id: `${Date.now()}-${file.originalname}`,
  }),
});

export const instituteUpload = multer({ storage: InstituteStorage });
