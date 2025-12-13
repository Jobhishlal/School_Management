import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";
import multer from "multer";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => ({
    folder: "Assignment_Submissions",
    resource_type: "auto", 
    public_id: `${Date.now()}-${file.originalname}`,
  }),
});

export const assignmentUpload = multer({ storage });
