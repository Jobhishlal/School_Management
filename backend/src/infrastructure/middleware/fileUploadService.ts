import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";
import multer from "multer";


const storage = new CloudinaryStorage({

  cloudinary: cloudinary,
  params: async (req, file) => {
    let resourceType = 'auto';
    if (file.mimetype.startsWith('image/')) {
      resourceType = 'image';
    } else if (file.mimetype.startsWith('video/') || file.mimetype.startsWith('audio/')) {
      resourceType = 'video';
    } else {
      resourceType = 'raw';
    }

    const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');

    return {
      folder: "teacher_documents",
      resource_type: resourceType,
      public_id: `${Date.now()}-${sanitizedFilename}`,
      use_filename: true,
      unique_filename: true
    };
  },

});

export const upload = multer({ storage });
