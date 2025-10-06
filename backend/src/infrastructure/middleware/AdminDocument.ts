import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";
import multer from "multer";

 
const SupadminDocumetstorage = new CloudinaryStorage({
  
  cloudinary: cloudinary,
  params: (req, file) => ({

    folder: "subadmin_documents",
    resource_type: "auto",
    public_id: `${Date.now()}-${file.originalname}`,
  }),

});

export const upload = multer({ storage:SupadminDocumetstorage });
