
import { Request,Response } from "express";
import { IInstituteUsecase } from "../../../../domain/UseCaseInterface/IInstituteProfileUseCase";
import { CreateInstituteDTO,DocumentDTO } from "../../../../applications/dto/InstituteProfilet";
import { Institute } from "../../../../domain/entities/Institute";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { IGetInstituteInterface } from "../../../../domain/UseCaseInterface/IGetInstituteProfile";
import logger from "../../../../shared/constants/Logger";
import {IIInstituteProfileUpdate} from '../../../../domain/UseCaseInterface/IInstProfileUpdateUseCase'
import mongoose from "mongoose";


export class InstituteProfileController {
    constructor(private createInstituteUseCase:IInstituteUsecase,private getInstitute:IGetInstituteInterface,private updateinsti:IIInstituteProfileUpdate){}
   async createInstitute(req: Request, res: Response): Promise<void> {
    try {
       
        const existingInstitutes = await this.getInstitute.execute();
        if (existingInstitutes.length > 0) {
             res.status(StatusCodes.FORBIDDEN).json({
                message: "Institute profile already exists. You can only update it.",
            });
        }

        const dto: CreateInstituteDTO = req.body;

        if (!dto.addressId || !mongoose.Types.ObjectId.isValid(dto.addressId)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Invalid or missing addressId",
            }) as unknown as void;
        }

        const logo = (req.files as Express.Multer.File[])?.map(file => ({
            url: (file as any).path,
            filename: file.filename,
            uploadedAt: new Date(),
        })) || [];

        const InstituteEntity = new Institute(
            "", 
            dto.instituteName,
            dto.contactInformation,
            dto.email,
            dto.phone,
            dto.addressId,
            dto.principalName,
            logo
        );

        const createInstitute = await this.createInstituteUseCase.execute(InstituteEntity);
        res.status(StatusCodes.CREATED).json({ message: "Institute Created successfully", createInstitute });
    } catch (error:any) {
        console.error(error.message);
         res.status(StatusCodes.BAD_REQUEST).json({
        message: error.message || "Failed to create parent"
        });
    }
}


    async getAll(req:Request,res:Response):Promise<void>{
        try {
            const institute = await this.getInstitute.execute()
            res.status(StatusCodes.CREATED).json({message:"Its Server Error",institute})
        } catch (error:any) {
             console.error(error.message);
         res.status(StatusCodes.BAD_REQUEST).json({
        message: error.message || "Failed to create parent"
        });
        }
    }
    
    async updatProfile(req:Request,res:Response):Promise<void>{
        try {
         const {id} = req.params;
         const update: CreateInstituteDTO = req.body;
        

        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        const newPhotos = req.files.map((file: any) => ({
        url: file.path, 
        filename: file.filename,
        uploadedAt: new Date(),
        }));
       update.logo = newPhotos;
     }

    const updateinstprofile = await this.updateinsti.execute(id, update);
    res.status(StatusCodes.CREATED).json({message:"Profile update successful", data: updateinstprofile});

        } catch (error:any) {
                logger.info(error.message);
            const statusCode = error.message?.includes("required") || 
                             error.message?.includes("Invalid") ? 
                             StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR;

            res.status(statusCode).json({
                message: error.message || "Failed to update student",
            });
        }
        }
    }
