import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";
import multer from "multer";

const subStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: "subadmin_photos", 
    resource_type: "auto",
    public_id: `${Date.now()}-${file.originalname}`,
  }),
});

export const studentUpload = multer({ storage: subStorage });
