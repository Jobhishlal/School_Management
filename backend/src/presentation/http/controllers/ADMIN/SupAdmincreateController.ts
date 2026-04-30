import { RESPONSE_MESSAGES } from "../../../../shared/constants/responseMessages";
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
    private _createsubUseCase: CreateSubAdmin,
    private _updatesubUseCase: UpdateDetails,
    private _subadminblockUseCase: SubAdminBlock
  ) { }

  async createSubAdmin(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, phone, role, blocked, major_role, dateOfBirth, gender, documents, addressId, photo } = req.body;
      logger.info(JSON.stringify(req.body));

      validateSubAdminCreate(req.body);

      const result = await this._createsubUseCase.execute({
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
        message: RESPONSE_MESSAGES.SUCCESSFULLY_CREATED_NEW_ADMIN_PASSWORD_SENT_TO_EM,
        subAdmin: result,
      });
    } catch (error: unknown) {
      logger.error((error as Error).message);

      if (
        (error as Error).message === "This email already exists" ||
        (error as Error).message === "This phone number already exists"
      ) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: (error as Error).message });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: (error as Error).message || "Internal Server Error" });
      }
    }
  }

  async getAllSubAdmins(req: Request, res: Response): Promise<void> {
    try {
      const subAdmins = await this._createsubUseCase.getAll();
      res.status(StatusCodes.OK).json(subAdmins);
    } catch (error: unknown) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
    }
  }

  async updatesubAdmin(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, phone, role, dateOfBirth, gender, documents, addressId, photo } = req.body;
      const { id } = req.params;

      validateSubAdminUpdate(req.body);

      const update = await this._updatesubUseCase.execute(id, {
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
        message: RESPONSE_MESSAGES.SUCCESSFULLY_UPDATED_SUBADMIN,
        subAdmin: update
      });
    } catch (error: unknown) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR_2 });
    }
  }

  async subadminblock(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { blocked } = req.body;

      const updated = await this._subadminblockUseCase.execute(id, blocked);
      res.status(StatusCodes.OK).json({
        message: blocked ? "SubAdmin blocked successfully" : "SubAdmin unblocked successfully",
        data: updated,
      });
    } catch (error: unknown) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: RESPONSE_MESSAGES.SERVER_ERROR });
    }
  }
}
