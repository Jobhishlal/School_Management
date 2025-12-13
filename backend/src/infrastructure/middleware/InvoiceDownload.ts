import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";
import { file } from "pdfkit";


export const Invoiceurlstore = new CloudinaryStorage({
    cloudinary:cloudinary,
    params:(req,file)=>({
        folder:"invoice_download",
          resource_type: "auto",
       public_id: `${Date.now()}-${file.originalname}`,
    })
})


