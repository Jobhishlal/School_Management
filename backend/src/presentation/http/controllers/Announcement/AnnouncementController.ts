import { RESPONSE_MESSAGES } from "../../../../shared/constants/responseMessages";
import { Request, Response } from "express";
import { IAnnoucementUseCase } from "../../../../applications/interface/UseCaseInterface/Announcement/IAnnouncementUseCase";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { CreateAnnouncementDTO } from "../../../../applications/dto/Announcement/AnnouncementDTO";
import { IAnnouncementUpdateUseCase } from "../../../../applications/interface/UseCaseInterface/Announcement/IUpdateUseCaseInterface";
import { UpdateAnnouncementDTO } from "../../../../applications/dto/Announcement/UpdateAnnouncementDTO";

import { FindAllaanouncement } from "../../../../applications/interface/UseCaseInterface/Announcement/IAnnouncementFindAll";
import mongoose from "mongoose";
import { DeleteAnnouncementUseCase } from "../../../../applications/useCases/Announcement/DeleteAnnouncementUseCase";
import { validateAnnouncementCreate, validateAnnouncementUpdate } from "../../../validators/AnnouncementValidation/AnnouncementValidators";

export class AnnouncementController {
  constructor(
    private readonly _repo: IAnnoucementUseCase,
    private readonly _updaterepo: IAnnouncementUpdateUseCase,
    private readonly _findall: FindAllaanouncement,
    private readonly _deleteUseCase: DeleteAnnouncementUseCase

  ) { }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const values: CreateAnnouncementDTO = req.body;

      validateAnnouncementCreate(values);
      let attachment: CreateAnnouncementDTO["attachment"] = undefined;

      if (req.file) {
        const file = req.file as Express.Multer.File;



        attachment = {
          url: file.path,
          filename: file.originalname,
          uploadAt: new Date().toISOString(),

        }

      }


      const data = await this._repo.execute({
        ...values,
        attachment,
        activeTime: new Date(values.activeTime),
        endTime: new Date(values.endTime),
      });



      res.status(StatusCodes.OK).json({ success: true, data, message: RESPONSE_MESSAGES.ANNOUNCEMENT_CREATED });

    } catch (error: unknown) {


      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message || "Something went wrong during payment creation",
      });
    }
  }
  async UpdateAnnouncement(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        console.log('id', id)
        res.status(StatusCodes.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.INVALID_ANNOUNCEMENT_ID, success: false });
      }

      const data: UpdateAnnouncementDTO = req.body;



      if (req.file) {
        const file = req.file as ReturnType<typeof JSON.parse>;
        data.attachment = {
          url: file.path || file.url || file.secure_url,
          filename: file.originalname,
          uploadAt: new Date().toISOString(),
        };
      } else {
        delete data.attachment;
      }

      validateAnnouncementUpdate(data);

      const update = await this._updaterepo.execute(id, data);

      if (!update) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.IT_IS_NOT_POSSIBLE_TO_UPDATE, success: false });
        return;
      }

      res.status(StatusCodes.OK).json({ message: RESPONSE_MESSAGES.UPDATE_SUCCESSFUL, success: true });
    } catch (error: unknown) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message || "Something went wrong during payment creation",
      });
    }
  }


  async FindAllAnnouncement(req: Request, res: Response): Promise<void> {
    try {
      const data = await this._findall.execute()
      if (!data) {
        res.status(StatusCodes.BAD_REQUEST)
          .json({ message: RESPONSE_MESSAGES.DATA_FETCHING_IS_NOT_POSSIBLE, suuccess: false })
      }
      res.status(StatusCodes.OK)
        .json({ message: RESPONSE_MESSAGES.DATA_FETCHING_SUCCESSFULLY, success: true, data })


    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR_1, error })

    }

  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this._deleteUseCase.execute(id);
      res.status(StatusCodes.OK).json({ success: true, message: RESPONSE_MESSAGES.ANNOUNCEMENT_DELETED_SUCCESSFULLY });
    } catch (error: unknown) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message || "Failed to delete announcement",
      });
    }
  }

}