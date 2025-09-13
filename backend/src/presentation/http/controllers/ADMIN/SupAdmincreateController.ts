import { CreateSubAdmin } from '../../../../applications/useCases/CreatetSubAdmin';
import { Request, Response } from 'express';
import { AdminRole } from '../../../../domain/entities/AdminRole';
import { StatusCodes } from '../../../../shared/constants/statusCodes';
import { ISubAdminCreate } from '../../interface/ISubAdminController';

export class SubAdminCreateController implements ISubAdminCreate {
  constructor(private createsubUseCase: CreateSubAdmin) {}

  async createSubAdmin(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, phone, role } = req.body;
      console.log("check", req.body);

      if (!Object.values(AdminRole).includes(role)) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Role is Not Existed" });
        return;
      }

      const result = await this.createsubUseCase.execute({
        name,
        email,
        phone,
        role,
      });

      res.status(StatusCodes.OK).json({
        message: "Successfully created New Admin. Password sent to email.",
        subAdmin: result,
      });
    } catch (error: any) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  async getAllSubAdmins(req: Request, res: Response): Promise<void> {
    try {
      const subAdmins = await this.createsubUseCase.getAll();
      res.status(StatusCodes.OK).json(subAdmins);
    } catch (error: any) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
}
