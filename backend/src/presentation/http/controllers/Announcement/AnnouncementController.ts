import { Request, Response } from "express";
import { IAnnoucementUseCase } from "../../../../applications/interface/UseCaseInterface/Announcement/IAnnouncementUseCase";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { CreateAnnouncementDTO } from "../../../../applications/dto/Announcement/AnnouncementDTO";
import { IAnnouncementUpdateUseCase } from "../../../../applications/interface/UseCaseInterface/Announcement/IUpdateUseCaseInterface";
import { UpdateAnnouncementDTO } from "../../../../applications/dto/Announcement/UpdateAnnouncementDTO";

import { FindAllaanouncement } from "../../../../applications/interface/UseCaseInterface/Announcement/IAnnouncementFindAll";
import mongoose from "mongoose";
import { DeleteAnnouncementUseCase } from "../../../../applications/useCases/Announcement/DeleteAnnouncementUseCase";
import { ValidateAnnouncementCreate } from "../../../validators/AnnouncementValidation/AnnouncementCreateValidation";
import { validateAnnouncementUpdate } from "../../../validators/AnnouncementValidation/AnnouncementUpdateValidation";

export class AnnouncementController {
  constructor(
    private readonly repo: IAnnoucementUseCase,
    private readonly updaterepo: IAnnouncementUpdateUseCase,
    private readonly findall: FindAllaanouncement,
    private readonly deleteUseCase: DeleteAnnouncementUseCase

  ) { }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const values: CreateAnnouncementDTO = req.body;

      ValidateAnnouncementCreate(values);
      let attachment: CreateAnnouncementDTO["attachment"] = undefined;

      if (req.file) {
        const file = req.file as Express.Multer.File;



        attachment = {
          url: file.path,
          filename: file.originalname,
          uploadAt: new Date().toISOString(),

        }

      }


      const data = await this.repo.execute({
        ...values,
        attachment,
        activeTime: new Date(values.activeTime),
        endTime: new Date(values.endTime),
      });



      res.status(StatusCodes.OK).json({ success: true, data, message: "Announcement created" });

    } catch (error: any) {


      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Something went wrong during payment creation",
      });
    }
  }
  async UpdateAnnouncement(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        console.log('id', id)
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid announcement ID", success: false });
      }

      const data: UpdateAnnouncementDTO = req.body;



      if (req.file) {
        const file = req.file as any;
        data.attachment = {
          url: file.path || file.url || file.secure_url,
          filename: file.originalname,
          uploadAt: new Date().toISOString(),
        };
      } else {
        delete data.attachment;
      }

      validateAnnouncementUpdate(data);

      const update = await this.updaterepo.execute(id, data);

      if (!update) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "It is not possible to update", success: false });
        return;
      }

      res.status(StatusCodes.OK).json({ message: "Update successful", success: true });
    } catch (error: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Something went wrong during payment creation",
      });
    }
  }


  async FindAllAnnouncement(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.findall.execute()
      if (!data) {
        res.status(StatusCodes.BAD_REQUEST)
          .json({ message: "data fetching is not possible", suuccess: false })
      }
      res.status(StatusCodes.OK)
        .json({ message: "data fetching successfully", success: true, data })


    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "internal server error", error })

    }

  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.deleteUseCase.execute(id);
      res.status(StatusCodes.OK).json({ success: true, message: "Announcement deleted successfully" });
    } catch (error: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Failed to delete announcement",
      });
    }
  }

}