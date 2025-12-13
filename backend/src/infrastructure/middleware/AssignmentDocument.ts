import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";
import multer from "multer";

 
const storage = new CloudinaryStorage({
  
  cloudinary: cloudinary,
  params: (req, file) => ({

    folder: "Assignment_Document",
    resource_type: "raw",
    public_id: `${Date.now()}-${file.originalname}`,
  }),

});

export const Assignmentupload = multer({ storage });
