
import { Request,Response } from "express";
import { IInstituteUsecase } from "../../../../domain/UseCaseInterface/IInstituteProfileUseCase";
import { CreateInstituteDTO,DocumentDTO } from "../../../../applications/dto/InstituteProfilet";
import { Institute } from "../../../../domain/entities/Institute";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import logger from "../../../../shared/constants/Logger";
import mongoose from "mongoose";

export class InstituteProfileController {
    constructor(private createInstituteUseCase:IInstituteUsecase){}
    async createInstitute(req:Request,res:Response):Promise<void>{
        try {
            const dto : CreateInstituteDTO = req.body;
            console.log("i am reached ",dto)

          if (!dto.addressId || !mongoose.Types.ObjectId.isValid(dto.addressId)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid or missing addressId",
    })as unknown as void; ;
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


            const createInstitute = await this.createInstituteUseCase.execute(InstituteEntity)
           
            res.status(StatusCodes.CREATED).json({message:"Institute Created successfully",createInstitute})
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({Message:"Internal server error"})
            logger.info(error)
        }
    }
}