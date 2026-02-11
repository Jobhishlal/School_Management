import { CreateSubAdmin } from '../../../../applications/useCases/admin/CreatetSubAdmin';
import { Request, Response } from 'express';
import { AdminRole } from '../../../../domain/enums/AdminRole';
import { StatusCodes } from '../../../../shared/constants/statusCodes';
import { ISubAdminCreate } from '../../interface/ISubAdminController';
import logger from '../../../../shared/constants/Logger';
import { UpdateDetails } from '../../../../applications/useCases/admin/UpdateSubAdmin';
import { SubAdminBlock } from '../../../../applications/useCases/admin/SubAdminBlock';
import { validateSubAdminCreate, validateSubAdminUpdate } from '../../../validators/SubAdminValidation/SubAdminValidators';

export class SubAdminCreateController implements ISubAdminCreate {
  constructor(
    private createsubUseCase: CreateSubAdmin,
    private updatesubUseCase: UpdateDetails,
    private subadminblockUseCase: SubAdminBlock
  ) { }

  async createSubAdmin(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, phone, role, blocked, major_role, dateOfBirth, gender, documents, addressId, photo } = req.body;
      logger.info(JSON.stringify(req.body));

      validateSubAdminCreate(req.body);

      const result = await this.createsubUseCase.execute({
        name,
        email,
        phone,
        role,
        blocked,
        major_role,
        dateOfBirth,
        gender,
        documents,
        addressId,
        photo
      });

      res.status(StatusCodes.OK).json({
        message: "Successfully created New Admin. Password sent to email.",
        subAdmin: result,
      });
    } catch (error: any) {
      logger.error(error.message);

      if (
        error.message === "This email already exists" ||
        error.message === "This phone number already exists"
      ) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message || "Internal Server Error" });
      }
    }
  }

  async getAllSubAdmins(req: Request, res: Response): Promise<void> {
    try {
      const subAdmins = await this.createsubUseCase.getAll();
      res.status(StatusCodes.OK).json(subAdmins);
    } catch (error: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  async updatesubAdmin(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, phone, role, dateOfBirth, gender, documents, addressId, photo } = req.body;
      const { id } = req.params;

      validateSubAdminUpdate(req.body);

      const update = await this.updatesubUseCase.execute(id, {
        name,
        email,
        phone,
        role,
        dateOfBirth,
        gender,
        documents,
        addressId,
        photo
      });

      res.status(StatusCodes.OK).json({
        message: "Successfully updated SubAdmin",
        subAdmin: update
      });
    } catch (error: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
  }

  async subadminblock(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { blocked } = req.body;

      const updated = await this.subadminblockUseCase.execute(id, blocked);
      res.status(StatusCodes.OK).json({
        message: blocked ? "SubAdmin blocked successfully" : "SubAdmin unblocked successfully",
        data: updated,
      });
    } catch (error: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server Error" });
    }
  }
}
