
import { Request, Response } from "express";
import { IInstituteUsecase } from "../../../../applications/interface/UseCaseInterface/IInstituteProfileUseCase";
import { CreateInstituteDTO, DocumentDTO } from "../../../../applications/dto/InstituteProfilet";
import { Institute } from "../../../../domain/entities/Institute";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { IGetInstituteInterface } from '../../../../applications/interface/UseCaseInterface/IGetInstituteProfile'
import logger from "../../../../shared/constants/Logger";
import { IIInstituteProfileUpdate } from '../../../../applications/interface/UseCaseInterface/IInstProfileUpdateUseCase'
import mongoose from "mongoose";
import { validateInstituteProfile } from '../../../validators/InstituteValidation/InstituteValidators';


export class InstituteProfileController {
    constructor(
        private _createInstituteUseCase: IInstituteUsecase,
        private _getInstitute: IGetInstituteInterface,
         private _updateinsti: IIInstituteProfileUpdate
        ) { }
    async createInstitute(req: Request, res: Response): Promise<void> {
        try {

            const existingInstitutes = await this._getInstitute.execute();
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
 
            validateInstituteProfile(req.body);

            const logo = (req.files as Express.Multer.File[])?.map(file => ({
                url: file.path,
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

            const createInstitute = await this._createInstituteUseCase.execute(InstituteEntity);
            res.status(StatusCodes.CREATED).json({ message: "Institute Created successfully", createInstitute });
        } catch (error: unknown) {
            const err = error as Error;
            console.error(err.message);
            res.status(StatusCodes.BAD_REQUEST).json({
                message: err.message || "Failed to create parent"
            });
        }
    }


    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const institute = await this._getInstitute.execute()
            res.status(StatusCodes.CREATED).json({ message: "Its Server Error", institute })
        } catch (error: unknown) {
            const err = error as Error;
            console.error(err.message);
            res.status(StatusCodes.BAD_REQUEST).json({
                message: err.message || "Failed to create parent"
            });
        }
    }

    async updatProfile(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const update: CreateInstituteDTO = req.body;


            if (req.files && Array.isArray(req.files) && req.files.length > 0) {
                const newPhotos = req.files.map((file: Express.Multer.File) => ({
                    url: file.path,
                    filename: file.filename,
                    uploadedAt: new Date(),
                }));
                update.logo = newPhotos;
            }

            validateInstituteProfile(update, true);

            const updateinstprofile = await this._updateinsti.execute(id, update);
            res.status(StatusCodes.CREATED).json({ message: "Profile update successful", data: updateinstprofile });

        } catch (error: unknown) {
            const err = error as Error;
            logger.info(err.message);
            const statusCode = err.message?.includes("required") ||
                err.message?.includes("Invalid") ?
                StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR;

            res.status(statusCode).json({
                message: err.message || "Failed to update student",
            });
        }
    }
}
